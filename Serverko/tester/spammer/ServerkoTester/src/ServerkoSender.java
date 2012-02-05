import java.io.IOException;
import java.io.PrintWriter;
import java.net.Socket;


public class ServerkoSender {
	protected Socket mSocket = null;
	protected PrintWriter mOut = null;
	protected String mRootId;
	protected String mRoomId;
	protected String mUserId;
	
	public void init(Socket socket, String rootid)
	{
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
			String path = "/" + mRootId;
			String data = "GET " + path + "/" +  " HTTP/1.1\r\n";
			//String data = "GET " + "/" +  " HTTP/1.1\r\n";
			data += "Host: www.100kas.com\r\n";
			data += "User-Agent: tester\r\n";
			data += "\r\n";
			System.out.println( " GET = >>>" + data +  "<<<");
			mOut.print(data);
			mOut.flush();
		}
    }

	public void queryRoom(String room, String user) {
		if (mOut != null)
		{    
			mRoomId = room;
			mUserId = user;
			String path = "/" + mRootId + "/" + mRoomId + "/" + user;
			String data = "GET " + path +  " HTTP/1.1\r\n";
			data += "Host: www.100kas.com\r\n";
			data += "User-Agent: tester\r\n";
			data += "\r\n";
			System.out.println( " GET = >>>" + data +  "<<<");
			mOut.print(data);
			mOut.flush();
		}

		
	}

	public void joinRoom(String room, String user) {
		if (mOut != null)
		{    
			mRoomId = room;
			mUserId = user;
			String path = "/" + mRootId + "/" + mRoomId + "/" + user;
			String data = "POST " + path +  " HTTP/1.1\r\n";
			data += "Host: www.100kas.com\r\n";
			data += "User-Agent: tester\r\n";
			data += "\r\n";
			System.out.println( " POST = >>>" + data +  "<<<");
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
			String path = "/" + mRootId + "/" + mRoomId + "/" + user;
			String data = "DELETE " + path +  " HTTP/1.1\r\n";
			data += "Host: www.100kas.com\r\n";
			data += "User-Agent: tester\r\n";
			data += "\r\n";
			System.out.println( " DELETE  = >>>" + data +  "<<<");
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
			String path = "/" + mRootId + "/" + mRoomId + "/" + user;
			String data = "PUT " + path +  " HTTP/1.1\r\n";
			data += "Host: www.100kas.com\r\n";
			data += "User-Agent: tester\r\n";
			data += "Data: " + text + "\r\n";
			data += "\r\n";
			System.out.println( " PUT  = >>>" + data +  "<<<");
			mOut.print(data);
			mOut.flush();
			
		}
	}
	
	public void sendGarbage(String room, String user, String text )
	{
		if (mOut != null)
		{
			mRoomId = room;
			mUserId = user;
			String path = "/" + mRootId + "/" + mRoomId + "/" + user;
			String data = "PUTsdf asdfasdf asdf " + path +  " HTTP/1.1\r\n";
			data += "asfasdfasdf asdfasdfasdf asHost: 127.0.0.1:81\r\n";
			data += "asdfasdfasdDf asadf asdfasdf asdfasdfta: " + text + "\r\n";
			data += "asdf asdf asdf asdfasdf asdf as\r\n";
			System.out.println( " PUT  = >>>" + data +  "<<<");
			mOut.print(data);
			mOut.flush();
			
		}
	}
	
	
}
