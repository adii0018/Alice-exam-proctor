import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from bson import ObjectId
from ..models import Flag, users_collection, quizzes_collection
from ..authentication import require_role
from ..models import flags_collection


def serialize_flag(flag):
    """Convert MongoDB flag to JSON-serializable format"""
    flag['_id'] = str(flag['_id'])
    flag['quiz_id'] = str(flag['quiz_id'])
    flag['student_id'] = str(flag['student_id'])
    return flag


@csrf_exempt
@require_http_methods(["GET"])
@require_role('teacher')
def list_flags(request):
    try:
        teacher_id = request.user['_id']
        teacher_quizzes = list(quizzes_collection.find({'teacher_id': teacher_id}, {'_id': 1}))
        quiz_ids = [q['_id'] for q in teacher_quizzes]
        if not quiz_ids:
            return JsonResponse([], safe=False)

        flags = list(flags_collection.find({'quiz_id': {'$in': quiz_ids}}))

        # Enrich with student names and quiz titles
        student_ids = list({f['student_id'] for f in flags if f.get('student_id')})
        quiz_ids = list({f['quiz_id'] for f in flags if f.get('quiz_id')})

        students = {str(s['_id']): s.get('name', 'Unknown')
                    for s in users_collection.find({'_id': {'$in': student_ids}}, {'name': 1})}
        quizzes  = {str(q['_id']): q.get('title', 'Unknown')
                    for q in quizzes_collection.find({'_id': {'$in': quiz_ids}}, {'title': 1})}

        result = []
        for f in flags:
            f = serialize_flag(f)
            f['student_name'] = students.get(f['student_id'], 'Unknown')
            f['quiz_title']   = quizzes.get(f['quiz_id'], 'Unknown')
            result.append(f)

        return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
@require_role('student')
def create_flag(request):
    try:
        data = json.loads(request.body)
        quiz_id = data.get('quiz_id')
        flag_type = data.get('type')
        severity = data.get('severity', 'medium')
        timestamp = data.get('timestamp')
        metadata = data.get('metadata', {})
        
        if not all([quiz_id, flag_type, timestamp]):
            return JsonResponse({'error': 'Missing required fields'}, status=400)
        
        flag_id = Flag.create(
            ObjectId(quiz_id),
            request.user['_id'],
            flag_type,
            severity,
            timestamp,
            metadata=metadata
        )
        
        return JsonResponse({'flag_id': str(flag_id)})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
@require_role('teacher')
def get_quiz_flags_by_student(request, quiz_id):
    """
    Get all flags for a quiz grouped by student with names + emails
    GET /api/flags/quiz/<quiz_id>/students/
    """
    try:
        # Verify quiz belongs to this teacher
        quiz = quizzes_collection.find_one({'_id': ObjectId(quiz_id)})
        if not quiz or str(quiz.get('teacher_id')) != str(request.user['_id']):
            return JsonResponse({'error': 'Forbidden'}, status=403)

        flags = list(flags_collection.find({'quiz_id': ObjectId(quiz_id)}).sort('timestamp', -1))

        # Group by student
        student_map = {}
        for f in flags:
            sid = str(f['student_id'])
            if sid not in student_map:
                student_map[sid] = {'student_id': sid, 'student_name': 'Unknown', 'student_email': '', 'violations': []}
            student_map[sid]['violations'].append({
                'type': f.get('type', 'UNKNOWN'),
                'severity': f.get('severity', 'medium'),
                'face_count': f.get('metadata', {}).get('face_count'),
                'metadata': f.get('metadata', {}),
                'timestamp': f['timestamp'] if isinstance(f['timestamp'], str) else str(f['timestamp']),
            })

        # Enrich with student names + emails
        if student_map:
            student_ids = [ObjectId(sid) for sid in student_map.keys()]
            students = list(users_collection.find({'_id': {'$in': student_ids}}, {'name': 1, 'email': 1}))
            for s in students:
                sid = str(s['_id'])
                if sid in student_map:
                    student_map[sid]['student_name'] = s.get('name', 'Unknown')
                    student_map[sid]['student_email'] = s.get('email', '')

        result = sorted(student_map.values(), key=lambda x: len(x['violations']), reverse=True)
        return JsonResponse({'students': result})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["PUT"])
@require_role('teacher')
def update_flag(request, flag_id):
    try:
        data = json.loads(request.body)
        status = data.get('status')
        
        if not status:
            return JsonResponse({'error': 'Missing status'}, status=400)
        
        # Ensure this flag belongs to a quiz created by the current teacher
        flag = flags_collection.find_one({'_id': ObjectId(flag_id)})
        if not flag:
            return JsonResponse({'error': 'Flag not found'}, status=404)

        quiz_id_obj = flag.get('quiz_id')
        quiz = quizzes_collection.find_one({'_id': quiz_id_obj, 'teacher_id': request.user['_id']})
        if not quiz:
            return JsonResponse({'error': 'Unauthorized'}, status=403)

        result = Flag.update_status(flag_id, status)
        if result.modified_count == 0:
            return JsonResponse({'error': 'Flag not found'}, status=404)
        
        return JsonResponse({'message': 'Flag updated successfully'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
