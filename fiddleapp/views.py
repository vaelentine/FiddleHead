from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from .models import Song

# Create your views here.
def index(request):
    #render static until login/load
    return render(request, 'fiddleapp/index.html', {})


def api(request):
    if request.method == 'GET':
        return JsonResponse({'message': 'it worked!'})


def loadSongs(request):
    song_list = [];
    songs = Song.objects.all()
    for song in songs:
        song_list.append(song.toDict())
    if request.method == 'GET':
        return JsonResponse({'songs': songs_list})
