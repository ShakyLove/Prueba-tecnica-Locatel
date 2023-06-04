from django.db import models
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils import timezone
from django.utils.crypto import constant_time_compare, salted_hmac
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class AccountManager(BaseUserManager):
    def create_user(self, identification, password=None, **extra_fields):
        if not identification:
            raise ValueError("El campo de identificación debe estar configurado")
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)

        account = self.model(identification=identification, **extra_fields)
        account.set_password(password)
        account.save(using=self._db)
        return account

    def create_superuser(self, identification, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(identification, password, **extra_fields)

class Account(AbstractBaseUser):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    value_count = models.DecimalField(max_digits=10, decimal_places=2)
    identification = models.CharField(max_length=20, unique=True)
    tarjet_number = models.CharField(max_length=16)
    account_number = models.CharField(max_length=20)
    csv_number = models.CharField(max_length=4)
    tarjet_date = models.CharField(max_length=50)
    last_login = models.DateTimeField(auto_now=True)
    activation_token = models.CharField(max_length=255, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = "identification"
    REQUIRED_FIELDS = []

    objects = AccountManager()

    def generate_activation_token(self):
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(self)
        self.activation_token = token
        self.save()

    def verify_activation_token(self, token):
        token_generator = PasswordResetTokenGenerator()
        return token_generator.check_token(self, token)

    @property
    def is_activation_token_valid(self):
        token_generator = PasswordResetTokenGenerator()
        return (
            self.activation_token
            and token_generator.check_token(self, self.activation_token)
        )

class Movements(models.Model):
    account = models.ForeignKey(
        Account, on_delete=models.CASCADE, related_name="movements"
    )
    detail = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    value_mov = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    type_mov = models.CharField(max_length=4, default=0)
    account_mov = models.CharField(max_length=20, default=0)
