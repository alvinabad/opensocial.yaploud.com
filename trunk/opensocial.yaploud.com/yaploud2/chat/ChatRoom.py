from models import ChatRoom as ChatRoom_DB
from datetime import datetime
import time
import settings

class ChatRoom(object):
    def __init__(self):
        pass
        
    def update(self, msg):
        try:
            # insert new room-user record
            cr = ChatRoom_DB()
            cr.roomname = msg['roomname']
            cr.username = msg['postedby']
            cr.datelastposted = msg['dateposted']
            cr.save()
        except Exception, e:
            #print "Error creating new chatroom-user record", e
            # if record exists, update time instead
            try:
                cr = ChatRoom_DB.objects.get(roomname=msg['roomname'], username=msg['postedby'])
                cr.datelastposted = msg['dateposted']
                cr.save()
            except Exception, e:
                print "Error updating chat room", e
                raise
            
            
        return True

    def getUsers(self, roomname):
        users = []
    
        try:
            rows = ChatRoom_DB.objects.filter(roomname=roomname).order_by('datelastposted')
            for u in rows:
                user = {}
                user['name'] = u.username
                
                t0 = time.mktime(u.datelastposted.timetuple())
                t1 = time.mktime(datetime.utcnow().timetuple())
                time_diff = t1 - t0
                if time_diff < settings.USER_IDLE_TIMOUT:
                    users.append(user)
                    
            users.sort()
        except Exception, e:
            print "Error getting users: ", e

        return users
