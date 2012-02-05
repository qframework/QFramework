import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.Socket;
import java.net.SocketException;


public class ServerkoListener implements Runnable {

	protected Socket mSocket;
	protected BufferedReader mIn;
	public boolean	mDisplayText = false;
	void init(Socket socket)
	{
		mSocket = socket;
		try {
			mSocket.setSoTimeout(0);
		} catch (SocketException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
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
			while ((userInput = mIn.readLine()) != null) {
				if (mDisplayText)
				{
					//System.out.println(userInput);
			    //	System.out.println("echo: " + mIn.readLine());
					ServerkoTester.textField.append(userInput);
					ServerkoTester.textField.append("\n\r");
				}else
				{
					ServerkoTester.addData(userInput.length());
				}
				//System.out.println(this.toString() + userInput );
			    //ServerkoTester.scrollPane.
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			Thread.sleep(50);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println("out thread ");
	}

}
