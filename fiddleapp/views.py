from django.shortcuts import render, HttpResponse
# Create your views here.
def index(request):
    #render static until login/load
    return render(request, 'fiddleapp/index.html', {})
