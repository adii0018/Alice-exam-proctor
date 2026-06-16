from django.http import JsonResponse
import logging

logger = logging.getLogger(__name__)

class APIException(Exception):
    status_code = 500
    default_message = 'A server error occurred.'

    def __init__(self, message=None, status_code=None):
        self.message = message or self.default_message
        self.status_code = status_code or self.status_code
        super().__init__(self.message)


class ValidationException(APIException):
    status_code = 400
    default_message = 'Invalid input.'


class AuthenticationFailedException(APIException):
    status_code = 401
    default_message = 'Authentication failed.'


class PermissionDeniedException(APIException):
    status_code = 403
    default_message = 'You do not have permission to perform this action.'


class NotFoundException(APIException):
    status_code = 404
    default_message = 'Resource not found.'


class ExceptionHandlingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        if isinstance(exception, APIException):
            return JsonResponse({'error': exception.message}, status=exception.status_code)

        logger.error(f'Unhandled exception: {str(exception)}', exc_info=True)
        return JsonResponse({'error': 'An internal error occurred'}, status=500)
