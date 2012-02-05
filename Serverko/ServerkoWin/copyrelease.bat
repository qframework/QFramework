copy /Y Release\ServerkoWin.exe ..\Releases
copy /Y Release\ServerkoDll.dll ..\Releases
xcopy /Y scripts\*.*  ..\Releases\scripts /a /e /k
copy /Y start.txt ..\Releases
copy /Y *.db ..\Releases
