# 🚀 Guia Rápido de Deploy - Color2Hanzi

## Comandos Essenciais

### 🆕 Primeiro Deploy

```bash
# 1. Criar repositório no GitHub primeiro em: https://github.com/new

# 2. Inicializar e subir código
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/color2hanzi.git
git push -u origin main

# 3. Instalar dependências
npm install

# 4. Deploy
npm run deploy

# 5. Ativar no GitHub:
# Settings → Pages → Branch: gh-pages → Save
```

### 🔄 Atualizações Futuras

```bash
git add .
git commit -m "descrição das mudanças"
git push
npm run deploy
```

## 📝 Checklist

- [ ] Repositório criado no GitHub
- [ ] Nome do repositório configurado no `vite.config.ts`
- [ ] Git inicializado e código enviado
- [ ] `npm install` executado
- [ ] `npm run deploy` executado
- [ ] GitHub Pages ativado (Settings → Pages)
- [ ] Site acessível em `https://SEU_USUARIO.github.io/color2hanzi/`

## ⚙️ Arquivo de Configuração

### vite.config.ts

```typescript
export default defineConfig({
  base: '/color2hanzi/', // ⚠️ MUDE AQUI se o nome do repo for diferente
  // ...
});
```

### Para domínio personalizado

```typescript
export default defineConfig({
  base: '/', // Use '/' para domínio customizado
  // ...
});
```

## 🌐 URLs

- **GitHub Pages padrão**: `https://SEU_USUARIO.github.io/color2hanzi/`
- **Domínio customizado**: `https://color2hanzi.com` (após configurar DNS)

## 🔍 Verificar Status do Deploy

```bash
# Ver branches
git branch -a

# Ver último commit
git log --oneline -5

# Ver remote
git remote -v
```

## 📞 Problemas?

1. **Site não aparece**: Aguarde 2-3 minutos após deploy
2. **Erro 404**: Verifique o `base` no `vite.config.ts`
3. **Push negado**: Configure token pessoal do GitHub
4. **Build falha**: Rode `npm install` novamente

---

**Pronto! Seu site estará no ar em minutos! 🎉**
