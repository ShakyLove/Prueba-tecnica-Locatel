from .models import Account, Movements
from datetime import datetime, timedelta
from decimal import Decimal

from django.views import View
from django.http.response import JsonResponse
from django.contrib.auth.hashers import make_password
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import check_password
from django.forms.models import model_to_dict
from django.core.exceptions import ValidationError
from django.contrib.auth.tokens import default_token_generator
import random
import json
import jwt

# Create your views here.
class AccountView(View):

    def get(self, request, id):
        try:
            account = Account.objects.filter(id = id).values('first_name', 'last_name', 'value_count', 'identification', 'tarjet_number', 'account_number', 'csv_number', 'tarjet_date',).first()
            movements = Movements.objects.filter(account_id = id).values('detail', 'created_at', 'value_mov', 'type_mov')
            data = {'message': 'Cuenta encontrada', 'account': account, 'movements': list(movements)}
        except Account.DoesNotExist:
            data = {'message': 'Cuenta no encontrada'}
        return JsonResponse(data)

class RegisterAccount(View):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def post(self, request):
        bodyData = json.loads(request.body)
        try:
            account = Account.objects.get(identification=bodyData['identification'])
            data    = {'message': 'Este número de identificación ya tiene una cuenta creada', 'icon': 'error'}
        except Account.DoesNotExist:
            """Generamos los datos que faltan, y encriptamos la contraseña"""
            password        = make_password(bodyData['password'])
            csvNumber       = random.randint(100, 999)
            accountNumber   = random.randint(10000000000, 99999999999)
            tarjetNumber    = random.randint(1000000000000000, 9999999999999999)
            month           = str(datetime.now().month).zfill(2)
            year            = str(datetime.now().year % 100 + 6)
            fullDate        = f"{month}/{year}"

            new_account = Account(
                first_name      = bodyData['firstName'],
                last_name       = bodyData['lastName'],
                value_count     = bodyData['valueCount'],
                identification  = bodyData['identification'],
                password        = password,
                tarjet_number   = tarjetNumber,
                account_number  = accountNumber,
                csv_number      = csvNumber,
                tarjet_date     = fullDate
            )
            try:
                new_account.full_clean()
                new_account.save()
                data = {'message': 'Cuenta creada con éxito', 'icon': 'success'}
            except ValidationError as e:
                data = {'message': 'Error en los datos de la cuenta', 'icon': 'error'}
        return JsonResponse(data)

class LoginView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def post(self, request):
        bodyData = json.loads(request.body)
        try:
            account  = Account.objects.get(identification=bodyData['identification'])
            is_match = check_password(bodyData['password'], account.password)
            if is_match:
                payload  = {
                    'id': account.id,
                    'identification': account.identification,
                }
                secret_key  = 'ISAAC'
                token       = jwt.encode(payload, secret_key, algorithm='HS256')
                accountData = model_to_dict(account, exclude=['password'])
                data        = {'message': 'usuario encontrado', 'account': accountData, 'token': token}
            else:
                data = {'message': 'La contraseña es incorrecta', 'icon': 'error'}
        except Account.DoesNotExist:
            data = {'message': 'El usuario no existe', 'icon': 'error'}
        return JsonResponse(data)
    
class MovementView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def post(self, request):
        try:
            bodyData = json.loads(request.body)
            account  = Account.objects.get(identification = bodyData['identification'])

            if Decimal(bodyData['value']) > account.value_count and bodyData['accountNumber'] != account.account_number:
                data = {'message': 'Saldo insuficiente', 'icon': 'error'}
                return JsonResponse(data)
            elif Decimal(bodyData['value']) < 10000 and bodyData['type'] == 2:
                data = {'message': 'No se puede hacer un retiro menor a $10.000', 'icon': 'error'}
                return JsonResponse(data)
            
            if bodyData['type'] == 1:
                detail   = 'Consignación cuenta de ahorros'
                message  = '¡Consignación exitosa!'
            elif bodyData['type'] == 2:
                detail   = 'Retiro cuenta de ahorros'
                message  = '¡Retiro exitoso!'
            
            type_mov = bodyData['type']
            if bodyData['accountNumber'] != '':

                if Decimal(bodyData['accountNumber']) == Decimal(account.account_number):
                    account.value_count += Decimal(bodyData['value'])
                    type_mov = 3
                    account_mov = bodyData['accountNumber']

                elif Decimal(bodyData['accountNumber']) != Decimal(account.account_number):

                    """Consultamos la cuenta destino"""
                    try:
                        account_des = Account.objects.get(account_number = bodyData['accountNumber'])
                        """Sumamos el valor de la consignacion a la cuenta"""
                        account_des.value_count += Decimal(bodyData['value'])
                        account_des.save()

                        """Hacemos registro en la tabla movimientos"""
                        movement             = Movements()
                        movement.detail      = detail
                        movement.value_mov   = bodyData['value']
                        movement.account     = account_des
                        movement.account_mov = account.account_number
                        movement.type_mov    = 3
                        movement.save()
                    except Account.DoesNotExist:
                        data = {'message': 'Número de cuenta no existe', 'icon': 'error'}
                        return JsonResponse(data)

                    account.value_count -= Decimal(bodyData['value'])
                    account_mov = bodyData['accountNumber']
            else:
                account_mov = account.account_number
                account.value_count -= Decimal(bodyData['value'])

            account.save()
            movement             = Movements()
            movement.detail      = detail
            movement.value_mov   = bodyData['value']
            movement.account     = account
            movement.account_mov = account_mov
            movement.type_mov    = type_mov
            movement.save()

            data = {'message': message}
        except Exception as e:
            data = {'message': 'Ocurrió un error en el servidor'}
            print(str(e))
        return JsonResponse(data)