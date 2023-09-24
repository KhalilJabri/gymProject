from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import render
import random
import string
import asyncio
from dateutil.relativedelta import relativedelta
# from django.db.models import OuterRef, Subquery
from django.utils import timezone
from django.db.models import F, ExpressionWrapper, Case, When, Value, DateField, Q, Count

from ..models import User, Member, Coach, Person, Activity, Subscription
from ..email import send_otp_via_email, send_reminder_mail
from .serializers import (LoginSerializer, RegisterUserSerializer, UserResetChangePasswordSerializer, SendOtpSerializer,
    VerifyOtpSerializer, ModifyUserSerializer, GetCoachSerializer, AddGetMemberSerializer, MngPersonMemberSerializer,
    MngPersonCoachSerializer, CoachSerializer, ActivitySerializer, FirstSubscriptionSerializer, UpdateMemberSerializer,
    GetSpecificMemberSerialiser, UsersSerializer, ActiveUserSerializer, SubscriptionSerializer, SpecificSubscriptionSerializer,
    UpdateCoachSerializer, AddCoachSerializer, FirstSubscriptionSerializer, AddMemberSerializer, NotificationsSerializer )


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
                try:
                    user_active = User.objects.get(email=email)
                except User.DoesNotExist:
                    return Response({'message': 'user not found mail'}, status=status.HTTP_404_NOT_FOUND)

                if not user_active.is_active:
                    return Response({'message': 'user account not active'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'message': 'user not found! password'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'something went wrong!', 'error': serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)

class ActiveUserView(APIView):
    def put(self, request, pk):
        try:
            user_active = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({'message': 'user not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ActiveUserSerializer(user_active, data=request.data)
        if serializer.is_valid():
            serializer.save()
            if request.data.get('is_active'):
                return Response({'message': 'user activated'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'user disabled'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'something went wrong!', 'error': serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)

class UserRegisterView(APIView):
    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
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
            email_template = render(request, 'main.html', context)
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
        users = User.objects.all()
        serializer = UsersSerializer(users, many=True)
        return Response({'message': 'all users', 'data': serializer.data}, status=status.HTTP_200_OK)

class AddGetMemberView(APIView):
    def get(self, request, format=None):
        activity_name = request.GET.get('activity_name', '')
        # member = Member.objects.filter(member_sub__activity__name=activity_name)
        # serializer = AddGetMemberSerializer(member, many=True)
        # members_with_max_rest_days = []
        # members_id_with_max_rest_days = []
        # # Iterate through the serialized data and find the maximum restDays for each member
        # for member_data in serializer.data:
        #     max_rest_days = 0  # Initialize max_rest_days to 0 for the current member
        #
        #     for subscription in member_data['member_sub']:
        #         rest_days = subscription['restDays']
        #         max_rest_days = max(max_rest_days, rest_days)
        #
        #     # Include the maximum restDays in the member's data
        #     member_data['restDays'] = max_rest_days
        #     if not member_data['id'] in members_id_with_max_rest_days:
        #         members_with_max_rest_days.append(member_data)
        #         members_id_with_max_rest_days.append(member_data['id'])
        sub = Subscription.objects.filter(activity__name=activity_name)
        serializer = FirstSubscriptionSerializer(sub, many=True)
        members_with_max_rest_days = []
        members_id_with_max_rest_days = []

        for sub_data in serializer.data:
            if not sub_data['member']['id'] in members_id_with_max_rest_days:
                members_id_with_max_rest_days.append(sub_data['member']['id'])
                members_with_max_rest_days.append(sub_data)
            else:
                index = members_id_with_max_rest_days.index(sub_data['member']['id'])
                if(sub_data['restDays'] > members_with_max_rest_days[index]['restDays']):
                    members_with_max_rest_days[index] = sub_data

        return Response(members_with_max_rest_days, status=status.HTTP_200_OK)

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
                    print(subscription_instance['member'])
                    serializer_subscription = SubscriptionSerializer(data=subscription_instance)
                    if serializer_subscription.is_valid():
                        serializer_subscription.save()
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

class SpecificMemberView(APIView):
    def get(self, request, pk):
        try:
            try:
                member = Member.objects.get(id=pk)
            except Member.DoesNotExist:
                return Response({'messsage': 'member not found'}, status=status.HTTP_404_NOT_FOUND)

            serializer_member = GetSpecificMemberSerialiser(member)
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
        coach = Coach.objects.all()
        serializer = GetCoachSerializer(coach, many=True)
        return Response({'message': 'data of coachs', 'data': serializer.data}, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        serializer = AddCoachSerializer(data=request.data)
        if serializer.is_valid():
            serializer_person = MngPersonCoachSerializer(data=serializer.validated_data['person'])
            if serializer_person.is_valid():
                instance_person = serializer_person.save()
                coach_data = {
                    'hireDate': serializer.validated_data['hireDate'],
                    'person': instance_person.id,
                    'activity': serializer.validated_data['activity'],
                }
                serializer_coach = CoachSerializer(data=coach_data)
                if serializer_coach.is_valid():
                    serializer_coach.save()
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
            coach = Coach.objects.get(id=pk)
        except Coach.DoesNotExist:
            return Response({'message': 'user not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = GetCoachSerializer(coach)
        return Response({'message': 'data of coach', 'data': serializer.data}, status=status.HTTP_200_OK)

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
        serializer = NotificationsSerializer(notificationMember, many=True)

        expired_subscriptions = []
        expired_subscriptions_id = []
        # list_member_mails = []
        # list_member_data = []
        data = serializer.data
        for item in range(len(serializer.data)):
            person_id = data[item]['person']['id']
            person_name = data[item]['person']['name']
            person_picture = data[item]['person']['picture']
            person_email = data[item]['person']['email']
            list_sub = []
            for sub in data[item]['member_sub']:
                activity_name = sub['activity']['name']
                is_expired = sub['is_expired']
                dicOfMember = {
                            'member_name': person_name,
                            'activity_name': activity_name,
                        }
                if(is_expired):
                    if(not person_id in expired_subscriptions_id):
                        expired_subscriptions.append(data[item])
                        expired_subscriptions_id.append(person_id)
                    list_sub.append(sub)
                    expired_subscriptions[len(expired_subscriptions) - 1]['member_sub'] = list_sub
                    # list_member_data.append(dicOfMember)
                    # list_member_mails.append(person_email)
                    person = Person.objects.get(id=person_id)
                    if(person.TimeEmail != timezone.now().date()):
                        person.TimeEmail = timezone.now()
                        person.save()
                        context = {
                                'member_name': person_name,
                                'activity_name': activity_name,
                                # 'date_debut': date_debut,
                                # 'date_fin': date_fin
                                # 'profile_picture_url': person_picture.url
                            }
                        email_template = render(request, 'reminderMail.html', context)
                        email_content = email_template.content.decode('utf-8')
                        send_reminder_mail(person_email, email_content)

        return Response({'message': 'notification send it', 'data': expired_subscriptions}, status=status.HTTP_200_OK)

class DashboardView(APIView):
    def get(self, request, format=None):
        pass
