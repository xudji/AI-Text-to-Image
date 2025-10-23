@echo off
echo 🔑 阿里云DashScope API Key 设置向导
echo.

REM 检查是否已设置API Key
if not "%DASHSCOPE_API_KEY%"=="" (
    echo ✅ 检测到已设置的API Key: %DASHSCOPE_API_KEY:~0,10%...
    echo.
    choice /c YN /m "是否要重新设置API Key"
    if errorlevel 2 goto :test
    if errorlevel 1 goto :input
) else (
    echo ❌ 未检测到API Key设置
    goto :input
)

:input
echo.
echo 📝 请输入您的阿里云DashScope API Key:
echo 格式: sk-xxxxxxxxxxxxxxxx
echo.
set /p NEW_API_KEY="API Key: "

if "%NEW_API_KEY%"=="" (
    echo ❌ API Key不能为空
    goto :input
)

if not "%NEW_API_KEY:~0,3%"=="sk-" (
    echo ⚠️  警告: API Key格式可能不正确，通常以"sk-"开头
    choice /c YN /m "是否继续使用此API Key"
    if errorlevel 2 goto :input
)

echo.
echo 🔧 设置环境变量...
set DASHSCOPE_API_KEY=%NEW_API_KEY%

echo ✅ API Key已设置: %DASHSCOPE_API_KEY:~0,10%...

:test
echo.
echo 🧪 测试API Key有效性...
node test-api-key.js

echo.
echo 📋 设置完成！请按以下步骤操作:
echo.
echo 1. 如果测试成功，请重新启动代理服务器
echo 2. 如果测试失败，请检查API Key是否正确
echo.
echo 启动代理服务器命令:
echo node proxy-server.js
echo.
pause
