# ====================================================================== 
#  Script de Deploy - Projeto Color2Hanzi (com deploy automático via GitHub)
#  Autor: Erik Vieira de Melo
# ======================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Iniciando deploy automático do Color2Hanzi..." -ForegroundColor Cyan

# 1. Caminho do projeto
$projectPath = "K:\Chines\MVP\Color2Hanzi.com\Color2Hanzi"
Set-Location $projectPath

# 2. Instalar dependências (caso package.json tenha mudado)
Write-Host "`nVerificando dependências..."
npm install

# 3. Build de produção
Write-Host "`nGerando build (vite)..."
npm run build

# 4. Atualizar repositório remoto (pull com rebase)
Write-Host "`nSincronizando com repositório remoto..."
git pull --rebase origin main

# 5. Adicionar alterações e commitar
Write-Host "`nPreparando commit..."
git add .

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
$commitMessage = "Atualização automática - Figma build em $timestamp"
git commit -m "$commitMessage" 2>$null

# 6. Push para o GitHub
Write-Host "`nEnviando para GitHub..."
git push origin main

# 7. Conclusão
Write-Host "`n✅ Deploy iniciado automaticamente pela Vercel (via GitHub)" -ForegroundColor Green
Write-Host "Acesse: https://color2hanzi.vercel.app" -ForegroundColor Yellow
