# 🚀 Todo List Profissional

Uma aplicação web moderna de gerenciamento de tarefas, com suporte a subtarefas, drag-and-drop, filtros, paginação e interface responsiva.

---

## 📌 Sobre o projeto

Este projeto é uma aplicação **Fullstack (Frontend + Backend)** desenvolvida com foco em boas práticas, experiência do usuário e arquitetura escalável.

A aplicação permite ao usuário gerenciar tarefas de forma eficiente, organizando-as em três estados:

* 📝 A Fazer
* ⚙️ Fazendo
* ✅ Feito

---

## ✨ Funcionalidades

### 🔹 Gerenciamento de tarefas

* Criar tarefas
* Editar tarefas
* Deletar tarefas
* Alterar status (drag and drop)

### 🔹 Subtarefas

* Adicionar subtarefas
* Marcar como concluída
* Deletar subtarefa
* Barra de progresso automática

### 🔹 Interface e UX

* Drag and Drop entre colunas
* Feedback visual com Toasts
* UI moderna (dark mode)
* Componentização com React

### 🔹 Filtros e busca

* Buscar tarefas por texto
* Filtrar por status
* Atualização automática da listagem

### 🔹 Paginação

* Navegação entre páginas
* Controle de limite de dados

### 🔹 Responsividade

* Compatível com:

  * 📱 Mobile (iPhone SE, iPhone 12)
  * 📱 Tablets (iPad)
  * 💻 Desktop

---

## 🛠️ Tecnologias utilizadas

### Frontend

* React
* Vite
* JavaScript (ES6+)
* CSS (estilização customizada)

### Bibliotecas

* @dnd-kit/core → Drag and Drop
* react-hot-toast → Notificações
* Axios → Requisições HTTP

### Backend (integrado)

* API REST (Node.js / NestJS)
* Comunicação via HTTP (GET, POST, PATCH, DELETE)

---

## 🧠 Conceitos aplicados

* CRUD completo
* UI otimista (atualização instantânea)
* Separação de responsabilidades
* Componentização
* Gerenciamento de estado com hooks
* Boas práticas de API REST
* Responsividade com Flexbox

---

## 📂 Estrutura do projeto

```
src/
│
├── components/
│   ├── TaskCard.jsx
│   ├── Button.jsx
│   ├── EditModal.jsx
│
├── services/
│   └── api.js
│
├── App.jsx
├── App.css
└── main.jsx
```

---

## ⚙️ Como rodar o projeto

### 🔹 1. Clone o repositório

```
git clone https://github.com/seu-usuario/seu-repo.git
```

---

### 🔹 2. Acesse a pasta

```
cd seu-repo
```

---

### 🔹 3. Instale as dependências

```
npm install
```

---

### 🔹 4. Rode o projeto

```
npm run dev
```

---

## 🌐 Backend

Certifique-se de que a API esteja rodando corretamente.

Exemplo:

```
http://localhost:3000
```

---

## 🔐 Variáveis de ambiente

Crie um arquivo `.env` se necessário:

```
VITE_API_URL=http://localhost:3000
```

---

## 📸 Demonstração

Funcionalidades principais:

* Drag and Drop entre colunas
* Controle de subtarefas
* Barra de progresso
* Interface responsiva

---

## 🚀 Melhorias futuras

* Autenticação de usuários
* Deploy em produção (Vercel + Render)
* Dark/Light mode toggle
* PWA (instalável no celular)
* Testes automatizados

---

## 👨‍💻 Autor

Desenvolvido por **Andeson Almeida**

---

## 📄 Licença

Este projeto está sob a licença MIT.
