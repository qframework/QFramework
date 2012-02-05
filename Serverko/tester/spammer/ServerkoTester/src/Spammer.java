import java.io.IOException;
import java.net.Socket;
import java.net.UnknownHostException;


public class Spammer {
	   
	   ServerkoSender mSender = new ServerkoSender();
	   ServerkoListener mListener = new ServerkoListener();
	   
	   Thread mListenerT = null;
	   
	   String 	mServerAddr;
	   int 	mServerPort;
	    public String mRoom;
		public String mUser;
		Socket socket = null;
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
		}
		public void close()
		{
			try {
				if (socket != null)
				{
					socket.close();
					mListenerT.interrupt();
				}
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		public void sendData()
		{
			mSender.sendData(this.mRoom, mUser, "thiz iz text");
		}
		public void sendGarbage()
		{
			mSender.sendGarbage(this.mRoom, mUser, "thiz iz garbage");
		}		
}
