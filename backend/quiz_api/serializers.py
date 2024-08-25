from rest_framework import serializers
from .models import Quiz, Question, Result, Role, CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role.name
        return token

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['name', 'permission']

class CustomUserSerializer(serializers.ModelSerializer):
    role = RoleSerializer()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role']

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'desc', 'options', 'marks', 'correct']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)
    creator = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'creator', 'pass_percent', 'quiz_duration', 'questions', 'total_marks', 'total_ques']

    def create(self, validated_data):
        print("kiyujhtgrfvdc")
        questions_data = validated_data.pop('questions')
        pass_percent = validated_data.pop('pass_percent')
        quiz_duration = validated_data.pop('quiz_duration')

        quiz = Quiz.objects.create(pass_percent=pass_percent, quiz_duration=quiz_duration, **validated_data)

        for question_data in questions_data:
            Question.objects.create(quiz=quiz, **question_data)

        quiz.total_marks = sum(question['marks'] for question in questions_data)
        quiz.total_ques = len(questions_data)
        quiz.save()

        return quiz

class AnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    selected_option = serializers.CharField(max_length=250, allow_null=True)

class QuizSubmissionSerializer(serializers.Serializer):
    answers = AnswerSerializer(many=True, required=False)

    def validate(self, data):
        quiz_id = self.context['view'].kwargs['pk']
        questions = Question.objects.filter(quiz_id=quiz_id)
        question_ids = set(q.id for q in questions)

        submitted_question_ids = set(answer['question_id'] for answer in data.get('answers', []))
        if submitted_question_ids != question_ids:
            missing_question_ids = question_ids - submitted_question_ids
            for question_id in missing_question_ids:
                data['answers'].append({'question_id': question_id, 'selected_option': None})

        return data

class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ['id', 'user', 'quiz', 'result', 'correct_ques']