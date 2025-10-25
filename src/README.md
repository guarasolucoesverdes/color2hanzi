# Color2Hanzi 🎨

Uma ferramenta gratuita para colorir caracteres Pinyin e Hanzi por tons, facilitando o aprendizado de chinês.

## 🚀 Deploy no Vercel (Recomendado)

### ⚡ Método Rápido (2 minutos)

1. **Criar repositório no GitHub:** https://github.com/new
   - Nome: `color2hanzi`
   - Público

2. **Subir código:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/color2hanzi.git
   git push -u origin main
   ```

3. **Deploy no Vercel:**
   - Acesse: https://vercel.com/new
   - Import Git Repository
   - Selecione `color2hanzi`
   - Deploy! 🚀

4. **Site no ar em:** `https://color2hanzi.vercel.app`

📖 **Guia completo:** Veja [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)

---

## 🌐 Domínio Personalizado

### Vercel (Recomendado)

No painel da Vercel:
- **Settings** → **Domains** → **Add**
- Digite: `color2hanzi.com`
- Configure DNS no registrador:
  ```
  CNAME: www → cname.vercel-dns.com
  A: @ → 76.76.21.21
  ```
- HTTPS configurado automaticamente! ✅

---

## 🔄 Deploy Contínuo (Automático)

Com Vercel + GitHub conectados:

```bash
git add .
git commit -m "descrição das mudanças"
git push
# Vercel faz deploy automaticamente! 🚀
```

---

## 💻 Desenvolvimento Local

```bash
# Rodar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

---

## 🛠️ Tecnologias

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS 4.0
- Lucide React (ícones)
- html2canvas (screenshots)

---

## ❓ Problemas Comuns

### "Permission denied" ao fazer push
```bash
# Use HTTPS com token pessoal ou configure SSH
git remote set-url origin https://github.com/SEU_USUARIO/color2hanzi.git
```

### Site não aparece após deploy
- Aguarde 2-3 minutos
- Verifique se a branch `gh-pages` foi criada
- Confirme que o GitHub Pages está ativado em Settings → Pages

### Erro 404 no site
- Verifique se o `base` no `vite.config.ts` corresponde ao nome do repositório
- O formato correto é: `base: '/nome-do-repositorio/',`

---

## 📄 Licença

Projeto de código aberto disponível gratuitamente para estudantes de chinês.

**Feito com ❤️ para estudantes de mandarim**
