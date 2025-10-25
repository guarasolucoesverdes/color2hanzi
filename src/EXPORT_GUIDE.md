# 📦 Guia de Exportação - Color2Hanzi

## Como Exportar e Salvar os Arquivos no GitHub

### Método 1: Download Direto (Figma Make)

Se você está usando o Figma Make, pode baixar o projeto diretamente:

1. Clique no botão de **Download/Export** (se disponível)
2. Isso baixará um arquivo ZIP com todo o projeto
3. Extraia o ZIP em uma pasta no seu computador

### Método 2: Copiar Arquivos Manualmente

1. Crie uma pasta no seu computador chamada `color2hanzi`
2. Copie todos os arquivos e pastas do projeto para essa pasta
3. Certifique-se de que a estrutura está completa (veja lista abaixo)

---

## 📁 Estrutura de Arquivos Necessária

Certifique-se de que você tem TODOS esses arquivos:

```
color2hanzi/
├── App.tsx                      ✅ Componente principal
├── package.json                 ✅ Dependências
├── tsconfig.json               ✅ Config TypeScript
├── tsconfig.node.json          ✅ Config TypeScript (Node)
├── vite.config.ts              ✅ Config Vite
├── netlify.toml                ✅ Config Netlify
├── index.html                  ✅ HTML principal
├── NETLIFY_DEPLOY.md           ✅ Guia de deploy
├── README.md                   ✅ Documentação
│
├── public/
│   ├── favicon.svg             ✅ Ícone do site
│   └── _redirects              ✅ Config SPA
│
├── src/
│   └── main.tsx                ✅ Entry point
│
├── styles/
│   └── globals.css             ✅ Estilos globais
│
└── components/
    └── figma/
        └── ImageWithFallback.tsx  ✅ Componente de imagem
```

---

## 🚀 Passos para Subir no GitHub Manualmente

### 1️⃣ Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. **Nome**: `color2hanzi`
3. **Visibilidade**: Public
4. **NÃO** marque "Initialize with README"
5. Clique em **Create repository**

### 2️⃣ Preparar os Arquivos Localmente

```bash
# Abra o terminal na pasta do projeto
cd caminho/para/color2hanzi

# Inicializar Git
git init

# Adicionar todos os arquivos
git add .

# Fazer primeiro commit
git commit -m "Initial commit - Color2Hanzi"

# Renomear branch para main
git branch -M main

# Conectar com GitHub (SUBSTITUA SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/color2hanzi.git

# Enviar para GitHub
git push -u origin main
```

### 3️⃣ Verificar no GitHub

1. Acesse seu repositório: `https://github.com/SEU_USUARIO/color2hanzi`
2. Verifique se todos os arquivos estão lá
3. Pronto! Código salvo no GitHub ✅

---

## 🌐 Deploy no Netlify

Agora que o código está no GitHub, você tem 2 opções:

### Opção A: Deploy Automático (Recomendado)

1. Acesse [netlify.com](https://www.netlify.com/)
2. Faça login
3. **Add new site** → **Import an existing project**
4. Escolha **GitHub**
5. Selecione o repositório `color2hanzi`
6. Configurações detectadas automaticamente:
   - Build command: `npm run build`
   - Publish directory: `dist`
7. Clique em **Deploy site**
8. Aguarde 1-2 minutos ⏰
9. Site no ar! 🎉

### Opção B: Deploy Manual

```bash
# Na pasta do projeto
npm install
npm run build

# Arraste a pasta 'dist' para o Netlify
```

1. Acesse [netlify.com](https://www.netlify.com/)
2. Arraste a pasta `dist/` para a área de drop
3. Site no ar em segundos! 🎉

---

## 🔑 Se Pedir Autenticação no Git

### Método 1: Token Pessoal (Recomendado)

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token (classic)**
3. Marque: `repo` (todos os itens)
4. **Generate token**
5. **COPIE O TOKEN** (não vai aparecer novamente!)
6. Ao fazer push, use o token como senha:
   - Username: `seu_usuario`
   - Password: `cole_o_token_aqui`

### Método 2: SSH (Avançado)

```bash
# Gerar chave SSH
ssh-keygen -t ed25519 -C "seu@email.com"

# Copiar chave pública
cat ~/.ssh/id_ed25519.pub

# Adicionar no GitHub: Settings → SSH and GPG keys → New SSH key

# Mudar remote para SSH
git remote set-url origin git@github.com:SEU_USUARIO/color2hanzi.git
```

---

## ✅ Checklist Final

- [ ] Todos os arquivos copiados
- [ ] Repositório criado no GitHub
- [ ] Git inicializado (`git init`)
- [ ] Arquivos adicionados (`git add .`)
- [ ] Commit criado (`git commit -m "..."`)
- [ ] Remote adicionado (`git remote add origin ...`)
- [ ] Código enviado (`git push -u origin main`)
- [ ] Código visível no GitHub
- [ ] Deploy feito no Netlify
- [ ] Site funcionando! 🎉

---

## 🆘 Problemas Comuns

### "Permission denied" ao fazer push

**Solução**: Use token pessoal (veja acima)

### "Repository not found"

**Solução**: Verifique se o nome do repositório está correto:
```bash
git remote -v  # Ver URL atual
git remote set-url origin https://github.com/SEU_USUARIO/color2hanzi.git
```

### Build falha no Netlify

**Solução**: Verifique se `package.json` está no GitHub

### Faltando arquivos no GitHub

**Solução**: 
```bash
git add .
git commit -m "Add missing files"
git push
```

---

## 📞 Precisa de Ajuda?

1. Veja o arquivo **NETLIFY_DEPLOY.md** para mais detalhes
2. Documentação Netlify: https://docs.netlify.com/
3. Documentação Git: https://git-scm.com/doc

---

**Boa sorte com o deploy! 🚀**
