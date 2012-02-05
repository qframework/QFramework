
import java.awt.Color;
import java.awt.BorderLayout;
import java.awt.Container;
import java.awt.FlowLayout;
import java.awt.ScrollPane;
import java.awt.event.*;
import javax.swing.*;

import java.io.*;
import java.net.*;
import java.util.Random;
import java.util.Vector;

class ServerkoTester extends JFrame
		 implements ActionListener {

   JLabel text, clicked;
   JButton button;
   JButton button1;
   JButton button2;
   JButton button3;
   JButton button4;
   JButton button5;
   JButton button6;
   JButton button7;
   JPanel panel;
   JPanel buttons; 
   static public JScrollPane scrollPane;
   static public JTextArea textField;
   Socket socket = null;

   static String mUser = "Dembbb";
   static String mRoom = "2";
   
   ServerkoSender mSender = new ServerkoSender();
   ServerkoListener mListener = new ServerkoListener();
   
   Thread mListenerT = null;
   
   Vector <Spammer> mSpammers = new Vector<Spammer>();
   Vector <Player> mPlayers = new Vector<Player>();
   
   //String 	mServerAddr = "78.47.124.235";
   //String 	mServerAddr = "127.0.0.1";
   String 	mServerAddr = "78.47.124.235";
   //int 	mServerPort = 8085;
   int 	mServerPort = 8088;
   static int mDataTotal = 0;
   static int mDataCnt = 10000;
   Random generator;
   
   int	mCounter = 0;
   int mRoomSize = 12;//28;
   int mUsersNum = 4;//8;
   int mPlayersNum = 3;
   static long mStartTime = 0;
   static long mCurrTime = 0;

   
   ServerkoTester(){ //Begin Constructor
     text = new JLabel("Text to send over socket:");
     textField = new JTextArea(30,100);
      scrollPane = new JScrollPane(textField);
     textField.setAutoscrolls(true);
     button = new JButton("Query rooms");
     button.addActionListener(this);

     button1 = new JButton("Join room");
     button1.addActionListener(this);
     
     button2 = new JButton("Query room");
     button2.addActionListener(this);

     button3 = new JButton("Leave room");
     button3.addActionListener(this);
     
     button4 = new JButton("Send text");
     button4.addActionListener(this);
     
     button5 = new JButton("Spam clients");
     button5.addActionListener(this);
     
     button6 = new JButton("Randomize clients");
     button6.addActionListener(this);
     
     button7 = new JButton("Play with clients");
     button7.addActionListener(this);
     
     //panel = new JPanel();
     Container panel = getContentPane();

     SpringLayout l = new SpringLayout();
     panel.setLayout(l);
//     panel.setComponentOrientation(ComponentOrientation.)
     
     panel.setBackground(Color.white);
     panel.add( text);
     panel.add( scrollPane);
     panel.add( button);
     panel.add( button1);
     panel.add( button2);
     panel.add( button3);
     panel.add( button4);
     panel.add( button5);
     panel.add( button6);
     panel.add( button7);
     SpringUtilities.makeCompactGrid(panel,panel.getComponentCount(),1,1,1,1,1);
     
     generator = new Random();
   } //End Constructor

  public void actionPerformed(ActionEvent event){
     Object source = event.getSource();

     if(source == button){
    	 mSender.queryServer2();
     } else
     if(source == button1){
    	 mSender.joinRoom(mRoom, mUser );
     } else
     if(source == button2){
    	 mSender.queryRoom(mRoom, mUser );
     } else
     if(source == button3){
    	 mSender.leaveRoom(mRoom, mUser );
     } else
     if(source == button4){
    	 mSender.sendData(mRoom, mUser , "datatataaa");
     } else
     if(source == button5){
    	 startSpamClient();
     }   else
     if(source == button6){
    	 startRandomizeClient();
     }     else
     if(source == button7){
    	 startPlayWithClient();
     }   	 
  }
  
  public void listenSocket(){
//Create socket connection
     try{
       socket = new Socket(mServerAddr, mServerPort);
    	// socket = new Socket("127.0.0.1", 81);
       mSender.init(socket, "10000");
       
       mListener.init(socket);
       mListenerT = new Thread(mListener);
       mListener.mDisplayText = true;
       mListenerT.start();
       
     } catch (UnknownHostException e) {
       System.out.println("Unknown host: kq6py.eng");
       System.exit(1);
     } catch  (IOException e) {
       System.out.println("No I/O");
       System.exit(1);
     }
  }

   public static void main(String[] args){
	   ServerkoTester frame = new ServerkoTester();
	frame.setTitle("Client Program");
        WindowListener l = new WindowAdapter() {
                public void windowClosing(WindowEvent e) {
                        System.exit(0);
                }
        };

        frame.addWindowListener(l);
        frame.pack();
        frame.setVisible(true);
	frame.listenSocket();
  }
  
   void startSpamClient()
   {
	   for (int a=0; a< mUsersNum; a++)
	   {
		   for (int b=0; b< mRoomSize; b++)
		   {
			   Spammer spammer = new Spammer();
			   spammer.mRoom = String.valueOf(b+3);
			   spammer.mUser = "User" + String.valueOf(a)+ "_" + String.valueOf(b) ;
			   spammer.mServerAddr = mServerAddr;
			   spammer.mServerPort = mServerPort;
			   spammer.listenSocket();
			   
			   spammer.join();
			   mSpammers.add(spammer);
		   }
	   }
   
   }
   
   static public void addData(int len)
   {
	   mDataTotal += len;
	   if (mDataTotal > mDataCnt)
	   {
		   float speed = 0;
		   float speed2 = 0;
		   if (mStartTime == 0)
		   {
			   mStartTime = System.currentTimeMillis();
			   mCurrTime = System.currentTimeMillis();
		   }else
		   {
			   long time = System.currentTimeMillis();
			   long diff = time - mStartTime;
			   long diff2 = time - mCurrTime;
			   speed = mDataTotal / (float)(diff) * 1000;
			   speed2 = 1000 / (float)(diff2) * 1000;
			   mCurrTime = System.currentTimeMillis();
			   
		   }
		   
		   mDataCnt += 100000;
		   textField.append("Total data : " + mDataCnt + " " + speed + "," + speed2+"\n");
	   }
   }
   
   public void startRandomizeClient()
   {
	   int delay = 2000; //milliseconds
	   ActionListener taskPerformer = new ActionListener() {
	       public void actionPerformed(ActionEvent evt) {
	    	   doRandomizeClient();
	       }
	   };
	   Timer tm = new Timer(delay, taskPerformer);
	   tm.setRepeats(false);
	   tm.start();
   }
   
   public void doRandomizeClient()
   {
	   int delay = 5000; //milliseconds
	   ActionListener taskPerformer = new ActionListener() {
	       public void actionPerformed(ActionEvent evt) {
	           //...Perform a task...
	    	   int count = 20;//generator.nextInt( 20 );
	    	   System.out.println(" start doing " );
	    	   for ( int c = 0; c < count ; c++)
	    	   {
		    	   //if (mCounter % 2 == 0)
	    		   int val =generator.nextInt( 4 ); 
	    		   if ( val == 0 && mSpammers.size() > 0)
		    	   {
		    		   // disconnect
		    		   int randomIndex = generator.nextInt( mSpammers.size() );
		    		   
		    		   Spammer spammer = mSpammers.elementAt(randomIndex);
		    		   spammer.close();
		    		   mSpammers.remove(randomIndex);
		    		   System.out.println(" removing " + randomIndex);
		    	   }else if ( val == 1)
		    	   {
		    		   // connect
		    		   int a = generator.nextInt( mUsersNum);
		    		   int b = generator.nextInt( mRoomSize);
		    		   
					   Spammer spammer = new Spammer();
					   spammer.mRoom = String.valueOf(b+3);
					   spammer.mUser = "User" + String.valueOf(a)+ "_" + String.valueOf(b)+"_"+mCounter ;
					   spammer.mServerAddr = mServerAddr;
					   spammer.mServerPort = mServerPort;
					   spammer.listenSocket();
					   
					   spammer.join();
					   mSpammers.add(spammer);
					   System.out.println(" adding " + mSpammers.size() + " " + spammer.mUser);
					   
		    	   }else if ( val == 2 && mSpammers.size() > 0)
		    	   {
		    		   int randomIndex = generator.nextInt( mSpammers.size() );
		    		   Spammer spammer = mSpammers.elementAt(randomIndex);
		    		   spammer.sendData();
		    	   }else if ( val == 3 && mSpammers.size() > 0)
		    	   {
		    		   int randomIndex = generator.nextInt( mSpammers.size() );
		    		   Spammer spammer = mSpammers.elementAt(randomIndex);
		    		   spammer.sendGarbage();		    		   
		    	   }
		    	   mCounter ++;
		    	   try {
					Thread.sleep(10);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
	    	   }
	    	   System.out.println(" end doing " );
	    	   doRandomizeClient();
	       }
	   };
	   Timer tm = new Timer(delay, taskPerformer);
	   tm.setRepeats(false);
	   tm.start();
   }

   public void startPlayWithClient()
   {
	   for (int a=0; a< mPlayersNum; a++)
	   {
		   for (int b=0; b< mRoomSize; b++)
			    //
		   {
			   Player player = new Player();
			   player.mRoom = String.valueOf(b+2);
			   player.mUser = "Bot" + String.valueOf(a)+ "_" + String.valueOf(b) ;
			   player.mServerAddr = mServerAddr;
			   player.mServerPort = mServerPort;
			   player.listenSocket();
			   
			   player.join();
			   
			   mPlayers.add(player);
		   }
	   }
	   
	   int delay = 200; //milliseconds
	   ActionListener taskPerformer = new ActionListener() {
	       public void actionPerformed(ActionEvent evt) {
	    	   doPlayClient();
	       }

		private void doPlayClient() {
			for (int a=0; a< mPlayers.size(); a++)
			{
				mPlayers.get(a).play();
			}
			
		}
	   };
	   Timer tm = new Timer(delay, taskPerformer);
	   tm.setRepeats(true);
	   tm.start();	   
	   
   }
   
}
