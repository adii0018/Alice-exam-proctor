from datetime import datetime
from bson import ObjectId
from ..models import Violation, Quiz, quizzes_collection, violations_collection, users_collection

class ViolationService:
    @staticmethod
    def serialize_violation(violation):
        return {
            '_id': str(violation['_id']),
            'quiz_id': str(violation['quiz_id']),
            'student_id': str(violation['student_id']),
            'violation_type': violation['violation_type'],
            'face_count': violation.get('face_count'),
            'severity': violation['severity'],
            'timestamp': violation['timestamp'].isoformat() if isinstance(violation['timestamp'], datetime) else violation['timestamp'],
            'metadata': violation.get('metadata', {}),
            'status': violation.get('status', 'active')
        }

    @staticmethod
    def create_violation(user, data):
        quiz_id = data.get('quiz_id')
        violation_type = data.get('violation_type')
        face_count = data.get('face_count')
        severity = data.get('severity', 'medium')
        metadata = data.get('metadata', {})
        
        if not all([quiz_id, violation_type]):
            raise ValueError('Missing required fields: quiz_id, violation_type')
        
        valid_types = [
            'MULTIPLE_FACES', 
            'NO_FACE', 
            'TAB_SWITCH', 
            'FULLSCREEN_EXIT', 
            'SUSPICIOUS_BEHAVIOR',
            'LOOKING_AWAY'
        ]
        if violation_type not in valid_types:
            raise ValueError(f'Invalid violation_type. Must be one of: {", ".join(valid_types)}')
        
        violation = Violation.create(
            quiz_id=quiz_id,
            student_id=user['_id'],
            violation_type=violation_type,
            face_count=face_count,
            severity=severity,
            metadata=metadata
        )
        
        return ViolationService.serialize_violation(violation)

    @staticmethod
    def list_violations(user, quiz_id=None, student_id=None):
        role = user.get('role')

        if role == 'student':
            effective_student_id = user['_id']
            if quiz_id:
                violations = Violation.find_by_student(effective_student_id, quiz_id)
            else:
                violations = Violation.find_by_student(effective_student_id)

        elif role == 'teacher':
            teacher_id = user['_id']
            teacher_quiz_ids = [
                q['_id'] for q in quizzes_collection.find({'teacher_id': teacher_id}, {'_id': 1})
            ]

            if quiz_id:
                quiz = Quiz.find_by_id(quiz_id)
                if not quiz or str(quiz.get('teacher_id')) != str(teacher_id):
                    raise PermissionError('Forbidden')
                violations = Violation.find_by_quiz(quiz_id)

            elif student_id:
                violations = list(
                    violations_collection.find(
                        {
                            'student_id': ObjectId(student_id),
                            'quiz_id': {'$in': teacher_quiz_ids},
                        }
                    ).sort('timestamp', -1)
                )

            else:
                violations = list(
                    violations_collection.find({'quiz_id': {'$in': teacher_quiz_ids}})
                    .sort('timestamp', -1)
                    .limit(100)
                )

        else:
            violations = Violation.find_by_student(user['_id'])
        
        return [ViolationService.serialize_violation(v) for v in violations]

    @staticmethod
    def get_quiz_violations_by_student(user, quiz_id):
        quiz = Quiz.find_by_id(quiz_id)
        if not quiz or str(quiz.get('teacher_id')) != str(user['_id']):
            raise PermissionError('Forbidden')

        violations = Violation.find_by_quiz(quiz_id)

        student_map = {}
        for v in violations:
            sid = str(v['student_id'])
            if sid not in student_map:
                student_map[sid] = {
                    'student_id': sid,
                    'student_name': 'Unknown',
                    'violations': []
                }
            student_map[sid]['violations'].append({
                'type': v['violation_type'],
                'severity': v['severity'],
                'face_count': v.get('face_count'),
                'metadata': v.get('metadata', {}),
                'timestamp': v['timestamp'].isoformat() if isinstance(v['timestamp'], datetime) else v['timestamp'],
            })

        if student_map:
            student_ids = [ObjectId(sid) for sid in student_map.keys()]
            students = list(users_collection.find({'_id': {'$in': student_ids}}, {'name': 1, 'email': 1}))
            for s in students:
                sid = str(s['_id'])
                if sid in student_map:
                    student_map[sid]['student_name'] = s.get('name', 'Unknown')
                    student_map[sid]['student_email'] = s.get('email', '')

        result = sorted(student_map.values(), key=lambda x: len(x['violations']), reverse=True)
        return result

    @staticmethod
    def get_violation_stats(quiz_id):
        violations = Violation.find_by_quiz(quiz_id)
        
        stats = {
            'total': len(violations),
            'by_type': {},
            'by_severity': {},
            'by_student': {}
        }
        
        for violation in violations:
            v_type = violation['violation_type']
            stats['by_type'][v_type] = stats['by_type'].get(v_type, 0) + 1
            
            severity = violation['severity']
            stats['by_severity'][severity] = stats['by_severity'].get(severity, 0) + 1
            
            student_id = str(violation['student_id'])
            if student_id not in stats['by_student']:
                stats['by_student'][student_id] = {
                    'count': 0,
                    'types': {}
                }
            stats['by_student'][student_id]['count'] += 1
            stats['by_student'][student_id]['types'][v_type] = \
                stats['by_student'][student_id]['types'].get(v_type, 0) + 1
        
        return stats
