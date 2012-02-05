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

#include "stdafx.h"
#include "ServerkoWin.h"
#include "ServerkoWinDlg.h"
#include ".\serverkowindlg.h"
#include "../Srvk/Srvk/serverapi/serverko.h"

#include <time.h>

#ifdef _DEBUG
#define new DEBUG_NEW
#endif


// globals

CServerkoWinDlg* gpDlg = NULL;
char gTmpbuff[16384];


void execFile(char* pFile)
{
  FILE* f = fopen(pFile, "rb");
  if (f == NULL) return;
  fseek(f, 0, SEEK_END);
  int sz = ftell(f);
  fseek(f, 0, SEEK_SET);
  char* pBuffer = new char[ sz + 1];
  if (pBuffer == NULL) return;
  fread(pBuffer, sz ,1, f);
  pBuffer[sz] = 0;
  fclose(f);
  
  server_onPushCommand(1, pBuffer, sz);

  //pServer->exec(pBuffer, sz);
  delete []pBuffer;
}

void sysoutput(char* str)
{
  OutputDebugString( str );
  OutputDebugString( "\r\n" );
}

void output(char* str)
{
  //printf("\n%s\n",str);
  //printf("c:");

  

  if (gpDlg && gpDlg->GetSafeHwnd() )
  {
    gpDlg->addTrace(str);
/*    CString text;
    gpDlg->m_output.GetWindowText(text);
    text += CString(str);
    text += "\r\n";
    gpDlg->m_output.SetWindowText(text);
    gpDlg->m_output.LineScroll( 6000 );

    int line = gpDlg->m_output.LineFromChar(-1);
    if (line > 1024)
    {
      // maximum num of lines
      gpDlg->m_output.SetSel(0, 256, TRUE);
      gpDlg->m_output.Clear();
    }*/
  }
}

// CAboutDlg dialog used for App About

class CAboutDlg : public CDialog
{
public:
	CAboutDlg();

// Dialog Data
	enum { IDD = IDD_ABOUTBOX };

	protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV support

// Implementation
protected:
	DECLARE_MESSAGE_MAP()
};

CAboutDlg::CAboutDlg() : CDialog(CAboutDlg::IDD)
{
}

void CAboutDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
}

BEGIN_MESSAGE_MAP(CAboutDlg, CDialog)
END_MESSAGE_MAP()


// CServerkoWinDlg dialog



CServerkoWinDlg::CServerkoWinDlg(CWnd* pParent /*=NULL*/)
	: CDialog(CServerkoWinDlg::IDD, pParent) ,
  mpFileTraceJS(NULL),
  mpFileTraceError(NULL),
  mpFileTrace(NULL),
  mpFileTraceInfo(NULL),
  mCurrTrace(TRACE_COMMAND)
{
	m_hIcon = AfxGetApp()->LoadIcon(IDR_MAINFRAME);
  gpDlg = this;
}

void CServerkoWinDlg::DoDataExchange(CDataExchange* pDX)
{
  CDialog::DoDataExchange(pDX);
  DDX_Control(pDX, IDC_OUTPUT, m_output);
  DDX_Control(pDX, IDC_CONSOLE, m_console);
  DDX_Control(pDX, IDC_RADIO_TRACE_COMMAND, m_tracecommand);
  DDX_Control(pDX, IDC_RADIO_TRACE_JS, m_tracejs);
  DDX_Control(pDX, IDC_RADIO_TRACE_INFO, m_traceinfo);
  DDX_Control(pDX, IDC_RADIO_TRACE_ERROR, m_traceerror);
  
}

BEGIN_MESSAGE_MAP(CServerkoWinDlg, CDialog)
	ON_WM_SYSCOMMAND()
	ON_WM_PAINT()
	ON_WM_QUERYDRAGICON()
	//}}AFX_MSG_MAP
  ON_EN_CHANGE(IDC_CONSOLE, OnEnChangeConsole)
  ON_WM_CLOSE()
  ON_WM_CHAR()
  ON_BN_CLICKED(IDC_SEND, OnBnClickedSend)
  ON_BN_CLICKED(IDC_RADIO_TRACE_COMMAND, &CServerkoWinDlg::OnBnClickedRadioTraceCommand)
  ON_BN_CLICKED(IDC_RADIO_TRACE_JS, &CServerkoWinDlg::OnBnClickedRadioTraceJs)
  ON_BN_CLICKED(IDC_RADIO_TRACE_INFO, &CServerkoWinDlg::OnBnClickedRadioTraceInfo)
  ON_BN_CLICKED(IDC_RADIO_TRACE_ERROR, &CServerkoWinDlg::OnBnClickedRadioTraceError)
END_MESSAGE_MAP()


// CServerkoWinDlg message handlers

BOOL CServerkoWinDlg::OnInitDialog()
{
	CDialog::OnInitDialog();

	// Add "About..." menu item to system menu.

	// IDM_ABOUTBOX must be in the system command range.
	ASSERT((IDM_ABOUTBOX & 0xFFF0) == IDM_ABOUTBOX);
	ASSERT(IDM_ABOUTBOX < 0xF000);

	CMenu* pSysMenu = GetSystemMenu(FALSE);
	if (pSysMenu != NULL)
	{
		CString strAboutMenu;
		strAboutMenu.LoadString(IDS_ABOUTBOX);
		if (!strAboutMenu.IsEmpty())
		{
			pSysMenu->AppendMenu(MF_SEPARATOR);
			pSysMenu->AppendMenu(MF_STRING, IDM_ABOUTBOX, strAboutMenu);
		}
	}

	// Set the icon for this dialog.  The framework does this automatically
	//  when the application's main window is not a dialog
	SetIcon(m_hIcon, TRUE);			// Set big icon
	SetIcon(m_hIcon, FALSE);		// Set small icon


  server_start( output, sysoutput, 51000);

  //execFile( "start.txt" );	

  m_tracecommand.SetCheck(1);

  // open trace files
  tm* tmp;
  time_t ltime;
  int tm = (int)time(&ltime);
  tmp = localtime(&ltime);
  CString fn;
  fn.Format( "trace/Trace%4.4d%2.2d%2.2d%2.2d%2.2d%2.2d.txt", tmp->tm_year + 1900 , tmp->tm_mon+1 , tmp->tm_mday+1,tmp->tm_hour,tmp->tm_min, tmp->tm_sec);
  mpFileTrace = fopen(fn.GetBuffer(), "a+");

  fn.Format( "trace/JS%4.4d%2.2d%2.2d%2.2d%2.2d%2.2d.txt", tmp->tm_year + 1900 , tmp->tm_mon+1 , tmp->tm_mday+1,tmp->tm_hour,tmp->tm_min, tmp->tm_sec);
  mpFileTraceJS = fopen(fn.GetBuffer(), "a+");

  fn.Format( "trace/Error%4.4d%2.2d%2.2d%2.2d%2.2d%2.2d.txt", tmp->tm_year + 1900 , tmp->tm_mon+1 , tmp->tm_mday+1,tmp->tm_hour,tmp->tm_min, tmp->tm_sec);
  mpFileTraceError = fopen(fn.GetBuffer(), "a+");

  fn.Format( "trace/Info%4.4d%2.2d%2.2d%2.2d%2.2d%2.2d.txt", tmp->tm_year + 1900 , tmp->tm_mon+1 , tmp->tm_mday+1,tmp->tm_hour,tmp->tm_min, tmp->tm_sec);
  mpFileTraceInfo = fopen(fn.GetBuffer(), "a+");

  m_console.FmtLines(TRUE);
	return TRUE;  // return TRUE  unless you set the focus to a control
}

void CServerkoWinDlg::OnSysCommand(UINT nID, LPARAM lParam)
{
	if ((nID & 0xFFF0) == IDM_ABOUTBOX)
	{
		CAboutDlg dlgAbout;
		dlgAbout.DoModal();
	}
	else
	{
		CDialog::OnSysCommand(nID, lParam);
	}
}

// If you add a minimize button to your dialog, you will need the code below
//  to draw the icon.  For MFC applications using the document/view model,
//  this is automatically done for you by the framework.

void CServerkoWinDlg::OnPaint() 
{
	if (IsIconic())
	{
		CPaintDC dc(this); // device context for painting

		SendMessage(WM_ICONERASEBKGND, reinterpret_cast<WPARAM>(dc.GetSafeHdc()), 0);

		// Center icon in client rectangle
		int cxIcon = GetSystemMetrics(SM_CXICON);
		int cyIcon = GetSystemMetrics(SM_CYICON);
		CRect rect;
		GetClientRect(&rect);
		int x = (rect.Width() - cxIcon + 1) / 2;
		int y = (rect.Height() - cyIcon + 1) / 2;

		// Draw the icon
		dc.DrawIcon(x, y, m_hIcon);
	}
	else
	{
		CDialog::OnPaint();
	}
}

// The system calls this function to obtain the cursor to display while the user drags
//  the minimized window.
HCURSOR CServerkoWinDlg::OnQueryDragIcon()
{
	return static_cast<HCURSOR>(m_hIcon);
}

void CServerkoWinDlg::OnEnChangeConsole()
{
  // TODO:  If this is a RICHEDIT control, the control will not
  // send this notification unless you override the CDialog::OnInitDialog()
  // function and call CRichEditCtrl().SetEventMask()
  // with the ENM_CHANGE flag ORed into the mask.

  // TODO:  Add your control notification handler code here
  CString str;
  m_console.GetWindowText(str);
  if ( str.Find('\n') )
  {
    int dd=0;
  }
}

void CServerkoWinDlg::OnClose()
{
  // TODO: Add your message handler code here and/or call default
  gpDlg = NULL;
  mCurrTrace = TRACE_NONE;
  CDialog::OnClose();

  if (mpFileTraceJS)fclose(mpFileTraceJS);
  if (mpFileTraceError)fclose(mpFileTraceError);
  if (mpFileTrace)fclose(mpFileTrace);
  if (mpFileTraceInfo)fclose(mpFileTraceInfo);



}

void CServerkoWinDlg::OnChar(UINT nChar, UINT nRepCnt, UINT nFlags)
{
  // TODO: Add your message handler code here and/or call default
  if (nChar == 13 || nChar == 10)
  {
    int ddd=0;
  }

  CDialog::OnChar(nChar, nRepCnt, nFlags);
}

void CServerkoWinDlg::OnBnClickedSend()
{
  // TODO: Add your control notification handler code here
  CString str;
  CString req;
  CString id;
  CString cmd;
  std::string ret;
  gpDlg->m_console.GetWindowText(str);

  if (str.Find("exe") == 0)
  {
    execFile( &str.GetBuffer(0)[4]);
  }else
  //if (str[0] == '$')
  {
      int istart = 0;
      // exec server command
      req = "<req>";
      CString s = str.Tokenize(" ",istart);
      CString s2 = str.Tokenize(" ",istart);
      req += s;
      req += "</req>";
      cmd = "<gs><tc>";
      cmd += req;
      if (s2.GetLength() )
      {
        cmd += "<id>";
        cmd += s2;
        cmd += "</id>";
      }
      cmd += "</tc></gs>\r\n";
      /*
      if (pServer)
      {
        
        pServer->exec(cmd.GetBuffer(), cmd.GetLength() , ret);
      }*/
      server_onPushCommand( 1 , cmd.GetBuffer(), cmd.GetLength() );
      gTmpbuff[0] = 0;
      server_onPullCommandRes( 1 , gTmpbuff, 16384);
      
//      if (ret.length())
      {
        output( gTmpbuff );
      }
  }

  gpDlg->m_console.SetWindowText("");
}

CServerkoWinDlg::~CServerkoWinDlg()
{
	gpDlg = NULL;
  server_stop();
  
}

void CServerkoWinDlg::OnBnClickedRadioTraceCommand()
{
  // TODO: Add your control notification handler code here
  mCurrTrace = TRACE_COMMAND;
  UpdateConsole();
}

void CServerkoWinDlg::OnBnClickedRadioTraceJs()
{
  // TODO: Add your control notification handler code here
  mCurrTrace = TRACE_JS;
  UpdateConsole();
}

void CServerkoWinDlg::OnBnClickedRadioTraceInfo()
{
  // TODO: Add your control notification handler code here
  mCurrTrace = TRACE_INFO;
  UpdateConsole();
}

void CServerkoWinDlg::OnBnClickedRadioTraceError()
{
  // TODO: Add your control notification handler code here
  mCurrTrace = TRACE_ERROR;
  UpdateConsole();
}


void CServerkoWinDlg::addTrace(char* pStr)
{
  // INFO: info trace
  // ERROR: error trace
  // JS: js trace
  //  command trace

  time_t t;
  long curr =(long) time(&t);

  char buff[255];
  sprintf(buff, ":%12.12d:", curr);

  if ( strstr(pStr, "JS:") == pStr)
  {
    // JS trace
    //if (mpFileTraceJS)fclose(mpFileTraceJS);
    if (mpFileTraceJS)
    {
      fputs(buff, mpFileTraceJS);
      fputs( pStr, mpFileTraceJS);
      fputs( "\r\n", mpFileTraceJS);
      fflush(mpFileTraceJS);
    }
    addTraceToStr(pStr, mTraceJS);

  } else
  if ( strstr(pStr, "ERROR:") == pStr)
  {
    // Error trace
    //if (mpFileTraceError)fclose(mpFileTraceError);
    if (mpFileTraceError)
    {
      fputs(buff, mpFileTraceError);
      fputs( pStr, mpFileTraceError);
      fputs( "\r\n", mpFileTraceError);
      fflush(mpFileTraceError);
    }
    addTraceToStr(pStr, mTraceError);
  } else
  if ( strstr(pStr, "INFO:") == pStr)
  {
    // info trace
    //if (mpFileTraceInfo)fclose(mpFileTraceInfo);
    if (mpFileTraceInfo)
    {
      fputs(buff, mpFileTraceInfo);
      fputs( pStr, mpFileTraceInfo);
      fputs( "\r\n", mpFileTraceInfo);
      fflush(mpFileTraceInfo);
    }
    addTraceToStr(pStr, mTraceInfo);
  } else
  {
    // other trace
    //if (mpFileTrace)fclose(mpFileTrace);
    if (mpFileTrace)
    {
      fputs(buff, mpFileTrace);
      fputs( pStr, mpFileTrace);
      fputs( "\r\n", mpFileTrace);
      fflush(mpFileTrace);
    }
    addTraceToStr(pStr, mTrace);
  }
  UpdateConsole();
}

void CServerkoWinDlg::addTraceToStr(char* pStr, std::string& trace)
{
  trace += pStr;
  trace += "\r\n";
  if (trace.length() > 16384)
  {
    trace = trace.substr( trace.length() - 16384, 16384 );
  }
}

void CServerkoWinDlg::UpdateConsole()
{
	if (gpDlg == NULL)
	{
		return;
	}
  switch( mCurrTrace )
  {
    case TRACE_COMMAND:m_output.SetWindowText(mTrace.c_str()); break;
    case TRACE_JS:m_output.SetWindowText(mTraceJS.c_str()); break;
    case TRACE_INFO:m_output.SetWindowText(mTraceInfo.c_str()); break;
    case TRACE_ERROR:m_output.SetWindowText(mTraceError.c_str()); break;
    default: return;
  }
  m_output.LineScroll( 6000 );
}

// TODO - trace on multiple games - each game in its separate window/file/folder

