# Color2Hanzi 🎨

Uma ferramenta gratuita para colorir caracteres Pinyin e Hanzi por tons, facilitando o aprendizado de chinês.

## 🚀 Deploy no GitHub Pages (Método Simples)

### ✅ Pré-requisitos
- Conta no GitHub
- Git instalado no computador
- Node.js instalado

---

## 📦 Passo a Passo Completo

### 1️⃣ Criar Repositório no GitHub

1. Acesse https://github.com/new
2. **Nome do repositório**: `color2hanzi` (ou o nome que preferir)
3. Deixe como **Public**
4. **NÃO** marque "Initialize with README"
5. Clique em **Create repository**

### 2️⃣ Subir o Código para o GitHub

Abra o terminal/prompt na pasta do projeto e execute:

```bash
git init
git add .
git commit -m "Initial commit - Color2Hanzi"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/color2hanzi.git
git push -u origin main
```

⚠️ **IMPORTANTE**: Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub!

### 3️⃣ Instalar Dependências

```bash
npm install
```

### 4️⃣ Fazer Deploy

```bash
npm run deploy
```

Este comando vai:
- Criar uma versão otimizada do site
- Criar uma branch `gh-pages` automaticamente
- Fazer o upload para o GitHub

### 5️⃣ Ativar GitHub Pages

1. Vá para o repositório no GitHub
2. Clique em **Settings** (Configurações)
3. No menu lateral esquerdo, clique em **Pages**
4. Em **Branch**, selecione `gh-pages` → **/(root)** → **Save**

### 6️⃣ Acessar o Site

Após 1-2 minutos, seu site estará disponível em:

```
https://SEU_USUARIO.github.io/color2hanzi/
```

---

## 🔧 Configurações Importantes

### Se o nome do repositório for diferente de `color2hanzi`

Edite o arquivo `vite.config.ts` na linha 7:

```typescript
base: '/SEU_NOME_DO_REPOSITORIO/',
```

### Para usar domínio personalizado (color2hanzi.com)

1. Compre um domínio
2. No GitHub Pages Settings, adicione o domínio customizado
3. Configure DNS no registrador:
   - **Tipo A** para:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - **OU tipo CNAME** para: `SEU_USUARIO.github.io`

4. Mude o `vite.config.ts`:
```typescript
base: '/', // Para domínio customizado
```

---

## 🔄 Atualizar o Site (Após Mudanças)

```bash
git add .
git commit -m "Descrição das mudanças"
git push
npm run deploy
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
