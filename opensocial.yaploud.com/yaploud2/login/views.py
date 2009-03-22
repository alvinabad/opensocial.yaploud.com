from django.http import HttpResponse
from django.template import Context, loader
from django.shortcuts import render_to_response
from django.utils import simplejson
import settings

def index(request):
    #return HttpResponse("Hello, world. You're at the poll index.")

    info = {}
    info['title'] = 'Hello, world!'
    info['body'] = settings.CSS_PATH
    info['body'] = settings.DATABASE_ENGINE

    t = loader.get_template('login/template/login.html')
    d = {}
    d['info'] = info
    d['data'] = info
    c = Context(d)

    return HttpResponse(t.render(c))
    #return render_to_response('login/template/login.html', {'info': info})


def send(request):
    data = {}
    data['first'] = 'alvin'
    data['last'] = 'abad'

    from django.db import connection
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM auth_user")
    #row = cursor.fetchone()
    #print row
    print cursor.rowcount

    json = simplejson.dumps(data)
    json = 'callback(' + json + ');'
    response = HttpResponse(json)
    response['Cache-Control'] = 'no-store, no-cache, private, must-revalidate'
    return response



