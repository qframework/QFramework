#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include "../Srvk/Srvk/serverapi/serverko.h"
#include <boost/asio.hpp>
#include <boost/date_time/posix_time/posix_time.hpp>
#include <boost/thread.hpp>


void sysoutput(char* str)
{
  printf("sysout-> %s\n",str);
  
}

void output(char* str)
{
  printf("  out-> %s\n",str);
  //printf("c:");

}

int main()
{
        char str[256];
	puts(" starting server ");
	server_start( output, sysoutput, 51000);
	do
	{
	  boost::this_thread::sleep( boost::posix_time::millisec((long)100));
	}while(1);
      
	return 0;
}

