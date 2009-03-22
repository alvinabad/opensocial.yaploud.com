drop table if exists CHAT_MESSAGES;

CREATE TABLE CHAT_MESSAGES (
   id         INT NOT NULL AUTO_INCREMENT,
   roomname   VARCHAR(1024) NOT NULL,
   postedby   VARCHAR(64) NOT NULL,
   dateposted datetime NOT NULL,
   message    VARCHAR(1024) NOT NULL,
   PRIMARY KEY (id)
) ENGINE=MyISAM;

create index roomname_idx on CHAT_MESSAGES (roomname);
#create index postedby_idx on CHAT_MESSAGES (postedby);
#create index message_idx on CHAT_MESSAGES (message);
#create index dateposted_idx on CHAT_MESSAGES (dateposted);

