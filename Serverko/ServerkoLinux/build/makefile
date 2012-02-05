SHELL = /bin/sh

srcdir = .

CC = gcc
LIBDIR = -L /usr/lib
LIBV8 = -L ../../Srvk/v8
LIBS = -lboost_date_time -lboost_thread -lboost_regex -lboost_system -lboost_python -lpthread -lv8 -lpython2.7
CDEBUG = -g
CFLAGS = $(CDEBUG) -c
LDFLAGS = -g

# dirs
SYSINC = /usr/include
PYINC = /usr/include/python2.7
ZINC = ../
V8INC = ../../v8/include
HTTPDIR = ../../Srvk/Srvk/httpserv/
SCRMDIR = ../../Srvk/Srvk/scriptmanager/
SERADIR = ../../Srvk/Srvk/serverapi/
SERMDIR = ../../Srvk/Srvk/servermanager/
THRMDIR = ../../Srvk/Srvk/threadmanager/
TOOLSDIR = ../../Srvk/Srvk/tools/
OBJDIR = objs/

#sources
SRCMAIN = ../serverkoapp.cpp

SRCHTTP = $(HTTPDIR)dataselector.cpp $(HTTPDIR)httpconnection.cpp \
          $(HTTPDIR)httpreply.cpp $(HTTPDIR)httprequesthandler.cpp \
          $(HTTPDIR)httprequestparser.cpp \
          $(HTTPDIR)httpserver.cpp $(HTTPDIR)httpuser.cpp \
          $(HTTPDIR)localdataselector.cpp 

SRCSCRM = $(SCRMDIR)jsscript.cpp $(SCRMDIR)pyscript.cpp \
          $(SCRMDIR)script.cpp $(SCRMDIR)scriptclient.cpp \
          $(SCRMDIR)scriptclients.cpp $(SCRMDIR)scripteventbase.cpp \
          $(SCRMDIR)scriptevents.cpp $(SCRMDIR)scriptlanguage.cpp \
          $(SCRMDIR)scriptmanager.cpp $(SCRMDIR)scriptrequest.cpp \
          $(SCRMDIR)scriptscore.cpp $(SCRMDIR)scriptsession.cpp \
          $(SCRMDIR)scriptsessionevent.cpp $(SCRMDIR)scriptsplayer.cpp

SRCSERA = $(SERADIR)serverko.cpp

SRCSERM = $(SERMDIR)serverclient.cpp $(SERMDIR)servermanager.cpp

SRCTHRM = $(THRMDIR)threadmanager.cpp $(THRMDIR)timerservice.cpp

SRCTOOLS = $(TOOLSDIR)io_service_pool.cpp 
		  
	
#objects
OBJMAIN = serverkoapp.o

OBJHTTP = dataselector.o httpconnection.o \
          httpreply.o httprequesthandler.o \
          httprequestparser.o \
          httpserver.o httpuser.o \
          localdataselector.o

OBJSCRM = jsscript.o pyscript.o \
          script.o scriptclient.o \
          scriptclients.o scripteventbase.o \
          scriptevents.o scriptlanguage.o\
          scriptmanager.o scriptrequest.o \
          scriptscore.o scriptsession.o \
          scriptsessionevent.o scriptsplayer.o

OBJSERA = serverko.o
		  
OBJSERM = serverclient.o servermanager.o
		  
OBJTHRM = threadmanager.o timerservice.o

OBJTOOLS= io_service_pool.o 

		  
OBJS = $(OBJMAIN) $(OBJHTTP) $(OBJSCRM) $(OBJSERA) $(OBJSERM) $(OBJTHRM) $(OBJTOOLS)
          
libhttp: $(LIBHTTP)
	$(CC) $(CFLAGS) -I$(ZINC) -I$(SYSINC) $(SRCHTTP)
	
libscrm: $(LIBSRCM)
	$(CC) $(CFLAGS) -I$(ZINC) -I$(SYSINC) -I$(PYINC) $(SRCSCRM)
	
libsera: $(LIBSERA)
	$(CC) $(CFLAGS) -I$(ZINC) -I$(SYSINC) $(SRCSERA)	

libserm: $(LIBSERM)
	$(CC) $(CFLAGS) -I$(ZINC) -I$(SYSINC) $(SRCSERM)
	
libthrm: $(LIBTHRM)
	$(CC) $(CFLAGS) -I$(ZINC) -I$(SYSINC) $(SRCTHRM)

libtools: $(LIBTOOLS)
	$(CC) $(CFLAGS) -I$(ZINC) -I$(SYSINC) $(SRCTOOLS)
	
main: 	$(MAIN)
	$(CC) $(CFLAGS) -I$(ZINC) -I$(SYSINC) $(SRCMAIN) 

exec: 	$(OBJS)
	$(CC) -g -o ../serverkoapp $(LIBDIR) $(LIBV8) $(OBJS) $(LIBS)
                
all: libtools libthrm libsera libserm libhttp libscrm main exec

clean:
	rm -f *.o ../serverkoapp
    