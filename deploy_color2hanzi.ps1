# ======================================================================
#  Script de Deploy Automático - Projeto Color2Hanzi
#  Autor: Erik Vieira de Melo
#  Função: Atualizar build, commit, push e deploy no Netlify automaticamente
# ======================================================================

Write-Host "Iniciando processo de atualização do Color2Hanzi..." -ForegroundColor Cyan

# 1. Caminho do projeto
$projectPath = "K:\Chines\MVP\Color2Hanzi.com\Color2Hanzi"
Set-Location $projectPath

# 2. Instalar dependências (caso o package.json tenha sido atualizado)
Write-Host "`nVerificando dependências..."
npm install

# 3. Gerar novo build
Write-Host "`nGerando build de produção..."
npm run build

# 4. Adicionar todas as alterações no Git
Write-Host "`nPreparando commit..."
git add .

# 5. Criar commit com timestamp automático
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
$commitMessage = "Atualização automática - Figma build em $timestamp"
git commit -m "$commitMessage"

# 6. Enviar alterações para o GitHub
Write-Host "`nEnviando para GitHub..."
git push

# 7. Deploy manual no Netlify (opcional)
Write-Host "`nPublicando site no Netlify..."
netlify deploy --prod

# 8. Conclusão
Write-Host "`nDeploy concluído com sucesso!" -ForegroundColor Green
Write-Host "Acesse: https://color2hanzi.netlify.app" -ForegroundColor Yellow
