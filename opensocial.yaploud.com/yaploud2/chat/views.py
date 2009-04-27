from django.http import HttpResponse
from django.http import HttpRequest
from django.http import HttpResponseServerError
from django.http import HttpResponseForbidden
from django.template import Context, loader
from django.shortcuts import render_to_response
from django.utils import simplejson

from datetime import datetime
import os

from models import ChatRoom
from ChatMessages import ChatMessages
from ChatRoom import ChatRoom

import settings
import inspect

def index(request):
    try:
        roomname = request.REQUEST['cr']
    except:
        return HttpResponseForbidden("Unauthorized access!")
    
    try:
        viewer = request.REQUEST['viewer']
    except:
        viewer = "null"    # This is for JavaScript
    
    try:
        popout = request.REQUEST['popout']
        popout = "true"    # this is for JavaScript variable
    except:
        popout = "false"   # this is for JavaScript variable
        
        
    request.session['username'] = viewer
    info = {}
    info['title'] = "Yaploud Chat Room - " + roomname
    info['viewer'] = viewer
    info['roomname'] = roomname
    info['popout'] = popout
    
    # type of network, set to ning for now
    info['network'] = "ning";

    template = os.path.join(settings.HOME, 'chat', 'chat_t.html')
    t = loader.get_template(template)
    c = Context({"info": info})
    return HttpResponse(t.render(c))


def sendMessage(request):
    sent_message = {}
    
    # Get request parameters
    try:
        sent_message['roomname'] = request.REQUEST['roomname']
        sent_message['postedby'] = request.REQUEST['postedby']
        sent_message['message'] = request.REQUEST['message']
        sent_message['dateposted'] = datetime.utcnow()
    except:
        return HttpResponseForbidden("Unauthorized access!")
    
    try:
        start_id = request.REQUEST['start_id']
    except:
        start_id = None
 
    cm = ChatMessages()       
    cr = ChatRoom()
    users = []
    messages = []
    
    try:
        cm.saveMessage(sent_message)
        cr.update(sent_message)
        users = cr.getUsers(sent_message['roomname'])
        messages = cm.getMessages(roomname=sent_message['roomname'],
                                  start_id=start_id)
    except:
        return HttpResponseServerError("Server Error!")
        
    
    # convert date to string isoformat for return
    sent_message['dateposted'] = sent_message['dateposted'].isoformat(' ')
    
    info = {}
    info['msg_sent'] = sent_message
    info['users'] = users
    info['messages'] = messages
    
    json_data = simplejson.dumps(info)
    response = HttpResponse(json_data)
    response['Cache-Control'] = 'no-store, no-cache, private, must-revalidate'
    
    return response


def getMessages(request, message_id=None):
    try:
        roomname = request.REQUEST['roomname']
    except:
        return HttpResponseForbidden("Unauthorized access!")
    
    try:
        start_id = request.REQUEST['start_id']
    except:
        start_id = None
    
    
    info = {}
    cm = ChatMessages()
    cr = ChatRoom()
    
    try:
        info['messages'] = cm.getMessages(roomname=roomname, start_id=start_id)
        info['users'] = cr.getUsers(roomname)
    except:
        return HttpResponseServerError("Server Error!")
    
    json_data = simplejson.dumps(info)
    response = HttpResponse(json_data)
    response['Cache-Control'] = 'no-store, no-cache, private, must-revalidate'
    return response
