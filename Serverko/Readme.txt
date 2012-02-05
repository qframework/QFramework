Serverko ver 0.1

Server for supporting development with QFramework.
Developed in C++ using Visual Studio 2010. Using Boost, Python27, V8 Google Script Engine.

Features:
- startup and configuration using boot script
- simultanious execution of multiple scripts, JavaScript and Python script session.
- maintaining multiple TCP connections and routing data in and out of script session.
- supports custom based persistent HTTP connection, implements only small portion of HTTP protocol.
- small memory footprint, optimized execution.
- Linux build file and port avaliable in directory ServerkoLinux

More documentation and examples will be developed.
Python script version is up to latest protocol version
Javascript portion is functional.

Folder Structure:
ServerkoWin    - VisualStudio 2010 project folder, for GUI.
ServerkoDll    - VisualStudio 2010 server dll folder for server engine.
Srvk           - Server library code.
ServerkoLinux  - Linux makefile.
scriptpool     - scripts, framework and program scripts.
tester         - Small facility for testing server.
Releases       - Target directory for release build.
