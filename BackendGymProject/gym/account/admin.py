from django.contrib import admin
from .models import User, Member, Coach, Person, Subscription, Activity, Gym

class PublishUser(admin.ModelAdmin):
    list_display = ('name', 'email')

# Register your models here.
admin.site.register(User, PublishUser)
admin.site.register(Person)
admin.site.register(Member)
admin.site.register(Coach)
admin.site.register(Subscription)
admin.site.register(Activity)
admin.site.register(Gym)