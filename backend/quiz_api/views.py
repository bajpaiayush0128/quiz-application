from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Quiz, Question, Result, CustomUser
from .serializers import MyTokenObtainPairSerializer, QuizSerializer, QuestionSerializer, QuizSubmissionSerializer, ResultSerializer, CustomUserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class MyTokenRefreshView(TokenRefreshView):
    pass

class LogoutViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'])
    def logout(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            print(refresh_token)
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                # Invalidate the access token
                access_token = AccessToken(request.headers['Authorization'].split()[1])
                access_token.set_exp(lifetime=1)  # Set the access token lifetime to 1 second
                return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
            else:
                return Response({"message": "Refresh token not provided"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = CustomUser.objects.filter(id=user.id)
        return queryset

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        print(self.request.user.id)
        if self.request.user.role.name != 'UE':
            print("123")
            return Response({"detail": "You are not authorized to create quizzes."}, status=status.HTTP_403_FORBIDDEN)
        serializer.save(creator = self.request.user)
        print("hello")
        return Response({"detail": "Quiz created successfully."})

    @action(detail=True, methods=['post'])
    def submit_result(self, request, pk=None):
        quiz = self.get_object()
        serializer = QuizSubmissionSerializer(data=request.data, context={'view': self})
        
        if not serializer.is_valid():
            # Log the errors for debugging
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        answers = serializer.validated_data['answers']
        total_score = 0
        correct_ques = 0

        for answer in answers:
            question = Question.objects.get(id=answer['question_id'])
            if question.correct == answer['selected_option']:
                total_score += question.marks
                correct_ques += 1

        result_instance = Result.objects.create(user=request.user, quiz=quiz, result=total_score, correct_ques=correct_ques)
        return Response(ResultSerializer(result_instance).data, status=status.HTTP_201_CREATED)

class ResultViewSet(viewsets.ModelViewSet):
    serializer_class = ResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Result.objects.filter(user=user)