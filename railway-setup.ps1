Set-Location "D:\Documents\MaxLandingPage"
$node = "C:\Program Files\nodejs\node.exe"
$rw   = "C:\Users\User\AppData\Roaming\npm\node_modules\@railway\cli\bin\railway.js"

function rw { & $node $rw @args }

Write-Host ""
Write-Host "=== Railway Setup ===" -ForegroundColor Cyan

# 1. Login
Write-Host ""
Write-Host "[1/4] Логин в Railway (откроется браузер)..." -ForegroundColor Yellow
rw login
if ($LASTEXITCODE -ne 0) { Write-Host "Ошибка логина." -ForegroundColor Red; exit 1 }

# 2. Инициализация проекта
Write-Host ""
Write-Host "[2/4] Создаю проект maxlandingpage..." -ForegroundColor Yellow
rw init --name maxlandingpage
if ($LASTEXITCODE -ne 0) {
  Write-Host "Попробую слинковать существующий..." -ForegroundColor Yellow
  rw link
}

# 3. Переменные окружения
Write-Host ""
Write-Host "[3/4] Переменные окружения..." -ForegroundColor Yellow
rw variables set NODE_ENV=production
rw variables set "TELEGRAM_TOKEN=8248642703:AAGoJmiBg5Hg0X56-Px_2Sr9STCiSuDXL_Y"
rw variables set DATA_DIR=/data
Write-Host "  OK" -ForegroundColor Green

# 4. Деплой
Write-Host ""
Write-Host "[4/4] Деплой..." -ForegroundColor Yellow
rw up --detach

Write-Host ""
Write-Host "=== Готово! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Публичный домен:" -ForegroundColor Yellow
rw domain

Write-Host ""
Write-Host "! Зайди на https://railway.app -> Volumes -> New Volume -> Mount: /data" -ForegroundColor Red
