# ⚡ Quick Start - Color2Hanzi no Netlify

## 🚀 Método Mais Rápido (5 minutos)

### 1. Fazer Build

```bash
npm install
npm run build
```

### 2. Deploy no Netlify

Arraste a pasta `dist/` para: https://app.netlify.com/drop

**Pronto! Site no ar!** 🎉

---

## 📋 Ou siga o Passo a Passo Completo

### Opção A: GitHub + Netlify (Deploy Automático)

```bash
# 1. Criar repo no GitHub: https://github.com/new

# 2. Subir código
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/color2hanzi.git
git push -u origin main

# 3. No Netlify:
# - Import from GitHub
# - Escolher repo 'color2hanzi'
# - Deploy!
```

### Opção B: Upload Manual

```bash
npm install
npm run build
# Arraste pasta 'dist/' no Netlify
```

---

## 📁 Arquivos Importantes

✅ `netlify.toml` - Config de build  
✅ `public/_redirects` - SPA routing  
✅ `vite.config.ts` - Base path `/`

---

## 🌐 URLs

**Temporária**: `https://random-name.netlify.app`  
**Customizada**: Settings → Domain → Change site name

---

## 📚 Guias Completos

- **NETLIFY_DEPLOY.md** - Deploy detalhado  
- **EXPORT_GUIDE.md** - Como exportar e GitHub  
- **README.md** - Documentação completa

---

**Qualquer dúvida, veja os guias acima! 🚀**
