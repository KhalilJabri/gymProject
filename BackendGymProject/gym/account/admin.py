from django.contrib import admin
from .models import User, Member, Coach, Person, Subscription, Activity

# Register your models here.
admin.site.register(User)
admin.site.register(Person)
admin.site.register(Member)
admin.site.register(Coach)
admin.site.register(Subscription)
admin.site.register(Activity)
