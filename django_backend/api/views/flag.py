import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from bson import ObjectId
from ..models import Flag, users_collection, quizzes_collection
from ..authentication import require_auth


def serialize_flag(flag):
    """Convert MongoDB flag to JSON-serializable format"""
    flag['_id'] = str(flag['_id'])
    flag['quiz_id'] = str(flag['quiz_id'])
    flag['student_id'] = str(flag['student_id'])
    return flag


@csrf_exempt
@require_http_methods(["GET"])
@require_auth
def list_flags(request):
    try:
        flags = Flag.find_all()

        # Enrich with student names and quiz titles
        student_ids = list({ObjectId(f['student_id']) for f in flags if f.get('student_id')})
        quiz_ids    = list({ObjectId(f['quiz_id'])    for f in flags if f.get('quiz_id')})

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
@require_auth
def create_flag(request):
    try:
        data = json.loads(request.body)
        quiz_id = data.get('quiz_id')
        flag_type = data.get('type')
        severity = data.get('severity', 'medium')
        timestamp = data.get('timestamp')
        
        if not all([quiz_id, flag_type, timestamp]):
            return JsonResponse({'error': 'Missing required fields'}, status=400)
        
        flag_id = Flag.create(
            ObjectId(quiz_id),
            request.user['_id'],
            flag_type,
            severity,
            timestamp
        )
        
        return JsonResponse({'flag_id': str(flag_id)})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["PUT"])
@require_auth
def update_flag(request, flag_id):
    try:
        data = json.loads(request.body)
        status = data.get('status')
        
        if not status:
            return JsonResponse({'error': 'Missing status'}, status=400)
        
        result = Flag.update_status(flag_id, status)
        if result.modified_count == 0:
            return JsonResponse({'error': 'Flag not found'}, status=404)
        
        return JsonResponse({'message': 'Flag updated successfully'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
