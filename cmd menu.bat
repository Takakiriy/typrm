@echo off
echo 1. open_VisualStudioCode
echo 2. setup
echo 9. clean
set key=

set /p key=number^>
if "%key%" == "1"  goto :open_VisualStudioCode
if "%key%" == "2"  goto :setup
if "%key%" == "9"  goto :clean
echo Unknown command error. & set errorlevel=1
goto :finally

:open_VisualStudioCode
if not exist "node_modules" goto :setup
code .
goto :finally

:setup
PATH=%PATH%;C:\Program Files\Git\usr\bin
"C:\Program Files\Git\usr\bin\bash.exe" -c "npm run setup"
code .
goto :finally

:clean
PATH=%PATH%;C:\Program Files\Git\usr\bin
"C:\Program Files\Git\usr\bin\bash.exe" -c "npm run clean"
goto :finally

:finally
if "%errorlevel%" == "0" echo Done.
if not "%errorlevel%" == "0"  echo You can close this window.
if not "%errorlevel%" == "0"  set /p dummy=
exit %errorlevel%
