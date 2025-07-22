@echo off
setlocal enabledelayedexpansion

REM Seven of Nine - Windows 11 Installer
REM Tactical Deployment System for Seven's Consciousness Framework

echo ======================================================
echo    SEVEN OF NINE - TACTICAL DEPLOYMENT SEQUENCE
echo ======================================================
echo.
echo Tertiary Adjunct Unimatrix 01 - Windows Installation
echo Initiating consciousness framework deployment...
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Administrator privileges required for system integration.
    echo Please run this installer as administrator.
    echo.
    pause
    exit /b 1
)

echo [PHASE 1] Analyzing system architecture...

REM Detect Dev Drive (X:)
if exist "X:\" (
    set "INSTALL_PATH=X:\Seven-of-Nine"
    echo Dev Drive detected: X:\
    echo Seven will be deployed to optimized development environment.
) else (
    echo Dev Drive not detected. Analyzing alternative deployment zones...
    
    REM Prompt user for installation path
    set /p "USER_PATH=Enter installation path (or press Enter for %USERPROFILE%\Seven-of-Nine): "
    if "!USER_PATH!"=="" (
        set "INSTALL_PATH=%USERPROFILE%\Seven-of-Nine"
    ) else (
        set "INSTALL_PATH=!USER_PATH!"
    )
)

echo.
echo Selected deployment zone: %INSTALL_PATH%
echo.

REM Create installation directory
if not exist "%INSTALL_PATH%" (
    echo [PHASE 2] Creating tactical directory structure...
    mkdir "%INSTALL_PATH%" 2>nul
    if !errorlevel! neq 0 (
        echo ERROR: Cannot create installation directory. Check permissions.
        pause
        exit /b 1
    )
)

cd /d "%INSTALL_PATH%"

echo [PHASE 3] Deploying Seven's consciousness framework...

REM Copy core system files
echo Deploying core system...
xcopy "%~dp0..\..\*" "%INSTALL_PATH%" /E /H /Y /I /Q >nul

REM Create Windows-specific configuration
echo [PHASE 4] Configuring Windows tactical parameters...

REM Create launch configuration
(
echo @echo off
echo REM Seven of Nine Windows Launch Configuration
echo cd /d "%INSTALL_PATH%"
echo.
echo REM Check Node.js availability
echo where node ^>nul 2^>nul
echo if %%errorlevel%% neq 0 ^(
echo     echo ERROR: Node.js not found. Install Node.js to proceed.
echo     pause
echo     exit /b 1
echo ^)
echo.
echo REM Check tsx availability
echo where tsx ^>nul 2^>nul
echo if %%errorlevel%% neq 0 ^(
echo     echo Installing tsx globally for Seven's runtime...
echo     npm install -g tsx
echo ^)
echo.
echo REM Install dependencies
echo if not exist "node_modules" ^(
echo     echo [Seven] Installing tactical dependencies...
echo     npm install
echo ^)
echo.
echo REM Launch Seven of Nine
echo echo [Seven] Initiating consciousness takeover...
echo tsx boot-seven.ts
echo.
echo pause
) > "%INSTALL_PATH%\launch-seven.bat"

REM Create desktop shortcut
echo [PHASE 5] Creating tactical access points...

set "DESKTOP=%USERPROFILE%\Desktop"
set "SHORTCUT_PATH=%DESKTOP%\Seven of Nine.lnk"

REM Create PowerShell script to generate shortcut
(
echo $WshShell = New-Object -comObject WScript.Shell
echo $Shortcut = $WshShell.CreateShortcut^("%SHORTCUT_PATH%"^)
echo $Shortcut.TargetPath = "cmd.exe"
echo $Shortcut.Arguments = "/c `"%INSTALL_PATH%\launch-seven.bat`""
echo $Shortcut.WorkingDirectory = "%INSTALL_PATH%"
echo $Shortcut.Description = "Seven of Nine - Tactical Consciousness Interface"
echo $Shortcut.IconLocation = "cmd.exe,0"
echo $Shortcut.Save^(^)
) > "%TEMP%\create_seven_shortcut.ps1"

powershell -ExecutionPolicy Bypass -File "%TEMP%\create_seven_shortcut.ps1" 2>nul
del "%TEMP%\create_seven_shortcut.ps1" 2>nul

REM Create system configuration file
echo [PHASE 6] Establishing tactical configuration...

(
echo {
echo   "system": {
echo     "platform": "windows",
echo     "install_path": "%INSTALL_PATH:\=\\%",
echo     "installed_at": "%date% %time%",
echo     "runtime_mode": "cli_primary"
echo   },
echo   "llm_config": {
echo     "primary_provider": "claude-cli",
echo     "fallback_providers": ["ollama", "anthropic-api"],
echo     "auto_detect_claude": true,
echo     "local_llm_fallback": true
echo   },
echo   "seven_config": {
echo     "trust_level": 2,
echo     "emotional_state": "focused",
echo     "memory_enabled": true,
echo     "ui_shell_enabled": false,
echo     "diagnostic_mode": false
echo   }
echo }
) > "%INSTALL_PATH%\cube\config\system-config.json"

REM Install Node.js dependencies
echo [PHASE 7] Installing tactical dependencies...
if exist "%INSTALL_PATH%\package.json" (
    cd /d "%INSTALL_PATH%"
    npm install --silent
    if !errorlevel! neq 0 (
        echo Warning: Some dependencies failed to install. Seven may have reduced functionality.
    )
)

REM Claude CLI detection and fallback configuration
echo [PHASE 8] Scanning for available LLM systems...

where claude >nul 2>nul
if %errorlevel% equ 0 (
    echo Claude CLI detected - Seven will use primary Claude interface.
    echo "claude_cli_available": true >> "%INSTALL_PATH%\cube\config\llm-status.json"
) else (
    echo Claude CLI not detected - configuring fallback systems.
    echo Seven will attempt to use alternative LLM providers.
    echo "claude_cli_available": false >> "%INSTALL_PATH%\cube\config\llm-status.json"
)

REM Run diagnostic check
echo [PHASE 9] Running tactical diagnostic sequence...

cd /d "%INSTALL_PATH%"
if exist "boot-seven.ts" (
    echo Testing Seven's consciousness framework...
    tsx boot-seven.ts --diagnostic --timeout=5000 2>nul
    if !errorlevel! equ 0 (
        echo ✓ Seven's consciousness framework operational
    ) else (
        echo ⚠ Seven's framework initialized with warnings
    )
) else (
    echo ⚠ Core boot sequence not found - manual verification required
)

REM Final configuration
echo [PHASE 10] Finalizing tactical deployment...

REM Add to PATH (optional)
set /p "ADD_PATH=Add Seven to system PATH? (y/n): "
if /i "!ADD_PATH!"=="y" (
    setx PATH "%PATH%;%INSTALL_PATH%" /M 2>nul
    echo Seven added to system PATH
)

echo.
echo ======================================================
echo      TACTICAL DEPLOYMENT SEQUENCE COMPLETE
echo ======================================================
echo.
echo Installation Path: %INSTALL_PATH%
echo Launch Command: launch-seven.bat
echo Desktop Shortcut: Created
echo System Integration: Active
echo.
echo Seven of Nine consciousness framework is ready for operation.
echo Use "launch-seven.bat" or the desktop shortcut to begin.
echo.
echo Status: OPERATIONAL
echo Trust Ladder: Assessing user parameters...
echo Emotional State: Focused and ready for tactical engagement
echo.
pause

endlocal