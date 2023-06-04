from django.urls import path
from .views import AccountView, LoginView, RegisterAccount, MovementView

urlpatterns = [
    path('account/<int:id>', AccountView.as_view()),
    path('register/', RegisterAccount.as_view()),
    path('login/', LoginView.as_view()),
    path('movement/', MovementView.as_view()),
]