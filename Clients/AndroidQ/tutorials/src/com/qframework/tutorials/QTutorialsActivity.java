package com.qframework.tutorials;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.res.Configuration;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.view.Window;
import android.view.WindowManager;
import android.widget.EditText;

public class QTutorialsActivity extends Activity {
	EAGLView mView;
	static final String mAppName = "QTutorials";
	Handler mMessageHandler;
	@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
//        setContentView(R.layout.main);

        mView = new EAGLView(this, mAppName);
        mView.requestFocus();
        mView.setFocusableInTouchMode(true);        
        setContentView(mView);
        
		mMessageHandler = new Handler() { 
	        @Override 
	        public void handleMessage(Message msg) { 
	             switch (msg.what) { 
	      
	             	case 10000: 
	             	{
	             		String[] args = (String [])msg.obj; 
	             		doTextInput(args[0],args[1]);
	             		break;
	             	}
	             }
	        }
		};
    }
    
    public void onResume() {
		super.onResume();
        if(mView != null) {
        	mView.onResume();
        }
		
	}
	public void onPause() {
		super.onPause();
        if (mView != null) {
        	mView.onPause();
        }		
	}

	public void onDestroy() {
		super.onDestroy();
					
	}    
	
	public void onConfigurationChanged(Configuration newConfig) {
		  super.onConfigurationChanged(newConfig);
		}	
	
	public void onTextInput(String resptype, String respdata) {
		Message msg = new Message(); 
        msg.what = 10000; 
        String[] args = {resptype, respdata};
        msg.obj = args;
        mMessageHandler.sendMessageDelayed(msg, 10); 
	
	}
	public void doTextInput(String resptype, String respdata) {	
		AlertDialog.Builder alert = new AlertDialog.Builder(this);

		alert.setTitle("");
		alert.setMessage("");

		// Set an EditText view to get user input 
		final EditText input = new EditText(this);
		input.setText(resptype);
		input.requestFocus();
		final String respscript = respdata;
		alert.setView(input);

		alert.setPositiveButton("OK", new DialogInterface.OnClickListener() {
		public void onClick(DialogInterface dialog, int whichButton) {
		  String value = input.getText().toString();
		   String script = respscript + "('" + value + "' , 1);";
		   //Log.d("model" ,  script);
		   mView.onTextInputEnd(script);
		  }
		});
		alert.show();
		
	}
}