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

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.Socket;


public class ServerkoListener implements Runnable {

	protected Socket mSocket;
	protected BufferedReader mIn;
	public boolean	mDisplayText = false;
	ServerkoConnect mParent;
	String mCache = new String();
	boolean mEnabled = true;
	
	public void stop()
	{
		mEnabled = false;
	}
	void init(Socket socket, ServerkoConnect serverkoConnect)
	{
		mParent = serverkoConnect;
		mSocket = socket;
		mEnabled = true;
		try {
			mIn = new BufferedReader(new InputStreamReader(socket.getInputStream()));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@Override
	public void run() {

		String userInput;
		System.out.println("in thread ");
		try {
			while ((userInput = mIn.readLine()) != null && mEnabled) {

				//System.out.println(userInput + "\n");
				mCache += userInput +  "\r\n";
				if (userInput.length() == 0 || mCache.endsWith("\r\n\r\n"))
				{
					/*
					System.out.println("-------------------\n");
					System.out.println(mCache + "\n");
					System.out.println("-------------------\n");
					*/
					mParent.doSocketData( mCache);
					mCache = new String();
				}
				//ServerkoTester.addData(userInput.length());
			    //ServerkoTester.scrollPane.
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

		System.out.println("out thread ");
	}

}
