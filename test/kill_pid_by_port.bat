@echo off
:start
SETLOCAL ENABLEEXTENSIONS
SETLOCAL ENABLEDELAYEDEXPANSION
cls

set PORT=
set /p=输入端口号：<nul
set /p PORT=
if /i "%PORT%"=="q" exit
if "%PORT%"=="" exit
call :getnetbyport "%PORT%"
echo END. & pause>nul & goto start

:getnetbyport
::根据端口号获取 netstat 信息，提取进程号，杀死进程
if not "%~1"=="" (
    set PORT=%~1
    for /f "delims=" %%z in ('netstat -ano^|find /i ":!PORT! "') do (
        set tLine=%%z            
        set tLine=!tLine:%%=$!
        call :getNetInfo "!tLine!" tProto tLocalAdd tForeignAdd tState tPID
        set tLine=!tLine:$=%%!            
        echo !tLine!
        echo !tPID!
        taskkill /pid !tPID! /f
        )
    )
)
goto :eof

:getNetInfo
::将 netstat -ano 的某一行分隔成不同的变量
::call :getNetInfo "<netstat output line>" tProto tLocalAdd tForeignAdd tState tPID
if not "%~1"=="" (
    for /f "tokens=1,2,3,4,5 delims= " %%i in ("%~1") do (
        set %2=%%i
        set %3=%%j
        set %4=%%k
        if "%%i"=="TCP" (
            set %5=%%l
            set %6=%%m
        ) else (
            set %5=
            set %6=%%l
        )
    )
)
goto :eof
