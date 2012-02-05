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


#ifdef _DEBUG
#define new DEBUG_NEW
#endif

 
// CServerkoWinApp

BEGIN_MESSAGE_MAP(CServerkoWinApp, CWinApp)
	ON_COMMAND(ID_HELP, CWinApp::OnHelp)
END_MESSAGE_MAP()


// CServerkoWinApp construction

CServerkoWinApp::CServerkoWinApp()
{
	// TODO: add construction code here,
	// Place all significant initialization in InitInstance

/*
  if (argc > 1)
  {
    for (int a=1; a < argc; a++)
    {
      execFile( argv[a] );
    }
  }
*/
}


// The one and only CServerkoWinApp object

CServerkoWinApp theApp;


// CServerkoWinApp initialization

BOOL CServerkoWinApp::InitInstance()
{
	CWinApp::InitInstance();

	AfxEnableControlContainer();

	// Standard initialization
	// If you are not using these features and wish to reduce the size
	// of your final executable, you should remove from the following
	// the specific initialization routines you do not need
	// Change the registry key under which our settings are stored
	// TODO: You should modify this string to be something appropriate
	// such as the name of your company or organization
	SetRegistryKey(_T("Local AppWizard-Generated Applications"));

	CServerkoWinDlg dlg;
	m_pMainWnd = &dlg;
	INT_PTR nResponse = dlg.DoModal();
	if (nResponse == IDOK)
	{
		// TODO: Place code here to handle when the dialog is
		//  dismissed with OK
	}
	else if (nResponse == IDCANCEL)
	{
		// TODO: Place code here to handle when the dialog is
		//  dismissed with Cancel
	}

	// Since the dialog has been closed, return FALSE so that we exit the
	//  application, rather than start the application's message pump.
	return FALSE;
}
