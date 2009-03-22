drop table if exists CHAT_ROOM;

CREATE TABLE CHAT_ROOM(
   id         INT NOT NULL AUTO_INCREMENT,
   PRIMARY KEY (id),
   roomname   VARCHAR(936) NOT NULL,
   username   VARCHAR(64) NOT NULL,
   datelastposted datetime NOT NULL,
   owner      VARCHAR(64) NULL
) ENGINE=MyISAM;

ALTER TABLE CHAT_ROOM ADD UNIQUE (roomname,username); 
#create index roomname_idx on CHAT_ROOM (roomname);


