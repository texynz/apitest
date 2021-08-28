@echo off
call yarn --version
if %errorlevel%==1 (
    echo [91mPlease install yarn[0m
    PAUSE
    exit
)

echo [93mInstalling dependencies[0m
call yarn install

if exist project.zip (
    echo [93mUpdating project[0m
    call node ./packages/ada install project.zip
    echo [93mUpdating dependencies[0m
    call yarn install
) else (
    echo [91mProject zip file not found![0m
    echo [91mPlease name your project zip file: "project.zip"[0m
    echo [91mThen run this file again[0m
)

PAUSE