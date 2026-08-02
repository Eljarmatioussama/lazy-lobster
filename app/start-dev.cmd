@echo off
setlocal EnableExtensions EnableDelayedExpansion

rem ============================================================
rem  FitBasic - start emulator + Expo + open app
rem  Usage:  start-dev.cmd
rem ============================================================

cd /d "%~dp0"

set "AVD_NAME=FitBasic_API33"
set "EXPO_PORT=19000"
set "BACKEND_PORT=8080"
set "EXPO_APK=%~dp0Exponent-2.26.6.apk"
set "SDK=%LOCALAPPDATA%\Android\Sdk"
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"

if not exist "%SDK%\platform-tools\adb.exe" (
  echo [ERROR] Android SDK not found at: %SDK%
  exit /b 1
)
if not exist "%SDK%\emulator\emulator.exe" (
  echo [ERROR] Android emulator not found at: %SDK%\emulator
  exit /b 1
)

set "PATH=%JAVA_HOME%\bin;%SDK%\platform-tools;%SDK%\emulator;%PATH%"

echo.
echo === FitBasic Dev Launcher ===
echo.

rem --- Dependencies ---
if not exist "node_modules\" (
  echo [1/5] Installing npm dependencies...
  call npm.cmd install --legacy-peer-deps
  if errorlevel 1 (
    echo [ERROR] npm install failed.
    exit /b 1
  )
) else (
  echo [1/5] Dependencies already installed.
)

rem --- Emulator ---
"%SDK%\platform-tools\adb.exe" devices 2>nul | findstr /R "emulator-[0-9]*[ ]*device$" >nul
if errorlevel 1 (
  echo [2/5] Starting emulator "%AVD_NAME%"...
  start "FitBasic Emulator" /min "%SDK%\emulator\emulator.exe" -avd %AVD_NAME% -netdelay none -netspeed full

  echo        Waiting for emulator to boot...
  "%SDK%\platform-tools\adb.exe" wait-for-device

  set /a WAITED=0
  :wait_boot
  for /f "delims=" %%B in ('"%SDK%\platform-tools\adb.exe" shell getprop sys.boot_completed 2^>nul') do set "BOOT=%%B"
  if "!BOOT!"=="1" goto boot_ready
  set /a WAITED+=3
  if !WAITED! GEQ 180 (
    echo [ERROR] Emulator boot timed out after 180s.
    exit /b 1
  )
  timeout /t 3 /nobreak >nul
  goto wait_boot

  :boot_ready
  echo        Emulator is ready.
) else (
  echo [2/5] Emulator already running.
)

rem --- Expo Go ---
echo [3/5] Checking Expo Go...
"%SDK%\platform-tools\adb.exe" shell pm path host.exp.exponent >nul 2>&1
if errorlevel 1 (
  if not exist "%EXPO_APK%" (
    echo [ERROR] Expo Go APK missing: %EXPO_APK%
    echo         Download with: npx expo-go download android 47
    exit /b 1
  )
  echo        Installing Expo Go...
  "%SDK%\platform-tools\adb.exe" install -r "%EXPO_APK%"
  if errorlevel 1 (
    echo [ERROR] Failed to install Expo Go.
    exit /b 1
  )
) else (
  echo        Expo Go already installed.
)

rem --- Port reverse ---
echo [4/5] Forwarding ports...
"%SDK%\platform-tools\adb.exe" reverse tcp:%EXPO_PORT% tcp:%EXPO_PORT% >nul
"%SDK%\platform-tools\adb.exe" reverse tcp:19001 tcp:19001 >nul
"%SDK%\platform-tools\adb.exe" reverse tcp:8081 tcp:8081 >nul
"%SDK%\platform-tools\adb.exe" reverse tcp:%BACKEND_PORT% tcp:%BACKEND_PORT% >nul
echo        %EXPO_PORT% ^(Expo^), %BACKEND_PORT% ^(backend^)

rem --- Expo Metro ---
echo [5/5] Starting Expo...
echo.
echo Backend should be running at http://localhost:%BACKEND_PORT%
echo Press Ctrl+C in this window to stop Expo.
echo.

rem Open the app shortly after Metro starts
(
  echo @echo off
  echo timeout /t 12 /nobreak ^>nul
  echo "%SDK%\platform-tools\adb.exe" reverse tcp:%EXPO_PORT% tcp:%EXPO_PORT% ^>nul
  echo "%SDK%\platform-tools\adb.exe" reverse tcp:%BACKEND_PORT% tcp:%BACKEND_PORT% ^>nul
  echo "%SDK%\platform-tools\adb.exe" shell am start -a android.intent.action.VIEW -d exp://127.0.0.1:%EXPO_PORT%
) > "%TEMP%\fitbasic-open-app.cmd"
start "Open FitBasic on Emulator" /min cmd /c "%TEMP%\fitbasic-open-app.cmd"

call npx.cmd expo start --port %EXPO_PORT% --lan

endlocal
