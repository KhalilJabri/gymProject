from django.urls import path

from .views import (UserLoginView, UserRegisterView, UserResetPasswordView, SendOtpView,
                    VerifyOtpView, ModifyUserProfileView, UserChangePasswordView, AddGetMemberView, SpecificMemberView,
                    AddGetCoachView, SpecificCoachView, ActivityView, SpecificActivityView, GetUsersView,
                    ChangePermissionUserView,
                    SubscriptionView, SpecificSubscriptionView, NotificationView, GetSpecificUserView,
                    DashboardView, )

urlpatterns = [
    path('login/', UserLoginView.as_view(), name='user_login'),
    path('register/', UserRegisterView.as_view(), name='user_register'),
    path('changePassword/<int:pk>/', UserChangePasswordView.as_view(), name='change_password'),
    path('resetPassword/<str:pk>/', UserResetPasswordView.as_view(), name='reset_password'),
    path('sendOtp/', SendOtpView.as_view(), name='send_otp_via_email'),
    path('verifyOtp/', VerifyOtpView.as_view(), name='verify_otp'),
    path('modifyOrDeleteUser/<int:pk>/', ModifyUserProfileView.as_view(), name='modify_user_profile'),

    path('users/', GetUsersView.as_view(), name='all_users'),
    path('users/<int:pk>/', GetSpecificUserView.as_view(), name='get_specific_user'),
    path('changePermissionUser/<int:pk>/', ChangePermissionUserView.as_view(), name='change_active_user'),
    # path('adminUser/<int:pk>/', AdminUserView.as_view(), name='change_active_user'),

    path('member/', AddGetMemberView.as_view(), name='add_get_member'),
    path('member/<int:pk>/', SpecificMemberView.as_view(), name='get_update_delete_specific_member'),
    # path('activeMember/<int:pk>/', ActiveMemberView.as_view(), name="change_member_status"),

    path('coach/', AddGetCoachView.as_view(), name='add_get_coach'),
    path('coach/<int:pk>/', SpecificCoachView.as_view(), name='get_update_dalete_specific_coach'),

    path('activity/', ActivityView.as_view(), name='add_get_activities'),
    path('activity/<int:pk>/', SpecificActivityView.as_view(), name='get_update_delete_activity'),

    path('subscription/', SubscriptionView.as_view(), name='add_subscription'),
    path('subscription/<int:pk>/', SpecificSubscriptionView.as_view(), name='update_delete_subscription'),

    path('notification/', NotificationView.as_view(), name='notification'),

    path('dashboard/', DashboardView.as_view(), name='subscription-sum-by-year'),
    # path('xx/', xx.as_view(), name='aaze'),

]
