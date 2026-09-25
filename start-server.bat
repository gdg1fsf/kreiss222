@echo off
chcp 65001 >nul
color 0A
echo.
echo ════════════════════════════════════════════
echo    🚀 ЗАПУСК ЛОКАЛЬНОГО СЕРВЕРА
echo ════════════════════════════════════════════
echo.
echo 📍 Откройте в браузере:
echo    http://localhost:8000
echo.
echo ⚠️  Для остановки нажмите Ctrl+C
echo.
echo ════════════════════════════════════════════
echo.

REM Проверяем наличие Python
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Python найден. Запуск сервера...
    echo.
    python -m http.server 8000
    goto :end
)

REM Если Python не найден, проверяем PHP
where php >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ PHP найден. Запуск сервера...
    echo.
    php -S localhost:8000
    goto :end
)

REM Если ничего не найдено
echo ❌ ОШИБКА: Не установлены Python или PHP
echo.
echo 📥 Установите один из:
echo    - Python: https://www.python.org/downloads/
echo    - PHP: https://windows.php.net/download/
echo.
pause
goto :end

:end
