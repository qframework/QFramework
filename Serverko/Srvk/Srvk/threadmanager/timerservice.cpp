/*
   Copyright 2012, Telum Slavonski Brod, Croatia.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   
   This file is part of QFramework project, and can be used only as part of project.
   Should be used for peace, not war :)   
*/

#include "timerservice.h"
#include "threadmanager.h"
#include "../scriptmanager/scriptrequest.h"

namespace qserver
{

TimerService::TimerService()
    : count_(0), scriptcoresched(0)
  {
    
  }

TimerService::~TimerService()
{
  timer1_->cancel();
  delete timer1_;
}

void TimerService::run()
{
  timer1_ = new boost::asio::deadline_timer(io, boost::posix_time::milliseconds(TIMER_TICK) );
  timer1_->async_wait(boost::bind(&TimerService::timertick, this));
  io.run();
}

void TimerService::timertick()
{
  timer1_->expires_at(timer1_->expires_at() + boost::posix_time::milliseconds(TIMER_TICK));

  // broadcast timer to script core
  scriptcoresched += TIMER_TICK;
  if (scriptcoresched > 1000)
  {
    threadManager.putScriptRequest(ScriptRequest::TIMEREVENT, NULL, 0 , scriptcoresched);
    scriptcoresched = 0;
  }

  // broadcast timer to sessions 
  threadManager.putSessionRequest(-1, ScriptRequest::TIMEREVENT, NULL, 0 , TIMER_TICK);

  //HttpServer::handleTimer(TIMER_TICK);

  timer1_->async_wait(boost::bind(&TimerService::timertick, this));
  count_++;
}

void TimerService::stop()
{
    timer1_->cancel();
    delete timer1_;
    io.stop();
}

} //namespace qserver

