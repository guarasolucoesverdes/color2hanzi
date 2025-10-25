# 🚀 Deploy Color2Hanzi no Netlify

## Método 1: Upload Manual (Mais Rápido)

### Passo 1: Fazer Build do Projeto

```bash
# Instalar dependências (se ainda não instalou)
npm install

# Gerar build de produção
npm run build
```

Isso criará uma pasta `dist/` com todos os arquivos otimizados.

### Passo 2: Deploy Manual no Netlify

1. Acesse [netlify.com](https://www.netlify.com/)
2. Faça login ou crie uma conta gratuita
3. Na dashboard, arraste a pasta `dist` para área "Drag and drop"
4. Pronto! Site no ar em segundos!

**URL temporária**: `https://random-name-123456.netlify.app`

---

## Método 2: Deploy via GitHub (Automático)

### Passo 1: Subir para o GitHub

```bash
# Criar repositório no GitHub primeiro: https://github.com/new

# Inicializar Git
git init
git add .
git commit -m "Initial commit - Color2Hanzi"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/color2hanzi.git
git push -u origin main
```

### Passo 2: Conectar Netlify ao GitHub

1. Acesse [netlify.com](https://www.netlify.com/) e faça login
2. Clique em **"Add new site"** → **"Import an existing project"**
3. Escolha **GitHub** e autorize o acesso
4. Selecione o repositório `color2hanzi`
5. Configure o build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Clique em **"Deploy site"**

Netlify vai automaticamente:
- Fazer build do projeto
- Colocar o site no ar
- Refazer deploy a cada push no GitHub

---

## 📝 Configurar Domínio Personalizado

### Opção A: Subdomínio Netlify (Grátis)

1. No painel do site no Netlify
2. **Site settings** → **Domain management**
3. Clique em **"Change site name"**
4. Digite: `color2hanzi`
5. URL final: `https://color2hanzi.netlify.app`

### Opção B: Domínio Próprio (color2hanzi.com)

1. Compre um domínio (Namecheap, GoDaddy, etc.)
2. No Netlify: **Domain settings** → **Add custom domain**
3. Digite seu domínio: `color2hanzi.com`
4. Configure DNS no registrador:

**Se usar Netlify DNS (recomendado)**:
- Troque os nameservers para os fornecidos pela Netlify

**Se usar DNS externo**:
- Tipo **A** → IP: `75.2.60.5`
- Tipo **CNAME** → `www` → `seu-site.netlify.app`

5. HTTPS será configurado automaticamente pela Netlify

---

## 🔄 Atualizações Futuras

### Método Manual:
```bash
npm run build
# Arraste a pasta dist/ novamente no Netlify
```

### Método GitHub (Automático):
```bash
git add .
git commit -m "descrição das mudanças"
git push
# Netlify faz deploy automaticamente!
```

---

## ⚙️ Arquivos de Configuração Criados

✅ **netlify.toml** - Configurações de build e cache  
✅ **public/_redirects** - Suporte para SPA routing  
✅ **vite.config.ts** - Base path configurado para `/`

---

## 📊 Configurações do Netlify (Automático)

O arquivo `netlify.toml` já configura:

- ✅ Build command: `npm run build`
- ✅ Publish directory: `dist`
- ✅ SPA redirects
- ✅ Headers de segurança
- ✅ Cache otimizado (assets com cache de 1 ano)
- ✅ Proteção XSS

---

## 🎯 Vantagens do Netlify

✅ **Deploy em segundos** (arraste e solte)  
✅ **HTTPS grátis** (Let's Encrypt automático)  
✅ **CDN global** (site rápido em todo mundo)  
✅ **Deploy contínuo** (auto-deploy no push)  
✅ **Preview de PRs** (testa antes de publicar)  
✅ **Rollback fácil** (volta para versão anterior)  
✅ **Analytics grátis** (visitantes, pageviews, etc.)  
✅ **Sem limite de banda** no plano gratuito  

---

## 🆚 Netlify vs GitHub Pages

| Recurso | Netlify | GitHub Pages |
|---------|---------|--------------|
| Setup | Arraste e solte | Requer configuração |
| HTTPS Customizado | ✅ Grátis | ✅ Grátis |
| Deploy Automático | ✅ Sim | ⚠️ Requer npm script |
| CDN Global | ✅ Muito rápido | ✅ Rápido |
| Limite de Banda | ❌ Sem limite | ✅ 100GB/mês |
| Forms | ✅ Grátis (100/mês) | ❌ Não |
| Serverless Functions | ✅ Grátis (125k/mês) | ❌ Não |

---

## ❓ Problemas Comuns

### Build falha no Netlify
```bash
# Limpar e reinstalar dependências localmente
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Site em branco após deploy
- Verifique se `base: '/'` no `vite.config.ts`
- Verifique se build gerou arquivos na pasta `dist/`

### Erro 404 ao navegar
- O arquivo `_redirects` deve estar em `public/_redirects`
- Ou use configuração no `netlify.toml` (já incluída)

---

## 🎉 Pronto!

Seu site estará no ar em minutos com:
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Deploy contínuo
- ✅ Performance otimizada

**URL padrão**: `https://seu-site.netlify.app`  
**Com domínio**: `https://color2hanzi.com`

---

**Qualquer dúvida, veja a [documentação oficial do Netlify](https://docs.netlify.com/)**
