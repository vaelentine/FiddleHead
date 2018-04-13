from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from .models import Song
from .serializers import SongSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
def index(request):
    #render static until login/load
    return render(request, 'fiddleapp/index.html', {})


def api(request):
    if request.method == 'GET':
        return JsonResponse({'message': 'it worked!'})

class SongList(APIView):

    def get(self, request, format=None):
        songs = Song.objects.all()
        serializer = SongSerializer(many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = SongSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
