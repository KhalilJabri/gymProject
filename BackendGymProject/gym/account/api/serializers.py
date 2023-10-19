from rest_framework import serializers
import re
from dateutil.relativedelta import relativedelta
from datetime import datetime
from django.utils import timezone

from ..models import User, Member, Coach, Person, Activity, Subscription, Gym

class GymSerializer(serializers.ModelSerializer):
    pictureGym = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)
    class Meta:
        model = Gym
        fields = '__all__'

class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    class Meta:
        model = User
        fields = ['email', 'password']

class ChangePermissionUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['is_active', 'is_admin']

class RegisterUserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    class Meta:
        model = User
        fields = ['email', 'name', 'password', 'password2', 'cin', 'number', 'address', 'birthdate', 'picture', 'gender']
        # exclude = ['created_at', 'otp', 'is_active', 'is_admin']
        extra_kwargs = {
            'picture': {'read_only': True}
        }

    def save(self):
        email = self.validated_data['email']
        password = self.validated_data['password']
        password2 = self.validated_data['password2']
        name = self.validated_data['name']
        cin = self.validated_data['cin']
        address = self.validated_data['address']
        number = self.validated_data['number']
        birthdate = self.validated_data['birthdate']
        # picture = self.validated_data['picture']

        if not bool(re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email)):
            raise serializers.ValidationError({'message': 'Invalid email format!'})
        if password != password2 :
            raise serializers.ValidationError({'message': 'password mismatch!'})
        if not bool(re.match(r"^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[@#$])[\w\d@#$]{6,12}$", password)):
            raise serializers.ValidationError({'message': 'password must contain least one digit, one uppercase letter, '
                                                          'at least one lowercase letter, at least one special character'})
        if len(name) == 0:
            raise serializers.ValidationError({'message': 'name should not be empty!'})
        # print(bool(re.match(r'^(?:\d{8}|\d{12})$', cin)))
        if not bool(re.match(r'^(?:\d{8}|\d{12})$', cin)):
            raise serializers.ValidationError({'message': 'cin is not correct!'})

        user = User(email=email,
                    name=name,
                    cin=cin,
                    number=number,
                    address=address,
                    # picture=picture,
                    birthdate=birthdate)
        user.set_password(password)
        user.save()
        return user

class UserResetChangePasswordSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    class Meta:
        model = User
        fields = ['password', 'password2']

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password != password2:
            raise serializers.ValidationError('passwords mismatch!')
        return attrs

class SendOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()

class VerifyOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=10)

class ModifyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'name', 'address', 'picture', 'cin', 'number', 'birthdate', 'gender']

    def update(self, instance, validated_data):
        if len(self.validated_data.get('email')) == 0 :
            instance.email = instance.email
        instance.email = self.validated_data.get('email', instance.email)
        instance.name = self.validated_data.get('name', instance.name)
        instance.address = self.validated_data.get('address', instance.address)
        instance.picture = self.validated_data.get('picture', instance.picture)
        instance.cin = self.validated_data.get('cin', instance.cin)
        instance.number = self.validated_data.get('number', instance.number)
        instance.birthdate = self.validated_data.get('birthdate', instance.birthdate)
        instance.gender = self.validated_data.get('gender', instance.gender)
        instance.save()
        return instance

class UsersSerializer(serializers.ModelSerializer):
    picture = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)
    class Meta:
        model = User
        # fields = '__all__'
        fields = ['id', 'name', 'picture', 'number', 'is_active', 'is_admin']
        # exclude = ['password', 'otp']

class SpecificUserSerializer(serializers.ModelSerializer):
    picture = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)
    class Meta:
        model = User
        # fields = '__all__'
        fields = ['id', 'email', 'name', 'gender', 'address', 'picture', 'number', 'cin', 'birthdate', 'is_active', 'is_admin', 'created_at']
        # exclude = ['password', 'otp']

class FirstPersonMemberDetailsSerializer(serializers.ModelSerializer):
    picture = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)
    class Meta:
        model = Person
        fields = ['name', 'gender', 'is_active', 'picture']

class FirstActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'

class MemberTableSerializer(serializers.ModelSerializer):
    person = FirstPersonMemberDetailsSerializer()
    class Meta:
        model = Member
        fields = '__all__'

# class ActiveMemberSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Person
#         fields = ['is_active']

class FirstSubscriptionSerializer(serializers.ModelSerializer):
    endDate = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    member = MemberTableSerializer()
    activity = FirstActivitySerializer()

    class Meta:
        model = Subscription
        fields = ['id', 'endDate', 'status', 'activity', 'member']

    def get_endDate(self, data):
        global endDate
        if(data.typeOfNumberSub == 'year'):
            endDate = data.startDate + relativedelta(years=data.numberOfSub)
        elif(data.typeOfNumberSub == 'month'):
            endDate = data.startDate + relativedelta(months=data.numberOfSub)
        elif (data.typeOfNumberSub == 'day'):
            endDate = data.startDate + relativedelta(days=data.numberOfSub)
        # rest_days = (endDate - datetime.now().date()).days
        return endDate

    def get_status(self, data):
        global endDate
        if(data.typeOfNumberSub == 'year'):
            endDate = data.startDate + relativedelta(years=data.numberOfSub)
        elif(data.typeOfNumberSub == 'month'):
            endDate = data.startDate + relativedelta(months=data.numberOfSub)
        elif (data.typeOfNumberSub == 'day'):
            endDate = data.startDate + relativedelta(days=data.numberOfSub)
        if endDate > timezone.now().date():
            return True
        else:
            return False

class AddGetMemberSerializer(serializers.ModelSerializer):
    person = FirstPersonMemberDetailsSerializer()
    # member_sub = FirstSubscriptionSerializer(many=True)
    class Meta:
        model = Member
        fields = ['id', 'person', 'member_sub']
        extra_kwargs = {
            'id': {'read_only': True},
            # 'person': {'read_only': True},
        }

class UpdateMemberPersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['email', 'name', 'gender', 'address', 'number', 'cin', 'birthdate', 'picture', 'created_at']
        extra_kwargs = {
            'picture': {'read_only': True},
            'created_at': {'read_only': True}
        }

class SubscriptionDetailsSerializer(serializers.ModelSerializer):
    endDate = serializers.SerializerMethodField()
    activity = FirstActivitySerializer()
    class Meta:
        model = Subscription
        fields = ['id', 'startDate', 'endDate', 'price', 'activity']

    def get_endDate(self, data):
        if(data.typeOfNumberSub == 'year'):
            return data.startDate + relativedelta(years=data.numberOfSub)
        elif(data.typeOfNumberSub == 'month'):
            return data.startDate + relativedelta(months=data.numberOfSub)
        elif (data.typeOfNumberSub == 'day'):
            return data.startDate + relativedelta(days=data.numberOfSub)

class GetSpecificMemberSerialiser(serializers.ModelSerializer):
    person = UpdateMemberPersonSerializer()
    member_sub = SubscriptionDetailsSerializer(many=True)
    class Meta:
        model = Member
        fields = ['id', 'person', 'member_sub']

class UpdateMemberSerializer(serializers.ModelSerializer):
    person = UpdateMemberPersonSerializer()
    class Meta:
        model = Member
        fields = ['id', 'person']

class SubscriptionSerializer(serializers.ModelSerializer):
    # startDate = serializers.DateField(required=False, default=timezone.now().date())
    class Meta:
        model = Subscription
        fields = ['id', 'price', 'startDate', 'numberOfSub', 'typeOfNumberSub', 'member', 'activity']
        extra_kwargs = {
            'id': {'read_only': True},
            'startDate': {'required': False, 'default': timezone.now().date()}
        }

class AddMemberSubscriptionSerializer(serializers.ModelSerializer):
    # startDate = serializers.DateField(required=False, default=timezone.now().date())
    class Meta:
        model = Subscription
        fields = ['id', 'price', 'startDate', 'numberOfSub', 'typeOfNumberSub', 'activity']
        extra_kwargs = {
            'id': {'read_only': True},
            'startDate': {'required': False, 'default': timezone.now().date()}
        }

class MngPersonMemberSerializer(serializers.ModelSerializer):
    # member_profile = AddGetMemberSerializer()
    # subscription = SubscriptionSerializer()
    class Meta:
        model = Person
        fields = ['id', 'email', 'name', 'gender', 'address', 'number', 'cin', 'birthdate', 'picture', 'created_at']
        extra_kwargs = {
            'id': {'read_only': True},
            'created_at': {'read_only': True},
            # 'member_profile': {'read_only': True},
            'picture': {'read_only': True},
        }

class AddMemberSerializer(serializers.Serializer):
    person = MngPersonMemberSerializer()
    subscription = AddMemberSubscriptionSerializer()

class CoachSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coach
        fields = ['hireDate', 'person', 'activity']

class MngPersonCoachSerializer(serializers.ModelSerializer):
    # coach_profile = AddGetMemberSerializer()
    picture = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)
    class Meta:
        model = Person
        fields = ['id', 'email', 'name', 'gender', 'address', 'number', 'cin', 'birthdate', 'picture', 'created_at']
        extra_kwargs = {
            'id': {'read_only': True},
            'created_at': {'read_only': True},
            # 'coach_profile': {'read_only': True},
            'picture': {'read_only': True},
        }

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'

class GetCoachSerializer(serializers.ModelSerializer):
    person = MngPersonCoachSerializer()
    # hireDate = serializers.DateField()
    activity = ActivitySerializer()
    class Meta:
        model = Coach
        fields = ['id', 'hireDate', 'person', 'activity']
        extra_kwargs = {
            'id': {'read_only': True}
        }

class AddCoachSerializer(serializers.ModelSerializer):
    person = MngPersonCoachSerializer()
    # hireDate = serializers.DateField()
    activity = serializers.IntegerField()
    class Meta:
        model = Coach
        fields = ['id', 'hireDate', 'person', 'activity']
        extra_kwargs = {
            'id': {'read_only': True}
        }

class UpdateCoachSerializer(serializers.ModelSerializer):
    person = MngPersonCoachSerializer()
    class Meta:
        model = Coach
        fields = ['id', 'hireDate', 'person', 'activity']
        extra_kwargs = {
            'id': {'read_only': True}
        }

class SpecificSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['price', 'startDate', 'numberOfSub', 'typeOfNumberSub', 'activity']

class NotificationPersonSerializer(serializers.ModelSerializer):
    picture = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)
    class Meta:
        model = Person
        fields = ['id', 'name', 'picture', 'email']

class NotificationActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['name']

class NotificationSubscriptionSerializer(serializers.ModelSerializer):
    activity = NotificationActivitySerializer()
    class Meta:
        model = Subscription
        fields = ['id', 'numberOfSub', 'typeOfNumberSub', 'activity', 'is_expired', 'startDate']


class NotificationsSerializer(serializers.ModelSerializer):
    person = NotificationPersonSerializer()
    member_sub = NotificationSubscriptionSerializer(many=True)
    class Meta:
        model = Member
        fields = ['person', 'member_sub']

class DashboardMoneySerializer(serializers.Serializer):
    total_price = serializers.IntegerField()
    year = serializers.IntegerField(source='startDate__year')

class DashboardNumberOfGenderSerializer(serializers.Serializer):
    genderNumber = serializers.IntegerField(source='number_of_gender')
    genderType = serializers.CharField(source='person__gender')

class DashboardNumberOfPeopleByActivitySerializer(serializers.Serializer):
    activityName = serializers.CharField(source='activity__name')
    numberOfMember = serializers.IntegerField(source='number')

class DashboardnumberPeopleByActivityGenderSerializer(serializers.Serializer):
    activityName = serializers.CharField(source="activity__name")
    genderType = serializers.CharField(source="member__person__gender")
    numberOfMember = serializers.IntegerField(source="number")