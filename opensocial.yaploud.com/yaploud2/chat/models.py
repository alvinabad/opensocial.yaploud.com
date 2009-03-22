from django.db import models

class ChatMessages(models.Model):
    id = models.IntegerField(primary_key=True)
    roomname = models.CharField(max_length=3072)
    postedby = models.CharField(max_length=192)
    dateposted = models.DateTimeField()
    message = models.CharField(max_length=3072)
    class Meta:
        db_table = u'CHAT_MESSAGES'

class ChatRoom(models.Model):
    id = models.IntegerField(primary_key=True)
    roomname = models.CharField(unique=True, max_length=2808)
    username = models.CharField(unique=True, max_length=192)
    datelastposted = models.DateTimeField()
    owner = models.CharField(max_length=192, blank=True)
    class Meta:
        db_table = u'CHAT_ROOM'
