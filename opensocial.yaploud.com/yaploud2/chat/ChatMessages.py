from models import ChatMessages as ChatMessages_DB
import settings

class ChatMessages(object):
    def __init__(self):
        pass
        
    def saveMessage(self, msg):
        # Save to database
        try:
            cm = ChatMessages_DB()
            cm.roomname = msg['roomname']
            cm.postedby = msg['postedby']
            cm.dateposted = msg['dateposted']
            cm.message = msg['message']
            cm.save()
        except Exception, e:
            print "Error creating new message: ", e
            raise
        
    def getMessages(self, roomname=None, start_id=None, limit=None):
        messages = []
    
        if start_id is None:
            start_id = 0
        
        if limit is None:    
            limit = settings.MESSAGE_LIMIT
        
        try:
            rows = ChatMessages_DB.objects.filter(roomname=roomname,
                             id__gt=start_id).order_by('-dateposted')[:limit]
            for chat in rows:
                m = {}
                m['id'] = str(chat.id)
                m['roomname'] = chat.roomname
                m['postedby'] = chat.postedby
                m['message'] = chat.message
                m['dateposted'] = chat.dateposted.isoformat(' ')
                messages.append(m)
        except Exception, e:
            print "Error getting messages: ", e
            raise
    
        messages.reverse()
        return messages
        
        