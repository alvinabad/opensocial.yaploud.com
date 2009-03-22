# Create your views here.
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import Context, loader

def index(request):
    #return HttpResponse("WELCOME! You've reached the home page!")
    return HttpResponseRedirect("http://www.yaploud.com")

