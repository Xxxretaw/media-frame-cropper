@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found.
  echo Please install Node.js, or deploy this folder to Netlify / Vercel and open the hosted URL.
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ok=$false; try { $r=Invoke-WebRequest -Uri 'http://localhost:4173/' -UseBasicParsing -TimeoutSec 1; $ok=($r.StatusCode -eq 200) } catch { $ok=$false }; if ($ok) { exit 0 } else { exit 1 }"
if not errorlevel 1 (
  echo Local server is already running.
  echo Opening http://localhost:4173 ...
  start "" "http://localhost:4173"
  pause
  exit /b 0
)

echo Starting local server...
echo Open URL: http://localhost:4173
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 1; Start-Process 'http://localhost:4173'"
node server.mjs

echo.
echo Local server stopped.
pause
