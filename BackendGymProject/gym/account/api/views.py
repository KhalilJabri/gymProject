from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import render
import random
import string
from django.utils import timezone
from django.db.models import Sum, Count
from django.db.models.functions import Cast
from django.db.models import IntegerField
from rest_framework import filters
from dateutil.relativedelta import relativedelta
from datetime import datetime
from django.db.models import F, Case, When, Value, DurationField, ExpressionWrapper
from django.db.models import Max, F, Subquery, OuterRef

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
                          DashboardMoneySerializer, DashboardNumberOfGenderSerializer,
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

class ChangePermissionUserView(APIView):
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

class UserChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
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
    def patch(self, request, pk):
        try:
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

    def delete(self, request, pk):
        try:
            user = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({'message': 'user not found'}, status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return Response({'message': 'user deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

class GetUsersView(APIView):
    def get(self, request):
        search = request.GET.get('search', '')

        if len(search) != 0:
            users = User.objects.filter(name__icontains=search)
        else:
            users = User.objects.all()

        serializer = UsersSerializer(users, many=True, context={"request": request})

        return Response({'message': 'all users', 'data': serializer.data}, status=status.HTTP_200_OK)

class GetSpecificUserView(APIView):
    def get(self, request, pk):
        try:
            user = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({'message': 'user not found!'}, status=status.HTTP_404_NOT_FOUND)
        serializer = SpecificUserSerializer(user, context={"request": request})
        return Response({'message': 'user exist', 'data': serializer.data}, status=status.HTTP_200_OK)

class AddGetMemberView(APIView):
    def get(self, request, format=None):
        activity_name = request.GET.get('activity_name', '')
        search = request.GET.get('search', '')
        startDate = request.GET.get('startDate', '')
        endDate = request.GET.get('endDate', '')
        statusFilter = request.GET.get('status', '')

        sub = Subscription.objects.all()

        if activity_name == '':
            sub = sub.all()
        elif activity_name != 'all':
            sub = sub.filter(activity__name=activity_name)

        if search:
            sub = sub.filter(member__person__name__icontains=search)

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

        if statusFilter == 'true':
            aux = []
            for item in sub:
                if item.end_date > timezone.now().date():
                    aux.append(item)
            sub = aux
        elif statusFilter == 'false':
            aux = []
            for item in sub:
                if item.end_date <= timezone.now().date():
                    aux.append(item)
            sub = aux

        serializer = FirstSubscriptionSerializer(sub, many=True, context={"request": request})
        members_with_max_rest_days = []
        # members_id_with_max_rest_days_activity = []
        members_id = []
        # liste = []

        for subData in serializer.data:
            # for i in range(len(members_with_max_rest_days)):
            #     print(members_with_max_rest_days[i]['member']['id'])
            # print('\n')
            if not subData['member']['id'] in members_id:
                dicActivity = {}
                liste = []
                members_id.append(subData['member']['id'])
                dicActivity['member'] = subData['member']
                members_with_activity = {
                    'id': subData['id'],
                    'endDate': subData['endDate'],
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



        # for sub_data in serializer.data:
        #     if not sub_data['member']['id'] in members_id:
        #         members_id.append(sub_data['member']['id'])
        #         dicActivity['id'] = sub_data['id']
        #         dicActivity
        #         members_id_with_max_rest_days_activity['sub'].append()
        #         members_with_max_rest_days.append(sub_data)
        #     else:
        #         index = members_id.index(sub_data['member']['id'])
        #         if(sub_data['endDate'] > members_with_max_rest_days[index]['endDate']):
        #             members_with_max_rest_days[index] = sub_data

        return Response({'message': 'data of members', 'data': members_with_max_rest_days}, status=status.HTTP_200_OK)

        # queryset = Member.objects.all()
        #
        # if activity_name == '':
        #     queryset = queryset.all()
        # elif activity_name != 'all':
        #     queryset = queryset.filter(member_sub__activity__name=activity_name)
        #
        # if search:
        #     queryset = queryset.filter(person__name__icontains=search)
        #
        # if startDate == '':
        #     queryset = queryset.all()
        # elif startDate:
        #     queryset = queryset.filter(startDate=startDate)
        #
        # if endDate:
        #     aux = []
        #     for item in queryset:
        #         date_str = item.end_date.strftime("%Y-%m-%d")
        #         if date_str == endDate:
        #             aux.append(item)
        #     queryset = aux
        #
        # if statusFilter == 'true':
        #     aux = []
        #     for item in queryset:
        #         if item.end_date > timezone.now().date():
        #             aux.append(item)
        #     queryset = aux
        # elif statusFilter == 'false':
        #     aux = []
        #     for item in queryset:
        #         if item.end_date <= timezone.now().date():
        #             aux.append(item)
        #     queryset = aux
        #
        #
        # serializer = AddGetMemberSerializer(queryset, many=True)
        # newData = []
        # id_subscription = []
        # # for item in serializer.data:
        # #     if
        # max_end_dates_subquery = Subscription.objects.filter(
        #     activity=OuterRef('activity'),
        #     member=OuterRef('member')
        # ).values('activity').annotate(
        #     max_end_date=Max('endDate')
        # ).values('max_end_date')
        #
        # # Query to retrieve the subscriptions with the maximum endDate for each activity by members.
        # subscriptions = Subscription.objects.filter(
        #     endDate=Subquery(max_end_dates_subquery),
        # )
        # return Response(subscriptions, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        serializer = AddMemberSerializer(data=request.data)
        if serializer.is_valid():
            serializer_person = MngPersonMemberSerializer(data=serializer.data['person'])
            if serializer_person.is_valid():
                # if(not Person.objects.get(email=serializer_person.data['email']).exists):

                person_instance = serializer_person.save()
                # member_data = request.data.get('member_profile', {})
                member_data = {}
                member_data['person'] = person_instance.id
                member_serializer = AddGetMemberSerializer(data=member_data)
                if member_serializer.is_valid():
                    member_instance = member_serializer.save()
                    subscription_instance = serializer.data['subscription']
                    subscription_instance['member'] = member_instance.id
                    # print(subscription_instance['member'])
                    serializer_subscription = SubscriptionSerializer(data=subscription_instance)
                    if serializer_subscription.is_valid():
                        serializer_subscription.save()
                        gym = Gym.objects.all().first()
                        context = {
                            'member_name': serializer.data['person']['name'],
                            'gym_name': gym.name,
                            # 'gym_picture': gym.pictureGym.url
                        }
                        email_template = render(request, 'email_member.html', context)
                        email_content = email_template.content.decode('utf-8')
                        send_greetings_mail_Member(serializer.data['person']['email'], email_content)
                        return Response({'message': 'member and his subscription saved successfully', 'data': serializer_subscription.data},
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
            else:
                return Response({'message': 'something wrong with person model', 'error': serializer_person.errors},
                                status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'something wrong with Person or subscription model', 'error': serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)

# class ActiveMemberView(APIView):
#     def put(self, request, pk):
#         try:
#             activeMember = Member.objects.get(id=pk)
#         except Member.DoesNotExist:
#             return Response({'messsage': 'member not found'}, status=status.HTTP_404_NOT_FOUND)
#         serializer = ActiveMemberSerializer(activeMember.person, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({'message': 'status of member changed successfully', 'data': serializer.data}, status=status.HTTP_202_ACCEPTED)
#         else:
#             return Response({'message': 'something wrong!!'}, status=status.HTTP_400_BAD_REQUEST)

class SpecificMemberView(APIView):
    def get(self, request, pk):
        try:
            try:
                member = Member.objects.get(id=pk)
            except Member.DoesNotExist:
                return Response({'messsage': 'member not found'}, status=status.HTTP_404_NOT_FOUND)

            serializer_member = GetSpecificMemberSerialiser(member, context={"request": request})
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
            person.delete()
            return Response({'message': 'Person associated with Member deleted successfully'},
                            status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'message': 'No associated Person found for Member'}, status=status.HTTP_404_NOT_FOUND)

class AddGetCoachView(APIView):
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
                        'gym_picture': gym.pictureGym.url
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
    def post(self, request, format=None):
        serialiser = SubscriptionSerializer(data=request.data)
        if serialiser.is_valid():
            serialiser.save()
            return Response({'message': 'subscription added', 'data': serialiser.data}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'something wrong with subscription model', 'error': serialiser.errors}, status=status.HTTP_400_BAD_REQUEST)

class SpecificSubscriptionView(APIView):
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

class ActivityView(APIView):
    def get(self, request, format=None):
        activities = Activity.objects.all()
        if activities.exists():
            serializer = ActivitySerializer(activities, many=True)
            # if serializer.is_valid():
            return Response({'message': 'data activities are exist', 'data': serializer.data}, status=status.HTTP_200_OK)
            # else:
            #     return Response({'message': 'something wrong with activity fields', 'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': 'list of activities are empty', 'data': activities}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, format=None):
        serializer = ActivitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'activity saved successfully', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'something wrong with activity fields', 'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class SpecificActivityView(APIView):
    def get(self, request, pk, format=None):
        try:
            activity = Activity.objects.get(id=pk)
        except Activity.DoesNotExist:
            return Response({'message': 'activity not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ActivitySerializer(activity)
        if serializer.is_valid():
            return Response({'message': 'activity exist', 'data': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'something wrong with activity fields', 'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

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
        activity.delete()
        return Response({'message': 'activity deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

class NotificationView(APIView):
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
    def get(self, request, format=None):
        # x = Subscription.objects.values('startDate__year').annotate(total_price=Sum('price')).filter(total_price__gt=90)

        total_price_queryset = Subscription.objects.aggregate(total_price=Sum('price'))
        totalPrice = total_price_queryset['total_price']

        priceQueryset = Subscription.objects.values('startDate__year').annotate(total_price=Sum('price')).order_by('startDate__year')
        priceSerializer = DashboardMoneySerializer(priceQueryset, many=True)

        totalNumberQueryset = Member.objects.all().count()

        # activityNumberQueryset = Subscription.objects.values('activity__name').annotate(number_of_people=Count('activity'))
        # totalNumberSerializer = DashboardNumberPeopleActivitySerializer(activityNumberQueryset, many=True)

        genderNumberQueryset = Member.objects.values('person__gender').annotate(number_of_gender=Count('person'))
        genderNumberSerializer = DashboardNumberOfGenderSerializer(genderNumberQueryset, many=True)

        numberPeopleByActivityQueryset = Subscription.objects.values('activity__name').annotate(number=Count(Cast('member', IntegerField()), distinct=True))
        numberPeopleByActivitySerializer = DashboardNumberOfPeopleByActivitySerializer(numberPeopleByActivityQueryset, many=True)

        data = {
            # 'x': x,
            'totalMoney': totalPrice,
            'moneyByYear': priceSerializer.data,
            'totalNumber': totalNumberQueryset,
            # 'numberOfActivity': totalNumberSerializer.data,
            'numberOfGender': genderNumberSerializer.data,
            'numberPeopleByActivity': numberPeopleByActivitySerializer.data
            }
        return Response({'message': 'dashboard data', 'data': data}, status=status.HTTP_200_OK)