package com.qframework.serverko;

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
	
	public void run() {

		String userInput;
		System.out.println("in thread ");
		try {
			while ((userInput = mIn.readLine()) != null && mEnabled) {

				mCache += userInput +  "\r\n";
				if (userInput.length() == 0)
				{
					System.out.println("-------------------\n");
					System.out.println(mCache + "\n");
					System.out.println("-------------------\n");
					mParent.doSocketData( mCache);
					mCache = new String();
				}
				//ServerkoTester.addData(userInput.length());
			    //ServerkoTester.scrollPane.
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		/*
		try {
			Thread.sleep(50);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}*/
		System.out.println("out thread ");
	}

}
