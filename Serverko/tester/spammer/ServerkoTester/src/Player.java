import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.Random;
import java.util.Timer;
import java.util.Vector;


public class Player {
	   ServerkoSender mSender = new ServerkoSender();
	   ServerkoListener mListener = new ServerkoListener();
	   
	   Thread mListenerT = null;
	   Vector <String> mDatas = new Vector<String>();
	   int mCurrData = 0;
	   String 	mServerAddr;
	   int 	mServerPort;
	   boolean mConnected = false;
	    public String mRoom;
		public String mUser;
		Socket socket = null;
		Random generator = new Random();
		int mCounter = 0;
		public void listenSocket(){
		//Create socket connection
		     try{
		       socket = new Socket(mServerAddr, mServerPort);
		    	// socket = new Socket("127.0.0.1", 81);
		       mSender.init(socket, "10000");
		       mListener.init(socket);
		       mListenerT = new Thread(mListener);
		       mListenerT.start();
		       
		     } catch (UnknownHostException e) {
		       System.out.println("Unknown host: kq6py.eng");
		       
		     } catch  (IOException e) {
		       System.out.println("No I/O");
		     }
		  }		

		public void join()
		{
			mSender.joinRoom(mRoom, mUser );
			ServerkoTester.textField.append("Adding " + mUser + " to "  + mRoom);
			ServerkoTester.textField.append("\n\r");
			
			if (mDatas.size() == 0)
			{
				mDatas.add("playas0");
				mDatas.add("playas1");
				mDatas.add("playas2");
				mDatas.add("playas3");
				mDatas.add("mainc,selmain,0");
				mDatas.add("mainc,selmain,1");
				
				mDatas.add("played,0,1");
				mDatas.add("played,1,1");
				mDatas.add("played,2,1");
				mDatas.add("played,3,1");
				mDatas.add("played,4,1");
				
				mDatas.add("played,5,1");
				mDatas.add("played,6,1");
				mDatas.add("played,7,1");
						
			}
			mConnected = true;
		}
		public void close()
		{
			try {
				if (socket != null)
				{
					socket.close();
					mConnected = false;
					mListenerT.interrupt();
				}
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		public void sendData(String data)
		{
			mSender.sendData(this.mRoom, mUser, data);
		}
		
		public void sendGarbage()
		{
			mSender.sendGarbage(this.mRoom, mUser, "thiz iz garbage");
		}
		
		public void play()
		{
			if (mConnected == true)
			{
				int val =generator.nextInt( 1400 );
				if (val == 0)
				{
					mCounter =  10;
					close();
					mConnected = false;
					ServerkoTester.textField.append("DISCONNECTING " + mUser );
					ServerkoTester.textField.append("\n\r");					
				}
			}else
			{
				mCounter --;
				if (mCounter < 0)
				{
					listenSocket();
					join();
					return;
				}
			}
			mCurrData++;
			if (mCurrData >= mDatas.size())
			{
				mCurrData = 0;
			}
			sendData( mDatas.elementAt(mCurrData));
			//ServerkoTester.textField.append("Playing " + mUser + " "  + mDatas.elementAt(mCurrData));
			//ServerkoTester.textField.append("\n\r");
			
		}

}
