from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, logout
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from django.shortcuts import render
import random
import string
from django.utils import timezone
from django.db.models import Sum, Count
from django.db.models.functions import Cast
from django.db.models import IntegerField
from datetime import datetime
from django.urls import reverse
from urllib.parse import urlencode
import time
# from urllib.parse import unquote

from .pagination import SubscribersPagnation
from ..models import User, Member, Coach, Person, Activity, Subscription, Gym
from ..email import (send_otp_via_email, send_reminder_mail, send_greetings_mail_coach, send_greetings_mail_employee,
                     send_greetings_mail_Member)
from .serializers import (LoginSerializer, RegisterUserSerializer, UserResetChangePasswordSerializer, SendOtpSerializer,
                          VerifyOtpSerializer, ModifyUserSerializer, GetCoachSerializer, AddGetMemberSerializer,
                          MngPersonMemberSerializer, MngPersonCoachSerializer, CoachSerializer, ActivitySerializer,
                          FirstSubscriptionSerializer,UpdateMemberSerializer,GetSpecificMemberSerialiser, UsersSerializer,
                          ChangePermissionUserSerializer,SubscriptionSerializer, SpecificSubscriptionSerializer,
                          UpdateCoachSerializer, AddCoachSerializer, AddMemberSerializer,
                          NotificationsSerializer, GymSerializer, SpecificUserSerializer, DashboardNumberOfPeopleByActivitySerializer,
                          DashboardMoneySerializer, DashboardNumberOfGenderSerializer,DashboardnumberPeopleByActivityGenderSerializer,
                          )

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }

class UserLoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.data['email']
            password = serializer.data['password']
            user = authenticate(email=email, password=password)
            if(user is not None):
                # print(user.id)
                token = get_tokens_for_user(user)
                return Response({'message': 'login success', 'token': token}, status=status.HTTP_200_OK)
            else:
                # try:
                #     user_active = User.objects.get(email=email)
                # except User.DoesNotExist:
                #     return Response({'message': 'user not found mail'}, status=status.HTTP_404_NOT_FOUND)
                #
                # if not user_active.is_active:
                #     return Response({'message': 'user account not active'}, status=status.HTTP_400_BAD_REQUEST)
                # else:
                return Response({'message': 'user not found! password'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'something went wrong!', 'error': serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Log the user out by ending the session or deleting the token
        logout(request)
        return Response(status=status.HTTP_200_OK)

class ChangePermissionUserView(APIView):
    # permission_classes = [IsAuthenticated, IsAdminUser]
    def put(self, request, pk):
        try:
            user_active = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({'message': 'user not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ChangePermissionUserSerializer(user_active, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'permission changed successfully', 'data': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'something went wrong!', 'error': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)

class UserRegisterView(APIView):
    # permission_classes = [IsAuthenticated, IsAdminUser]
    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)
        if serializer.is_valid():

            try:
                gym = Gym.objects.all().first()
                if gym is None:
                    return Response({'message': 'you should set data for your gym to can send mail to users'}, status=status.HTTP_404_NOT_FOUND)
            except Gym.DoesNotExist:
                return Response({'message': 'Gym model does not exist'}, status=status.HTTP_404_NOT_FOUND)
            instance_user = serializer.save()
            instance_user.created_at = timezone.now().date()
            instance_user.save()
            context = {
                'employee_name': serializer.data['name'],
                'gym_name': gym.name,
                # 'gym_picture': gym.pictureGym.url
            }
            email_template = render(request, 'email_emplyee.html', context)
            email_content = email_template.content.decode('utf-8')
            send_greetings_mail_employee(serializer.data['email'], email_content)
            return Response({'message': 'registration successfully'}, status=status.HTTP_201_CREATED)
        return Response({'message': 'something went wrong!', 'error': serializer.errors}, status=status.HTTP_404_NOT_FOUND)

class SendOtpView(APIView):
    def post(self, request):
        serializer = SendOtpSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = User.objects.get(email=serializer.data['email'])
            except User.DoesNotExist:
                return Response({'message': 'user not found!'}, status=status.HTTP_404_NOT_FOUND)
            characters = string.ascii_uppercase + string.digits
            code_length = 4
            generated_code = ''.join(random.choice(characters) for _ in range(code_length))
            nameUser = user.name
            user.otp = generated_code
            user.save()
            context = {
                'name': nameUser,
                'message': 'i guess you get mail verification well',
                'code': generated_code
            }
            email_template = render(request, 'sendOtp.html', context)
            email_content = email_template.content.decode('utf-8')
            send_otp_via_email(serializer.data['email'], email_content)
            return Response({'message': 'code sended!', 'code': generated_code}, status=status.HTTP_200_OK)

        return Response({'message': 'there is probleme!', 'error': serializer.errors}, status=status.HTTP_404_NOT_FOUND)

class VerifyOtpView(APIView):
    def post(self, request):
        try:
            serializer = VerifyOtpSerializer(data=request.data)
            if serializer.is_valid():
                try:
                    user = User.objects.get(email=serializer.data['email'])
                except User.DoesNotExist:
                    return Response({'message': 'user not found:'}, status=status.HTTP_404_NOT_FOUND)
                otp = serializer.data.get('otp')
                if user.otp != otp or len(otp) == 0:
                    return Response({'message': 'invalid otp!'}, status=status.HTTP_404_NOT_FOUND)
                else:
                    return Response({'message': 'otp correct'}, status=status.HTTP_200_OK)

            return Response({'message': 'something went wrong!', 'error': serializer.errors}, status=status.HTTP_404_NOT_FOUND)
        except:
            Response({'message': 'bad request 500'}, status=status.HTTP_502_BAD_GATEWAY)

class UserChangePasswordView(APIView):
    # permission_classes = [IsAuthenticated]
    def put(self, request, pk):
        try:
            user = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({'message': 'user not found!'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserResetChangePasswordSerializer(user, data=request.data)
        if serializer.is_valid():
            user.set_password(serializer.data.get('password'))
            user.save()
            return Response({'message': 'successful updated password'}, status=status.HTTP_202_ACCEPTED)

        return Response({'message': 'something went wrong!', 'error': serializer.errors}, status=status.HTTP_404_NOT_FOUND)

class UserResetPasswordView(APIView):
    def put(self, request, pk):
        try:
            user = User.objects.get(email=pk)
        except User.DoesNotExist:
            return Response({'message': 'user not found!'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserResetChangePasswordSerializer(user, data=request.data)
        if serializer.is_valid():
            user.set_password(serializer.data.get('password'))
            user.save()
            return Response({'message': 'successful updated password'}, status=status.HTTP_202_ACCEPTED)

        return Response({'message': 'something went wrong!', 'error': serializer.errors}, status=status.HTTP_404_NOT_FOUND)

class ModifyUserProfileView(APIView):
    # permission_classes = [IsAuthenticated]
    def patch(self, request, pk):
        try:
            user_id = request.user.id
            if pk != user_id:
                return Response({'message': 'user not found'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                user = User.objects.get(id=pk)
            except User.DoesNotExist:
                return Response({'message': 'user not found'}, status=status.HTTP_404_NOT_FOUND)

            serializer = ModifyUserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'user updated successfully', 'data': serializer.data}, status=status.HTTP_202_ACCEPTED)
            return Response({'message': 'something went wrong!', 'error': serializer.errors}, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({'message': '???'}, status=status.HTTP_400_BAD_REQUEST)


class DeleteSpecificUser(APIView):
    # permission_classes = [IsAuthenticated, IsAdminUser]
    def delete(self, request, pk):
        # user_id = request.user.id
        try:
            user = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({'message': 'user not found'}, status=status.HTTP_404_NOT_FOUND)
        # if user.id != user_id:
        user.delete()
        return Response({'message': 'user deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        # else:
        #     return Response({'message': 'u cannot delete yourself'}, status=status.HTTP_204_NO_CONTENT)


class GetUsersView(APIView):
    # permission_classes = [IsAuthenticated, IsAdminUser]
    def get(self, request):
        search = request.GET.get('search', '')
        # user_id = request.user.id
        if len(search) != 0:
            users = User.objects.filter(name__icontains=search)
            # users = User.objects.filter(name__icontains=search, id!=user_id)
        else:
            users = User.objects.all()
            # users = User.objects.filter(id!=user_id)

        serializer = UsersSerializer(users, many=True, context={"request": request})

        return Response({'message': 'all users', 'data': serializer.data}, status=status.HTTP_200_OK)

class GetSpecificUserView(APIView):
    # permission_classes = [IsAuthenticated, IsAdminUser]
    def get(self, request, pk):
        try:
            user = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({'message': 'user not found!'}, status=status.HTTP_404_NOT_FOUND)
        serializer = SpecificUserSerializer(user, context={"request": request})
        return Response({'message': 'user exist', 'data': serializer.data}, status=status.HTTP_200_OK)

class AddGetMemberView(APIView):
    # permission_classes = [IsAuthenticated]
    # pagination_class = SubscribersPagnation

    # @property
    # def paginator(self):
    #     if not hasattr(self, '_paginator'):
    #         if self.pagination_class is None:
    #             self._paginator = None
    #         else:
    #             self._paginator = self.pagination_class()
    #     else:
    #         pass
    #     return self._paginator
    #
    # def paginate_queryset(self, queryset):
    #
    #     if self.paginator is None:
    #         return None
    #     return self.paginator.paginate_queryset(queryset,
    #                                             self.request, view=self)
    #
    # def get_paginated_response(self, data):
    #     assert self.paginator is not None
    #     return self.paginator.get_paginated_response(data)

    def get(self, request, format=None, *args, **kwargs):
        activity_name = request.GET.get('activity_name', '')
        search = request.GET.get('search', '')
        startDate = request.GET.get('startDate', '')
        endDate = request.GET.get('endDate', '')
        statusFilter = request.GET.get('status', '')
        page = self.request.GET.get('page', '')

        sub = Subscription.objects.all()

        if activity_name == '':
            sub = sub.all()
        elif activity_name != 'all':
            sub = sub.filter(activity__name=activity_name)
        #
        if search:
            sub = sub.filter(member__person__name__icontains=search)
        #
        if startDate == '':
            sub = sub.all()
        elif startDate:
            sub = sub.filter(startDate=startDate)

        if endDate:
            aux = []
            for item in sub:
                date_str = item.end_date.strftime("%Y-%m-%d")
                if date_str == endDate:
                    aux.append(item)
            sub = aux

        # if statusFilter == 'true':
        #     aux = []
        #     for item in sub:
        #         if item.end_date > timezone.now().date():
        #             aux.append(item)
        #     sub = aux
        # elif statusFilter == 'false':
        #     aux = []
        #     for item in sub:
        #         if item.end_date <= timezone.now().date():
        #             aux.append(item)
        #     sub = aux

        # serializer = NewsItemSerializer(results, many=True)
        serializer = FirstSubscriptionSerializer(sub, many=True, context={"request": request})
        members_with_max_rest_days = []
        members_id = []

        for subData in serializer.data:
            if not subData['member']['id'] in members_id:
                dicActivity = {}
                liste = []
                members_id.append(subData['member']['id'])
                dicActivity['member'] = subData['member']
                members_with_activity = {
                    'id': subData['id'],
                    'endDate': subData['endDate'],
                    'startDate': subData['startDate'],
                    'status': subData['status'],
                    'activity': subData['activity']
                }
                liste.append(members_with_activity)
                dicActivity['subscription'] = liste
                members_with_max_rest_days.append(dicActivity)
            else:
                index = members_id.index(subData['member']['id'])
                pff = members_with_max_rest_days[index]['subscription']
                ok = False
                members_with_activity = {
                    'id': subData['id'],
                    'endDate': subData['endDate'],
                    'startDate': subData['startDate'],
                    'status': subData['status'],
                    'activity': subData['activity']
                }
                for itemIndex in range(len(pff)):
                    if subData['activity']['id'] == pff[itemIndex]['activity']['id']:
                        ok = True
                        if subData['endDate'] > pff[itemIndex]['endDate']:
                            members_with_max_rest_days[index]['subscription'][itemIndex] = members_with_activity
                if ok == False:
                    members_with_max_rest_days[index]['subscription'].append(members_with_activity)

        subValue = members_with_max_rest_days
        # if activity_name == '':
        #     subValue = subValue
        # elif activity_name != 'all':
        #     sub = []
        #     for item in subValue:
        #         for itemSub in item['subscription']:
        #             if itemSub['activity']['name'] == activity_name:
        #                 sub.append(item)
        #     subValue = sub

        # if search:
        #     sub = []
        #     for item in subValue:
        #         if search in item['member']['person']['name']:
        #             sub.append(item)
        #     subValue = sub
            # sub = sub.filter(member__person__name__icontains=search)

        # if startDate == '':
        #     subValue = subValue
        # if startDate:
        #     aux = []
        #     for item in subValue:
        #         ok = False
        #         for itemSub in item['subscription']:
        #             if itemSub['startDate'] == startDate:
        #                 # aux.append(item)
        #                 if ok:
        #                     aux[len(aux)-1]['subscription'].append(itemSub)
        #                 else:
        #                     ok = True
        #                     aux.append(item)
        #                     aux[len(aux)-1]['subscription'] = [itemSub]
        #     subValue = aux
            # sub = sub.filter(startDate=startDate)

        # if endDate:
        #     aux = []
        #     for item in subValue:
        #         ok = False
        #         for itemSub in item['subscription']:
        #             date_obj = datetime.strptime(itemSub['endDate'], "%d-%m-%Y")
        #             date_str = date_obj.strftime("%Y-%m-%d")
        #             if date_str == endDate:
        #                 # aux.append(item)
        #                 if ok:
        #                     aux[len(aux)-1]['subscription'].append(itemSub)
        #                 else:
        #                     ok = True
        #                     aux.append(item)
        #                     aux[len(aux)-1]['subscription'] = [itemSub]
        #     subValue = aux

        if statusFilter == 'true':
            aux = []
            for item in subValue:
                ok = False
                for itemSub in item['subscription']:
                    end_date_str = itemSub['endDate']
                    end_date = datetime.strptime(end_date_str, "%d-%m-%Y").date()
                    if end_date > timezone.now().date():
                        if ok:
                            aux[len(aux)-1]['subscription'].append(itemSub)
                        else:
                            ok = True
                            aux.append(item)
                            aux[len(aux)-1]['subscription'] = [itemSub]
            subValue = aux
        elif statusFilter == 'false':
            aux = []
            for item in subValue:
                ok = False
                for itemSub in item['subscription']:
                    end_date_str = itemSub['endDate']
                    end_date = datetime.strptime(end_date_str, "%d-%m-%Y").date()
                    if end_date <= timezone.now().date():
                        # aux.append(item)
                        if ok:
                            aux[len(aux)-1]['subscription'].append(itemSub)
                        else:
                            ok = True
                            aux.append(item)
                            aux[len(aux)-1]['subscription'] = [itemSub]
            subValue = aux

        data_list = subValue  # Replace with your list of data

        # Get the requested page number and set the page size to 2
        page_number = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 2))

        # Calculate the start and end indices for pagination
        start_index = (page_number - 1) * page_size
        end_index = start_index + page_size

        # Paginate the data
        paginated_data = data_list[start_index:end_index]

        # Calculate the total number of pages
        total_items = len(data_list)
        num_pages = (total_items + page_size - 1) // page_size

        # Calculate next and previous page numbers
        next_page = page_number + 1 if page_number < num_pages else None
        previous_page = page_number - 1 if page_number > 1 else None

        # Create URLs for next and previous pages
        base_url = reverse('add_get_member')  # Replace with the actual name of your API view
        next_page_url = None
        previous_page_url = None

        # request.build_absolute_uri()       # http://localhost:8000/admin/store/product/
        # print(request.get_full_path())     # /some/content/1/
        # print(request.query_params.copy()) # ?page=2
        # print(request.scheme)              # http or https
        # print(request.META['HTTP_HOST'])   # example.com
        # print(request.path)                # /some/content/1/

        if next_page:
            next_page_query_params = request.query_params.copy()
            next_page_query_params['page'] = next_page
            next_page_query_params['page_size'] = page_size
            next_page_url = f"{base_url}?{urlencode(next_page_query_params)}"
        if previous_page:
            previous_page_query_params = request.query_params.copy()
            previous_page_query_params['page'] = previous_page
            previous_page_query_params['page_size'] = page_size
            previous_page_url = f"{base_url}?{urlencode(previous_page_query_params)}"

        # Construct the response
        response_data = {
            'next': next_page_url,
            'previous': previous_page_url,
            'count': total_items,
            'pageSize': page_size,
            'results': paginated_data,
        }

        return Response({'message': 'data of members', 'data': response_data}, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        serializer = AddMemberSerializer(data=request.data)
        activity = Activity.objects.all()
        if len(activity) == 0:
            return Response({'message': 'there is no activity, you should add some!!'}, status=status.HTTP_404_NOT_FOUND)
        if serializer.is_valid():
            serializer_person = MngPersonMemberSerializer(data=serializer.data['person'])
            if serializer_person.is_valid():
                existPerson = Person.objects.get(name=serializer_person.validated_data['name'],
                                                 email=serializer_person.validated_data['email'],
                                                 gender=serializer_person.validated_data['gender'])
                # check if the person exist in the dataBase or not
                if existPerson is None:
                    person_instance = serializer_person.save()
                    member_data = {}
                    member_data['person'] = person_instance.id
                    member_serializer = AddGetMemberSerializer(data=member_data)
                    if member_serializer.is_valid():
                        member_instance = member_serializer.save()
                        subscription_instance = serializer.data['subscription']
                        subscription_instance['member'] = member_instance.id
                        serializer_subscription = SubscriptionSerializer(data=subscription_instance)
                        if serializer_subscription.is_valid():
                            serializer_subscription.save()
                            gym = Gym.objects.all().first()
                            context = {
                                'member_name': serializer.data['person']['name'],
                                'gym_name': gym.name,
                                'gym_fcbkLink': gym.linkFacebook,
                                'gym_instaLink': gym.linkInstagram
                                # 'gym_picture': gym.pictureGym.url
                            }
                            email_template = render(request, 'email_member.html', context)
                            email_content = email_template.content.decode('utf-8')
                            send_greetings_mail_Member(serializer.data['person']['email'], email_content)
                            return Response({'message': 'member and his subscription saved successfully',
                                             'data': serializer_subscription.data},
                                            status=status.HTTP_201_CREATED)
                        else:
                            person_instance.delete()
                            return Response({'message': 'something wrong with subscription model',
                                             'error': serializer_subscription.errors},
                                            status=status.HTTP_400_BAD_REQUEST)
                    else:
                        person_instance.delete()
                        return Response({'message': 'something wrong with member modal', 'error': member_serializer.errors},
                                        status=status.HTTP_400_BAD_REQUEST)

                # check if the member is exist but not deleted or exist and deleted
                else:
                    # existPerson
                    existMember = Member.objects.get(person=existPerson.id)
                    if existMember is None:
                        member_data = {}
                        member_data['person'] = existPerson.id
                        member_serializer = AddGetMemberSerializer(data=member_data)
                        if member_serializer.is_valid():
                            member_instance = member_serializer.save()
                            subscription_instance = serializer.data['subscription']
                            subscription_instance['member'] = member_instance.id
                            serializer_subscription = SubscriptionSerializer(data=subscription_instance)
                            if serializer_subscription.is_valid():
                                serializer_subscription.save()
                                return Response({'message': 'A person exists but is not listed as a member, and we are adding a new subscription for them.',
                                                 'data': serializer_subscription.data},
                                                status=status.HTTP_201_CREATED)
                    elif existMember is not None and existPerson.is_deleted == True:
                        existPerson.is_deleted = False
                        existPerson.save()
                        subscription_instance = serializer.data['subscription']
                        subscription_instance['member'] = existMember.id
                        serializer_subscription = SubscriptionSerializer(data=subscription_instance)
                        if serializer_subscription.is_valid():
                            serializer_subscription.save()
                            return Response({'message': 'A member who was previously removed has been reinstated, and we have provided them with a new subscription.',
                                             'data': serializer_subscription.data},
                                            status=status.HTTP_201_CREATED)
                    elif existMember is not None:
                        subscription_instance = serializer.data['subscription']
                        subscription_instance['member'] = existMember.id
                        serializer_subscription = SubscriptionSerializer(data=subscription_instance)
                        if serializer_subscription.is_valid():
                            serializer_subscription.save()
                            return Response({'message': 'The member already exists, and we are assigning a new subscription to them.',
                                                'data': serializer_subscription.data},
                                            status=status.HTTP_201_CREATED)

            else:
                return Response({'message': 'something wrong with person model', 'error': serializer_person.errors},
                                status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'something wrong with Person or subscription model', 'error': serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)

class SpecificMemberView(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        try:
            try:
                member = Member.objects.get(id=pk)
            except Member.DoesNotExist:
                return Response({'messsage': 'member not found'}, status=status.HTTP_404_NOT_FOUND)

            serializer_member = GetSpecificMemberSerialiser(member, context={"request": request})
            serializer_member.data['member_sub'].reverse()
            return Response({'message': 'member exist', 'data': serializer_member.data}, status=status.HTTP_200_OK)
        except:
            return Response({'message': 'something wrong'}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, format=None):
        try:
            try:
                member = Member.objects.get(id=pk)
            except Member.DoesNotExist:
                return Response({'messsage': 'member not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = UpdateMemberSerializer(member)
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Member upadated successfully', 'data': serializer.data}, status=status.HTTP_202_ACCEPTED)
            else:
                return Response({'message': 'something wrong with fields of member', 'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'message': 'something wrong!', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            member = Member.objects.get(id=pk)
        except:
            return Response({'message': 'Member not found'}, status=status.HTTP_404_NOT_FOUND)
        person = member.person
        if person:
            if person.is_deleted:
                person.is_deleted = False
                msg = 'The member has gone back successfully,'
            else:
                person.is_deleted = True
                msg = 'The Member deleted successfully'
            person.save()
            # person.delete()
            return Response({'message': msg}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'message': 'No associated Person found for Member'}, status=status.HTTP_400_BAD_REQUEST)

class AddGetCoachView(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request):
        search = request.GET.get('search', '')
        if len(search) != 0:
            coach = Coach.objects.filter(person__name__icontains=search)
        else:
            coach = Coach.objects.all()

        serializer = GetCoachSerializer(coach, many=True, context={"request": request})
        return Response({'message': 'data of coachs', 'data': serializer.data}, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        serializer = AddCoachSerializer(data=request.data)
        if serializer.is_valid():
            serializer_person = MngPersonCoachSerializer(data=serializer.validated_data['person'])
            if serializer_person.is_valid():
                try:
                    activity_name = Activity.objects.get(id=serializer.validated_data['activity'])
                except Activity.DoesNotExist:
                    return Response({'message': "activity does not exist"}, status=status.HTTP_404_NOT_FOUND)

                instance_person = serializer_person.save()
                coach_data = {
                    'hireDate': serializer.validated_data['hireDate'],
                    'person': instance_person.id,
                    'activity': serializer.validated_data['activity'],
                }
                serializer_coach = CoachSerializer(data=coach_data)
                if serializer_coach.is_valid():
                    serializer_coach.save()
                    gym = Gym.objects.all().first()
                    gym_serializer = GymSerializer(gym)
                    # print(gym_serializer.data['pictureGym'])
                    context = {
                        'coach_name': instance_person.name,
                        'gym_name': gym.name,
                        'activity_name': activity_name.name,
                        'gym_facebook': gym.linkFacebook,
                        'gym_insta': gym.linkInstagram,
                        'gym_picture': gym.pictureGym.url,
                        'link': "http://127.0.0.1:8000/static/images/facebook.png",
                    }
                    email_template = render(request, 'email_coach.html', context)
                    email_content = email_template.content.decode('utf-8')
                    send_greetings_mail_coach(serializer.data['person']['email'], email_content)
                    return Response({'message': 'coach saved successfully', 'data': serializer.data}, status=status.HTTP_201_CREATED)
                else:
                    instance_person.delete()
                    return Response({'message': 'something wrong with coach data', 'error': serializer_coach.errors}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'message': 'something wrong with person data', 'error': serializer_person.errors}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'something wrong with data', 'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class SpecificCoachView(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        try:
            try:
                coach = Coach.objects.get(id=pk)
            except Coach.DoesNotExist:
                return Response({'message': 'coach not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = GetCoachSerializer(coach, context={"request": request})
            return Response({'message': 'data of coach', 'data': serializer.data}, status=status.HTTP_200_OK)
        except:
            return Response({'message': 'error'}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            coach = Coach.objects.get(id=pk)
        except Coach.DoesNotExist:
            return Response({'message': 'user not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UpdateCoachSerializer(coach, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'coach updated', 'data': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'something wrong with coach', 'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            coach = Coach.objects.get(id=pk)
        except Coach.DoesNotExist:
            return Response({'message': 'user not found'}, status=status.HTTP_404_NOT_FOUND)
        person = coach.person
        if person:
            person.delete()
            return Response({'message': 'Person associated with Coach deleted successfully'},
                            status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'message': 'No associated Person found for Coach'}, status=status.HTTP_404_NOT_FOUND)

class SubscriptionView(APIView):
    # permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        serialiser = SubscriptionSerializer(data=request.data)
        if serialiser.is_valid():
            serialiser.save()
            return Response({'message': 'subscription added', 'data': serialiser.data}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'something wrong with subscription model', 'error': serialiser.errors}, status=status.HTTP_400_BAD_REQUEST)

class SpecificSubscriptionView(APIView):
    # permission_classes = [IsAuthenticated]
    def put(self, request, pk, format=None):
        try:
            subscription = Subscription.objects.get(id=pk)
        except Subscription.DoesNotExist:
            return Response({'message': 'subscription not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = SpecificSubscriptionSerializer(subscription, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'subscription for specific user updated', 'data': serializer.data}, status=status.HTTP_202_ACCEPTED)
        else:
            return Response({'message': 'something wrong', 'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            subscription = Subscription.objects.get(id=pk)
        except Subscription.DoesNotExist:
            return Response({'message': 'subscription not found'}, status=status.HTTP_404_NOT_FOUND)
        subscription.delete()
        return Response({'message': 'subscription deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

class GymView(APIView):
    def get(self, request, format=None):
        gym = Gym.objects.all().first()
        serializer = GymSerializer(gym, context={"request": request})
        return Response({'message': 'gym exist', 'data': serializer.data}, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        gym = Gym.objects.all()
        if len(gym) == 0:
            serializer = GymSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'gym is created', 'data': serializer.data}, status=status.HTTP_201_CREATED)
            else:
                return Response({'message': 'something wrong with gym data', 'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = GymSerializer(gym, many=True)
            return Response({'message': 'data gym already exist', 'data': serializer.data},status=status.HTTP_400_BAD_REQUEST)

class SpecificGymView(APIView):
    def get(self, request, pk, format=None):
        try:
            gym = Gym.objects.get(id=pk)
        except Gym.DoesNotExist:
            return Response({'message': 'gym not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = GymSerializer(gym, context={"request": request})
        return Response({'message': 'gym exist', 'data': serializer.data}, status=status.HTTP_200_OK)

    def put(self, request, pk):
        try:
            gym = Gym.objects.get(id=pk)
        except Gym.DoesNotExist:
            return Response({'message': 'gym not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = GymSerializer(gym, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'gym is updated', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'something wrong with update gym', 'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class ActivityView(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        activities = Activity.objects.filter(is_deleted=False)
        if activities.exists():
            serializer = ActivitySerializer(activities, many=True)
            return Response({'message': 'data activities are exist', 'data': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'list of activities are empty', 'data': activities}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, format=None):
        serializer = ActivitySerializer(data=request.data)
        if serializer.is_valid():
            try:
                activity = Activity.objects.get(name=serializer.validated_data['name'])
                if activity.is_deleted:
                    activity.is_deleted = False
                    activity.save()
                    return Response({'message': 'activity saved successfully', 'data': serializer.data},
                                    status=status.HTTP_201_CREATED)
                else:
                    return Response({'message': 'activity already exist', 'data': serializer.data},
                                    status=status.HTTP_202_ACCEPTED)
            except Activity.DoesNotExist:
                serializer.save()
                return Response({'message': 'activity saved successfully', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'something wrong with activity fields'}, status=status.HTTP_400_BAD_REQUEST)

class SpecificActivityView(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request, pk, format=None):
        try:
            activity = Activity.objects.get(id=pk)
        except Activity.DoesNotExist:
            return Response({'message': 'activity not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ActivitySerializer(activity)
        # if serializer.is_valid():
        return Response({'message': 'activity exist', 'data': serializer.data}, status=status.HTTP_200_OK)
        # else:
        #     return Response({'message': 'something wrong with activity fields', 'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, format=None):
        try:
            activity = Activity.objects.get(id=pk)
        except Activity.DoesNotExist:
            return Response({'message': 'activity not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ActivitySerializer(activity, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'activity updated successfully', 'data': serializer.data}, status=status.HTTP_202_ACCEPTED)
        return Response({'message': 'something wrong with activity fields', 'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            activity = Activity.objects.get(id=pk)
        except Activity.DoesNotExist:
            return Response({'message': 'activity not found'}, status=status.HTTP_404_NOT_FOUND)
        activity.is_deleted = True
        activity.save()
        # activity.delete()
        return Response({'message': 'Activity deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

class NotificationView(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request):
        notificationMember = Member.objects.all()
        serializer = NotificationsSerializer(notificationMember, many=True, context={"request": request})

        expired_subscriptions = []
        expired_subscriptions_id = []
        data = serializer.data
        for item in range(len(serializer.data)):
            person_id = data[item]['person']['id']
            person_name = data[item]['person']['name']
            person_picture = data[item]['person']['picture']
            person_email = data[item]['person']['email']
            # print(person_name)
            list_sub = []
            for sub in data[item]['member_sub']:
                activity_name = sub['activity']['name']
                is_expired = sub['is_expired']
                # print(is_expired)
                dicOfMember = {
                            'member_name': person_name,
                            'activity_name': activity_name,
                        }
                if(is_expired):
                    if(not person_id in expired_subscriptions_id):
                        expired_subscriptions.append(data[item])
                        expired_subscriptions_id.append(person_id)
                    # print(person_name)
                    list_sub.append(sub)
                    expired_subscriptions[len(expired_subscriptions) - 1]['member_sub'] = list_sub
                    person = Person.objects.get(id=person_id)
                    if(person.TimeEmail != timezone.now().date()):
                        person.TimeEmail = timezone.now()
                        person.save()
                        context = {
                                'member_name': person_name,
                                'activity_name': activity_name,
                                # 'profile_picture_url': person_picture.url
                            }
                        email_template = render(request, 'reminderMail.html', context)
                        email_content = email_template.content.decode('utf-8')
                        send_reminder_mail(person_email, email_content)

        return Response({'message': 'notification send it', 'data': expired_subscriptions}, status=status.HTTP_200_OK)

class DashboardView(APIView):
    # permission_classes = [IsAuthenticated, IsAdminUser]
    def get(self, request, format=None):
        # x = Subscription.objects.values('startDate__year').annotate(total_price=Sum('price')).filter(total_price__gt=90)

        total_price_queryset = Subscription.objects.aggregate(total_price=Sum('price'))
        totalPrice = total_price_queryset['total_price']

        priceQueryset = Subscription.objects.values('startDate__year').annotate(total_price=Sum('price')).order_by('startDate__year')
        priceSerializer = DashboardMoneySerializer(priceQueryset, many=True)

        totalNumberQueryset = Member.objects.all().count()

        genderNumberQueryset = Member.objects.values('person__gender').annotate(number_of_gender=Count('person'))
        genderNumberSerializer = DashboardNumberOfGenderSerializer(genderNumberQueryset, many=True)

        numberPeopleByActivityQueryset = Subscription.objects.values('activity__name').annotate(number=Count(Cast('member', IntegerField()), distinct=True))
        numberPeopleByActivitySerializer = DashboardNumberOfPeopleByActivitySerializer(numberPeopleByActivityQueryset, many=True)

        numberPeopleByActivityGenderQueryset = Subscription.objects.values('activity__name', 'member__person__gender').annotate(number=Count(Cast('member', IntegerField()), distinct=True))
        numberPeopleByActivityGenderSerializer = DashboardnumberPeopleByActivityGenderSerializer(numberPeopleByActivityGenderQueryset, many=True)

        data = {
            # 'x': x,
            'totalMoney': totalPrice,
            'moneyByYear': priceSerializer.data,
            'totalNumber': totalNumberQueryset,
            'numberOfGender': genderNumberSerializer.data,
            'numberPeopleByActivity': numberPeopleByActivitySerializer.data,
            'numberPeopleByActivityGender': numberPeopleByActivityGenderSerializer.data,
            }
        return Response({'message': 'dashboard data', 'data': data}, status=status.HTTP_200_OK)

class DashboardMoneyByMonthByYearView(APIView):
    # permission_classes = [IsAuthenticated, IsAdminUser]
    def get(self, request):
        current_year = datetime.now(tz=timezone.utc).year
        FilterByYear = request.GET.get('year', current_year)

        queryset = Subscription.objects.filter(startDate__year=FilterByYear).values('startDate__month').annotate(price=Sum('price'))
        # total_price_by_month = Subscription.objects.filter(startDate__year=FilterByYear).annotate(month=ExtractMonth('startDate')).values('month').annotate(total_price=Sum('price')).order_by('month')
        return Response({'message': 'prices by month by year','data': queryset}, status=status.HTTP_200_OK)

class DashboardMoneyByActivityByYearView(APIView):
    # permission_classes = [IsAuthenticated, IsAdminUser]
    def get(self, request):
        current_year = datetime.now(tz=timezone.utc).year
        FilterByYear = request.GET.get('year', current_year)

        queryset = Subscription.objects.filter(startDate__year=FilterByYear).values('activity__name').annotate(price=Sum('price'))
        return Response({'message': 'prices by month by year','data': queryset}, status=status.HTTP_200_OK)