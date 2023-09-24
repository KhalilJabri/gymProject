from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
import datetime
from django.utils import timezone
from django.core.validators import MinValueValidator
from dateutil.relativedelta import relativedelta

# class TimeSendEmail(models.Model):
#     timeEmail = models.DateField()

class Person(models.Model):
    GENDER_CHOICES = [
        ('other', 'Other'),
        ('male', 'Male'),
        ('female', 'Female'),
    ]
    email = models.EmailField(unique=True, max_length=255, blank=True)
    name = models.CharField(max_length=250)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    address = models.CharField(max_length=300, blank=True, null=True)
    number = models.CharField(max_length=12, blank=True, null=True)
    cin = models.CharField(max_length=8, blank=True)
    birthdate = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    picture = models.ImageField(upload_to='storeImg/%Y/%m/%d/', default='store.png', blank=True)
    TimeEmail = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.name
        # return str(self.id)
class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, password2=None):
        if not email:
            raise ValueError('User have an email address')
        if password != password2:
            raise ValueError('passwords mismatch')

        user = self.model(
            email= self.normalize_email(email),
            name= name
        )
        # user.is_active = True
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None):

        user = self.create_user(
            email= email,
            name= name,
            password=password,
            password2=password
        )
        user.is_admin = True
        user.save(using=self._db)
        return user
class User(AbstractBaseUser):
    GENDER_CHOICES = [
        ('other', 'Other'),
        ('male', 'Male'),
        ('female', 'Female'),
    ]
    email = models.EmailField(unique=True, max_length=255)
    name = models.CharField(max_length=250)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    address = models.CharField(max_length=300, blank=True, null=True)
    number = models.CharField(max_length=12, blank=True, null=True)
    cin = models.CharField(max_length=12, blank=True, null=True)
    birthdate = models.DateField(default=datetime.date(2001, 1, 1), null=True, blank=True)
    otp = models.CharField(max_length=10, blank=True)
    picture = models.ImageField(upload_to='profileImage/%Y/%m/%d/', default='user.png', blank=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    # TimeEmail = models.DateField(blank=True, null=True)
    # updated_at = models.DateField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin

class Member(models.Model):
    person = models.OneToOneField(Person, on_delete=models.CASCADE, related_name='member_profile')

    def __str__(self):
        return self.person.name

class Activity(models.Model):
    name = models.CharField(max_length=150, unique=True)
    description = models.CharField(max_length=300, blank=True)

    def __str__(self):
        return self.name

class Coach(models.Model):
    hireDate = models.DateField(default=timezone.now)
    person = models.OneToOneField(Person, on_delete=models.CASCADE, related_name='coach_profile')
    activity = models.ForeignKey(Activity, on_delete=models.PROTECT, related_name='coach_activity')

    def __str__(self):
        return self.person.name


class Subscription(models.Model):
    TYPE_CHOICES = [
        ('year', 'Year'),
        ('month', 'Month'),
        ('day', 'Day'),
    ]
    price = models.FloatField(default=0, validators=[MinValueValidator(0)])
    startDate = models.DateField(default=timezone.now)
    numberOfSub = models.PositiveIntegerField()
    typeOfNumberSub = models.CharField(max_length=10, choices=TYPE_CHOICES)
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='member_sub')
    activity = models.ForeignKey(Activity, on_delete=models.SET_NULL, related_name='activity_sub', null=True)

    def __str__(self):
        return self.member.person.name + ' ' + str(self.startDate)

    @property
    def is_expired(self):
        # Calculate the end date based on typeOfNumberSub and numberOfSub
        if self.typeOfNumberSub == 'year':
            end_date = self.startDate + relativedelta(years=self.numberOfSub)
        elif self.typeOfNumberSub == 'month':
            end_date = self.startDate + relativedelta(months=self.numberOfSub)
        elif self.typeOfNumberSub == 'day':
            end_date = self.startDate + relativedelta(days=self.numberOfSub)
        else:
            end_date = None

        # Check if the calculated end date is in the past
        return end_date == timezone.now().date()

    @property
    def end_date(self):
        if self.typeOfNumberSub == 'year':
            end_date = self.startDate + relativedelta(years=self.numberOfSub)
        elif self.typeOfNumberSub == 'month':
            end_date = self.startDate + relativedelta(months=self.numberOfSub)
        elif self.typeOfNumberSub == 'day':
            end_date = self.startDate + relativedelta(days=self.numberOfSub)
        else:
            end_date = None

        # Check if the calculated end date is in the past
        return end_date

