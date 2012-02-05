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
import java.io.PrintWriter;
import java.net.Socket;



public class ServerkoSender {
	protected Socket mSocket = null;
	protected PrintWriter mOut = null;
	protected String mRootId;
	protected String mRoomId;
	protected String mUserId;
	private String mIdentifier = "Host: www.100kas.com\r\n";
	//private String mIdentifier = "Host: qframework\r\n";
	ServerkoConnect mParent;
	public void init(Socket socket, String rootid, ServerkoConnect serverkoConnect)
	{
		mParent = serverkoConnect;
		mSocket = socket;
		mRootId = rootid;
		try {
			mOut = new PrintWriter(socket.getOutputStream(), true);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void write(String message)
	{
		if (mOut != null)
		{
			mOut.println(message);
		}
	}
	
    public void queryServer2() {
		if (mOut != null)
		{    	
	        //System.out.println(" getServers() >>>> \n");
			String path = "/" + mRootId;
			String data = "GET " + path + "/" +  " HTTP/1.1\r\n";
			//String data = "GET " + "/" +  " HTTP/1.1\r\n";
			data += mIdentifier;
			data += "User-Agent: jogampapp\r\n";
			data += "\r\n";
			//System.out.println( " GET = >>>" + data +  "<<<");
			mOut.print(data);
			mOut.flush();
		}
    }

	public void queryRoom(String room, String user) {
		if (mOut != null)
		{    
			mRoomId = room;
			mUserId = user;
	        //System.out.println(" getServers() >>>> \n");
			String path = "/" + mRootId + "/" + mRoomId + "/" + user;
			String data = "GET " + path +  " HTTP/1.1\r\n";
			data += mIdentifier;
			data += "User-Agent: jogampapp\r\n";
			data += "\r\n";
			//System.out.println( " GET = >>>" + data +  "<<<");
			mOut.print(data);
			mOut.flush();
		}

		
	}

	public void joinRoom(String room, String user) {
		if (mOut != null)
		{    
			mRoomId = room;
			mUserId = user;
	        //System.out.println(" getServers() >>>> \n");
			String path = "/" + mRootId + "/" + mRoomId + "/" + user;
			String data = "POST " + path +  " HTTP/1.1\r\n";
			data += mIdentifier;
			data += "User-Agent: jogampapp\r\n";
			data += "\r\n";
			//System.out.println( " POST = >>>" + data +  "<<<");
			mOut.print(data);
			mOut.flush();
		}

		
	}

	public void leaveRoom(String room, String user )
	{
		if (mOut != null)
		{
			mRoomId = room;
			mUserId = user;
	        //System.out.println(" getServers() >>>> \n");
			String path = "/" + mRootId + "/" + mRoomId + "/" + user;
			String data = "DELETE " + path +  " HTTP/1.1\r\n";
			data += mIdentifier;
			data += "User-Agent: jogampapp\r\n";
			data += "\r\n";
			//System.out.println( " DELETE  = >>>" + data +  "<<<");
			mOut.print(data);
			mOut.flush();
			
		}
	
	}
	
	public void sendData(String room, String user, String text )
	{
		if (mOut != null)
		{
			mRoomId = room;
			mUserId = user;
	        //System.out.println(" getServers() >>>> \n");
			String path = "/" + mRootId + "/" + mRoomId + "/" + user;
			String data = "PUT " + path +  " HTTP/1.1\r\n";
			data += mIdentifier;
			data += "User-Agent: jogampapp\r\n";
			data += "Data: " + text + "\r\n";
			data += "\r\n";
			//System.out.println( " PUT  = >>>" + data +  "<<<");
			mOut.print(data);
			mOut.flush();
			
		}
	}

	
	
}
