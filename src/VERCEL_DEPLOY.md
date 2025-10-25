# 🚀 Deploy Color2Hanzi no Vercel

## ⚡ Método Mais Rápido (2 minutos)

### Opção 1: Deploy Direto via GitHub (Recomendado)

1. **Criar repositório no GitHub**
   - Acesse: https://github.com/new
   - Nome: `color2hanzi`
   - Tipo: Public
   - Clique em **Create repository**

2. **Subir código para GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Color2Hanzi"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/color2hanzi.git
   git push -u origin main
   ```

3. **Deploy no Vercel**
   - Acesse: https://vercel.com/new
   - Faça login com GitHub
   - Clique em **Import Git Repository**
   - Selecione `color2hanzi`
   - Clique em **Deploy**
   - **Pronto!** Site no ar em ~1 minuto! 🎉

---

## 📦 Opção 2: Deploy Manual (Sem GitHub)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

---

## ⚙️ Configurações Automáticas

O Vercel detecta automaticamente:
- ✅ Framework: Vite
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`
- ✅ Install Command: `npm install`

Tudo está configurado no arquivo `vercel.json`!

---

## 🌐 Domínio Personalizado

### Opção A: Subdomínio Vercel (Grátis)

Seu site será automaticamente disponibilizado em:
```
https://color2hanzi.vercel.app
```

Você pode mudar o nome em:
- **Project Settings** → **Domains** → **Edit**

### Opção B: Domínio Próprio (color2hanzi.com)

1. **No Vercel:**
   - Vá em **Project Settings** → **Domains**
   - Clique em **Add**
   - Digite: `color2hanzi.com` e `www.color2hanzi.com`

2. **No Registrador de Domínio:**
   
   **Método 1 - CNAME (Recomendado):**
   ```
   Tipo: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
   
   **Método 2 - A Record:**
   ```
   Tipo: A
   Name: @
   Value: 76.76.21.21
   ```

3. **HTTPS:** Configurado automaticamente pela Vercel! ✅

---

## 🔄 Deploy Contínuo (Automático)

Com GitHub conectado, cada push faz deploy automaticamente:

```bash
# Fazer mudanças no código
git add .
git commit -m "descrição das mudanças"
git push

# Vercel detecta e faz deploy automaticamente! 🚀
```

---

## 🎯 Recursos do Vercel

✅ **Deploy em segundos** (mais rápido que Netlify)  
✅ **HTTPS grátis** (SSL automático)  
✅ **CDN Global** (Edge Network - ultra rápido)  
✅ **Deploy Previews** (cada branch/PR tem URL única)  
✅ **Rollback instantâneo** (voltar para versão anterior)  
✅ **Analytics grátis** (Core Web Vitals)  
✅ **Sem limite de banda** no plano gratuito  
✅ **Suporte a Serverless Functions**  
✅ **Edge Functions** (lógica na edge)  

---

## 📊 Arquivos de Configuração

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [ /* cache e segurança */ ]
}
```

**Configurações incluídas:**
- ✅ SPA Rewrites (suporte para React Router)
- ✅ Cache de assets (1 ano)
- ✅ Headers de segurança (XSS, nosniff, etc.)

---

## 🆚 Vercel vs Netlify vs GitHub Pages

| Recurso | Vercel | Netlify | GitHub Pages |
|---------|--------|---------|--------------|
| Setup | ⚡ 1 minuto | ⚡ 2 minutos | ⚠️ 5 minutos |
| Deploy Speed | 🚀 ~30s | 🚀 ~45s | 🐢 ~2 min |
| HTTPS Custom | ✅ Grátis | ✅ Grátis | ✅ Grátis |
| Deploy Automático | ✅ Sim | ✅ Sim | ⚠️ Script |
| CDN Global | ✅ Edge | ✅ Sim | ✅ Sim |
| Bandwidth | ❌ 100GB/mês | ❌ Ilimitado | ✅ 100GB/mês |
| Build Minutes | ✅ 6000 min/mês | ✅ 300 min/mês | ❌ N/A |
| Analytics | ✅ Grátis | ⚠️ Pago | ❌ Não |
| Functions | ✅ 100GB-Hrs | ✅ 125k/mês | ❌ Não |
| Edge Network | ✅ Sim | ⚠️ Limitado | ❌ Não |

**Recomendação:** Vercel é melhor para projetos React/Vite! 🏆

---

## 🔧 Comandos da Vercel CLI

```bash
# Instalar CLI
npm install -g vercel

# Login
vercel login

# Deploy (preview)
vercel

# Deploy (produção)
vercel --prod

# Ver logs
vercel logs

# Listar projetos
vercel list

# Listar deployments
vercel ls

# Remover projeto
vercel remove
```

---

## 📱 Variáveis de Ambiente (Opcional)

Se precisar de variáveis de ambiente:

1. **No Vercel Dashboard:**
   - **Project Settings** → **Environment Variables**
   - Adicione suas variáveis

2. **No código:**
   ```typescript
   const apiKey = import.meta.env.VITE_API_KEY;
   ```

3. **Localmente (`.env.local`):**
   ```bash
   VITE_API_KEY=your_key_here
   ```

---

## ❓ Problemas Comuns

### Build falha

**Solução:**
```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build

# Testar localmente
npm run preview
```

### Site em branco

**Solução:**
- Verifique se `base: '/'` no `vite.config.ts`
- Verifique se build gerou arquivos em `dist/`
- Veja logs: `vercel logs`

### Erro 404 ao navegar

**Solução:**
- O arquivo `vercel.json` já tem rewrites configurados
- Se ainda persistir, verifique se o arquivo está no root do projeto

### Deploy muito lento

**Solução:**
- Verifique tamanho dos `node_modules`
- Use `.vercelignore` para ignorar arquivos desnecessários

---

## 📝 .vercelignore (Opcional)

Crie arquivo `.vercelignore` para ignorar arquivos no upload:

```
node_modules
.git
*.md
.vscode
.idea
*.log
dist
```

---

## 🎉 Pronto!

Seu site Color2Hanzi estará no ar em menos de 2 minutos!

**URLs:**
- **Preview**: `https://color2hanzi-git-main-usuario.vercel.app`
- **Produção**: `https://color2hanzi.vercel.app`
- **Custom**: `https://color2hanzi.com` (após configurar)

---

## 🔗 Links Úteis

- **Dashboard Vercel**: https://vercel.com/dashboard
- **Documentação**: https://vercel.com/docs
- **CLI Docs**: https://vercel.com/docs/cli
- **Support**: https://vercel.com/support

---

**Deploy feito com ❤️ na Vercel! 🚀**
