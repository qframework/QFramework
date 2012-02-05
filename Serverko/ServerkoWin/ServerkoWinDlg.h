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

#pragma once
#include "afxwin.h"
#include <string>

typedef enum _CurrTrace
{
  TRACE_NONE,
  TRACE_COMMAND,
  TRACE_JS,
  TRACE_INFO,
  TRACE_ERROR
} CurrTrace;

// CServerkoWinDlg dialog
class CServerkoWinDlg : public CDialog
{
// Construction
public:
	CServerkoWinDlg(CWnd* pParent = NULL);	// standard constructor
  virtual ~CServerkoWinDlg();
// Dialog Data
	enum { IDD = IDD_SERVERKOWIN_DIALOG };

  void addTrace(char* pStr);


	protected:
	virtual void DoDataExchange(CDataExchange* pDX);	// DDX/DDV support
  
  void addTraceToStr(char* pStr, std::string& trace);
  void UpdateConsole();

// Implementation
protected:
	HICON m_hIcon;

	// Generated message map functions
	virtual BOOL OnInitDialog();
	afx_msg void OnSysCommand(UINT nID, LPARAM lParam);
	afx_msg void OnPaint();
	afx_msg HCURSOR OnQueryDragIcon();
	DECLARE_MESSAGE_MAP()

public:
  CEdit       m_output;
  CEdit       m_console;
  CButton     m_tracecommand;
  CButton     m_tracejs;
  CButton     m_traceinfo;
  CButton     m_traceerror;

  FILE*       mpFileTraceJS;
  FILE*       mpFileTraceError;
  FILE*       mpFileTrace;
  FILE*       mpFileTraceInfo;
  std::string mTraceJS;
  std::string mTrace;
  std::string mTraceInfo;
  std::string mTraceError;
  CurrTrace   mCurrTrace;

  afx_msg void OnEnChangeConsole();
  afx_msg void OnClose();
  afx_msg void OnChar(UINT nChar, UINT nRepCnt, UINT nFlags);
  afx_msg void OnBnClickedSend();
  afx_msg void OnBnClickedRadioTraceCommand();
  afx_msg void OnBnClickedRadioTraceJs();
  afx_msg void OnBnClickedRadioTraceInfo();
  afx_msg void OnBnClickedRadioTraceError();
};
