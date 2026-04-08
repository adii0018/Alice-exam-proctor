import json
from datetime import datetime, timedelta

from bson import ObjectId
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from ..authentication import require_role
from ..models import quizzes_collection, submissions_collection, flags_collection, users_collection


def _iso(value):
    """Best-effort datetime normalization for JSON."""
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.isoformat()
    # Some callers might pass strings already.
    if isinstance(value, str):
        return value
    return str(value)


def _parse_iso_date(s):
    try:
        return datetime.fromisoformat(s).date()
    except Exception:
        return None


@csrf_exempt
@require_http_methods(["GET"])
@require_role("student")
def student_dashboard(request):
    """
    Student-scoped dashboard.
    Returns:
      - available_exams (active quizzes not yet attempted by this student)
      - attempted_exams (submissions enriched with quiz data)
      - recent_alerts (flags for this student)
      - stats (totals + averages)
    """
    try:
        student_id = request.user["_id"]

        # -------- Attempted exams (submissions) --------
        submissions = list(
            submissions_collection.find({"student_id": student_id}).sort("submitted_at", -1)
        )
        attempted_quiz_ids = {str(s.get("quiz_id")) for s in submissions if s.get("quiz_id")}

        attempted_exams = []
        total_score = 0.0
        total_time_seconds = 0
        pass_count = 0

        quiz_ids_in_submissions = list({s["quiz_id"] for s in submissions if s.get("quiz_id")})
        quiz_map = {}
        if quiz_ids_in_submissions:
            for q in quizzes_collection.find(
                {"_id": {"$in": quiz_ids_in_submissions}},
                {"title": 1, "code": 1, "questions": 1, "duration": 1, "teacher_id": 1},
            ):
                quiz_map[str(q["_id"])] = q

        # Teacher names (for attempted exams + availability)
        teacher_ids = list(
            {q.get("teacher_id") for q in quiz_map.values() if q.get("teacher_id") is not None}
        )
        teacher_names = {}
        if teacher_ids:
            for u in users_collection.find(
                {"_id": {"$in": teacher_ids}},
                {"name": 1},
            ):
                teacher_names[str(u["_id"])] = u.get("name", "Unknown")

        for s in submissions:
            quiz_id = s.get("quiz_id")
            quiz = quiz_map.get(str(quiz_id), {})
            questions_count = len(quiz.get("questions") or [])
            score_percentage = s.get("score", 0) or 0
            total_score += float(score_percentage)
            if float(score_percentage) >= 60:
                pass_count += 1

            time_spent = s.get("time_spent", 0) or 0
            total_time_seconds += int(time_spent)

            attempted_exams.append(
                {
                    "quiz_id": str(quiz_id),
                    "quiz_title": quiz.get("title", "Unknown"),
                    "quiz_code": quiz.get("code"),
                    "quiz_duration": quiz.get("duration"),
                    "questions_count": questions_count,
                    "submitted_at": _iso(s.get("submitted_at")),
                    "score_percentage": float(score_percentage),
                    "time_spent_seconds": int(time_spent),
                    "proctoring_report": s.get("proctoring_report") or {},
                    "teacher_name": teacher_names.get(str(quiz.get("teacher_id")), "Unknown"),
                }
            )

        total_attempts = len(submissions)
        average_score = round(total_score / total_attempts, 2) if total_attempts else 0.0
        pass_rate = round((pass_count / total_attempts) * 100, 2) if total_attempts else 0.0

        # -------- Available exams (active + not attempted) --------
        active_quizzes = list(quizzes_collection.find({"is_active": True}))

        # Filter out quizzes the student has already attempted.
        available_quizzes = [q for q in active_quizzes if str(q.get("_id")) not in attempted_quiz_ids]

        teacher_ids_for_available = list(
            {q.get("teacher_id") for q in available_quizzes if q.get("teacher_id") is not None}
        )
        teacher_names_available = {}
        if teacher_ids_for_available:
            for u in users_collection.find(
                {"_id": {"$in": teacher_ids_for_available}},
                {"name": 1},
            ):
                teacher_names_available[str(u["_id"])] = u.get("name", "Unknown")

        available_exams = [
            {
                "quiz_id": str(q.get("_id")),
                "quiz_title": q.get("title", "Unknown"),
                "quiz_code": q.get("code"),
                "quiz_duration": q.get("duration"),
                "questions_count": len(q.get("questions") or []),
                "teacher_name": teacher_names_available.get(str(q.get("teacher_id")), "Unknown"),
                "is_active": bool(q.get("is_active", False)),
            }
            for q in available_quizzes
        ]

        # -------- Recent alerts (flags) --------
        recent_flags = list(
            flags_collection.find({"student_id": student_id}).sort("timestamp", -1).limit(10)
        )

        quiz_ids_in_flags = list({f.get("quiz_id") for f in recent_flags if f.get("quiz_id")})
        flag_quiz_map = {}
        if quiz_ids_in_flags:
            for q in quizzes_collection.find(
                {"_id": {"$in": quiz_ids_in_flags}},
                {"title": 1, "code": 1},
            ):
                flag_quiz_map[str(q["_id"])] = q

        recent_alerts = []
        for f in recent_flags:
            quiz_id = f.get("quiz_id")
            metadata = f.get("metadata") or {}
            recent_alerts.append(
                {
                    "flag_id": str(f.get("_id")),
                    "quiz_id": str(quiz_id) if quiz_id is not None else None,
                    "quiz_title": flag_quiz_map.get(str(quiz_id), {}).get("title", "Unknown"),
                    "type": f.get("type"),
                    "severity": f.get("severity"),
                    "status": f.get("status"),
                    "timestamp": _iso(f.get("timestamp")),
                    "metadata": metadata,
                }
            )

        total_alerts = flags_collection.count_documents({"student_id": student_id})
        total_time_hours = round(total_time_seconds / 3600.0, 2) if total_time_seconds else 0.0

        # -------- Activity (last 7 days avg score) --------
        # Use attempted submissions, since that's what we can score reliably.
        today = datetime.utcnow().date()
        day_bucket = [today - timedelta(days=i) for i in range(6, -1, -1)]
        bucket_set = set(day_bucket)
        score_by_day = {d: [] for d in day_bucket}

        for s in submissions:
            submitted_at = s.get("submitted_at")
            if isinstance(submitted_at, datetime):
                d = submitted_at.date()
            elif isinstance(submitted_at, str):
                d = _parse_iso_date(submitted_at)
            else:
                d = None
            if d in bucket_set:
                score_by_day[d].append(s.get("score", 0) or 0)

        activity_scores = [
            round(sum(scores) / len(scores), 2) if scores else 0.0 for d, scores in score_by_day.items()
        ]

        return JsonResponse(
            {
                "available_exams": available_exams,
                "attempted_exams": attempted_exams,
                "recent_alerts": recent_alerts,
                "stats": {
                    "total_attempts": total_attempts,
                    "average_score": average_score,
                    "pass_rate": pass_rate,
                    "total_alerts": total_alerts,
                    "total_time_hours": total_time_hours,
                    "available_exams_count": len(available_exams),
                    "completion_rate": (
                        round(
                            (total_attempts / max(total_attempts + len(available_exams), 1)) * 100,
                            2,
                        )
                        if (total_attempts + len(available_exams)) > 0
                        else 0.0
                    ),
                    "activity_scores_last_7_days": activity_scores,
                },
            }
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


