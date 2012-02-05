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

package com.qframework.Serverko;

import java.io.IOException;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.NoSuchElementException;
import java.util.StringTokenizer;

import com.qframework.core.ServerkoParse;

public class ServerkoConnect {

   Socket socket = null;

   static String mUser = "Dembbb";
   static String mRoom = "2";
   
   ServerkoSender mSender = new ServerkoSender();
   ServerkoListener mListener = new ServerkoListener();
   
   Thread mListenerT = null;
   String 	mServerAddr = "127.0.0.1";
   int 	mServerPort = 51001;
   
   String mConnectScript;
   String mJoinScript;
   ServerkoParse mParser;
   boolean mWaitingForContent = false;
   boolean mWaitingForJoin = false;
   
	public void connect(String serverip, String script, ServerkoParse parser) {
		// TODO Auto-generated method stub
		
		mConnectScript = script;
		mParser = parser;
		close();
		
	     try{
	    	 StringTokenizer tok;
	    	 try
	    	 {
	    		 tok = new StringTokenizer(serverip, ":");
	    		 mServerAddr = tok.nextToken();
	    		 mServerPort = Integer.parseInt( tok.nextToken() );
	         }
	         catch(NoSuchElementException e)
	         {
	        	 sendConnect(0);
	             return;
	         }	    		 
	    	 
	         socket = new Socket(mServerAddr, mServerPort);
	         mSender.init(socket, "10000", this);
	         
	         mListener.init(socket, this);
	         mListenerT = new Thread(mListener);
	         mListenerT.start();
	         sendConnect(1);
	       } catch (UnknownHostException e) {
	         sendConnect(0);
	       } catch  (IOException e) {
	         System.out.println("No I/O");
	         sendConnect(0);
	       }		
	}

	public void join(String room, String user, String script) {
		// 
		mRoom = room;
		mUser = user;
		//mUser = "DembLee3";
		mJoinScript = script;
		mWaitingForJoin = true;
		mSender.joinRoom(mRoom, mUser);
	}

	public void send(String data) {
		// 
		System.out.println( "sending ->>>>>>>>>>" + data);
		mSender.sendData(this.mRoom, this.mUser, data);
	}

	public void close()
	{
		if (mListenerT != null)
		{
			mListener.stop();			
			try {
				socket.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			/*
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			*/

			//mListenerT.interrupt();
		}
	}
	
	public void sendConnect(int data)
	{
		String userdata;
		userdata = mConnectScript + "(" + data + ",'" + mServerAddr  + ":" + mServerPort + "');";
		mParser.execScript(userdata);
	}
	
	public void sendJoin(int data)
	{
		String userdata;
		userdata = mJoinScript + "(" + data + ",'" + mServerAddr  + ":" + mServerPort + "');";
		mParser.execScript(userdata);
	}
	
	public void doSocketData(String data)
	{
	    if (mWaitingForContent)
	    {
	    	//System.out.println("JSON " + data);
	        mParser.onJSONData(data);
	        mWaitingForContent = false;
	    }
	    else {
	        //analyze
	    	StringTokenizer tok;
	    	tok = new StringTokenizer(data, "\r\n");
	    	//System.out.println("\n");
	    	while (tok.hasMoreTokens())
	    	{
	    		String header = tok.nextToken();
	    		//System.out.println("Header " + header);
	    		if (header.startsWith("HTTP/1.0 300"))
	    		{
	    			// multiple_choices 
	    			// user already exists
	    			sendJoin(-1);
	    			return;
	    		}
	    		else if (header.startsWith("HTTP/1.0 202"))
	    		{
	    			if (mWaitingForJoin)
	    			{
	    				mWaitingForJoin = false;
	    				sendJoin(1);
	    			}
	    		}
	    		else
	    		if (header.startsWith("Content-length"))
	    		{
	    			//System.out.println("CONTENT " + header);
	    			mWaitingForContent = true;
	                return;	    			
	    		}
	    		
	    		
	    	}

	    }


	}
	
}
