@echo off
echo 🚀 AI图片生成器 - 快速启动
echo.

REM 检查Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未安装Node.js
    echo 请先安装Node.js: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查API Key
if "%DASHSCOPE_API_KEY%"=="" (
    echo ❌ 未设置API Key
    echo 请先运行: setup-api-key.bat
    pause
    exit /b 1
)

echo ✅ 环境检查通过
echo 🔑 API Key: %DASHSCOPE_API_KEY:~0,10%...
echo.

REM 安装依赖
if not exist "node_modules" (
    echo 📦 安装依赖包...
    npm install express cors axios
)

REM 启动代理服务器
echo 🎯 启动代理服务器...
start "代理服务器" cmd /k "node proxy-server.js"

REM 等待代理服务器启动
timeout /t 3 /nobreak >nul

REM 启动前端应用
echo 🌐 启动前端应用...
start "前端应用" cmd /k "npm run dev"

echo.
echo ✅ 启动完成！
echo 📡 代理服务器: http://localhost:8080
echo 🌐 前端应用: http://localhost:3000
echo.
echo 按任意键退出...
pause >nul
