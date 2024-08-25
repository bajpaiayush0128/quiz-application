from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LogoutViewSet, QuizViewSet, UserViewSet, ResultViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'quizapi', QuizViewSet, basename='quiz')
router.register(r'results', ResultViewSet, basename='result')
router.register(r'user', UserViewSet, basename='user')
router.register(r'logout', LogoutViewSet, basename='logout')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
