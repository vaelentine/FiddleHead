from django.urls import path
from . import views

from django.conf import settings
from django.conf.urls.static import static

app_name = 'fiddleapp'

urlpatterns = [
    path('', views.index, name='index'),
    path('api/', views.api, name='api'),
    path('api/song_list/', views.SongList.as_view()),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
