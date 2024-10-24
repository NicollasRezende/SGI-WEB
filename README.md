# Sistema de Gerenciamento de Inventário (SGI-WEB)

## Visão Geral

O **SGI-WEB** é um sistema web projetado para gerenciar usuários e produtos de um inventário, com operações de adição, atualização e remoção. O sistema é composto por uma interface de administração de usuários, uma interface de gerenciamento de produtos, e está integrado a um banco de dados PostgreSQL para armazenar as informações. O projeto foi desenvolvido utilizando **Node.js**, **Express.js** no back-end, **PostgreSQL** como banco de dados, e **Railway** para hospedagem do banco de dados. O front-end foi criado utilizando **HTML**, **CSS**, e **JavaScript**.

## Estrutura de Pastas

```
SGI-WEB/
│
├── css/
│   ├── styles-adm.css
│   ├── styles-inv.css
│   ├── styles-login.css
│   └── styles.css
│
├── img/
│   ├── config-icon.png
│   └── inventory-icon.png
│
├── js/
│   ├── scripts-adm.js
│   └── scripts-inv.js
│
├── node_modules/ (conteúdos do Node.js)
│
├── routes/
│   ├── products.js
│   └── users.js
│
├── config.html
├── db.js
├── index.html
├── inventario.html
├── login.html
├── package-lock.json
├── package.json
└── server.js
```

## Tecnologias Utilizadas

- **Front-end**: HTML, CSS, JavaScript
- **Back-end**: Node.js, Express.js
- **Banco de Dados**: PostgreSQL (hospedado via Railway)
- **Serviços**: Railway (hospedagem do banco de dados)
  
## Funcionalidades Principais

### Administração de Usuários

Permite adicionar, remover, e atualizar usuários no sistema.

#### API Endpoints para Usuários

1. **Listar todos os usuários**
   - **Método**: GET
   - **URL**: `/api/users/all`
   
2. **Adicionar um novo usuário**
   - **Método**: POST
   - **URL**: `/api/users/add`
   - **Body**:
     ```json
     {
       "username": "novoUsuario",
       "password": "senha123",
       "user_type": "admin"
     }
     ```

3. **Atualizar um usuário**
   - **Método**: PUT
   - **URL**: `/api/users/update/{id}`
   - **Body**:
     ```json
     {
       "username": "usuarioAtualizado",
       "password": "novaSenha",
       "user_type": "admin"
     }
     ```

4. **Remover um usuário**
   - **Método**: DELETE
   - **URL**: `/api/users/remove/{id}`

5. **Buscar um usuário por ID**
   - **Método**: GET
   - **URL**: `/api/users/id/{id}`

### Gerenciamento de Produtos

O sistema também permite a adição, remoção e atualização de produtos no inventário.

#### API Endpoints para Produtos

1. **Listar todos os produtos**
   - **Método**: GET
   - **URL**: `/api/products/all`

2. **Adicionar um novo produto**
   - **Método**: POST
   - **URL**: `/api/products/add`
   - **Body**:
     ```json
     {
       "name": "Produto Teste",
       "description": "Descrição do Produto",
       "quantity": 100,
       "price": 49.99,
       "location": "Estoque Principal"
     }
     ```

3. **Atualizar um produto**
   - **Método**: PUT
   - **URL**: `/api/products/update/{id}`
   - **Body**:
     ```json
     {
       "name": "Produto Atualizado",
       "description": "Nova descrição",
       "quantity": 200,
       "price": 59.99,
       "location": "Novo Estoque"
     }
     ```

4. **Remover um produto**
   - **Método**: DELETE
   - **URL**: `/api/products/remove/{id}`

### Banco de Dados

O banco de dados foi configurado no **PostgreSQL**, hospedado no **Railway**. Abaixo estão os esquemas das tabelas:

#### Tabela `users`

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    user_type VARCHAR CHECK (user_type IN ('comum', 'admin')) NOT NULL
);
```

#### Tabela `products`

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    location VARCHAR NOT NULL
);
```

#### Tabela `inventory_logs`

```sql
CREATE TABLE inventory_logs (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    change_type VARCHAR CHECK (change_type IN ('adição', 'remoção')) NOT NULL,
    quantity INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    user_type VARCHAR CHECK (user_type IN ('comum', 'admin')) NOT NULL
);
```

## Back-end

O back-end foi desenvolvido com **Node.js** e utiliza **Express.js** como framework para criação de rotas e manipulação de dados.

### Estrutura do Back-end

#### Conexão ao Banco de Dados (`db.js`)

```js
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgres://<your_connection_string>',
});

module.exports = pool;
```

#### Roteamento de Produtos (`routes/products.js`)

As rotas de produtos permitem listar, adicionar, atualizar e remover produtos do inventário. Todas as rotas utilizam o PostgreSQL para armazenar e recuperar dados.

#### Roteamento de Usuários (`routes/users.js`)

As rotas de usuários gerenciam operações como login, adicionar, atualizar e remover usuários, todas interagindo com o banco de dados.

### Servidor (`server.js`)

O servidor é responsável por iniciar a aplicação e servir as páginas HTML.

```js
const express = require('express');
const path = require('path');
const pool = require('./db');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname)));

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
```

## Front-end

O front-end do sistema foi implementado em **HTML**, **CSS**, e **JavaScript**. Ele permite a interação com os dados do back-end através de requisições para a API.

- **scripts-adm.js**: Controla as operações relacionadas a usuários.
- **scripts-inv.js**: Gerencia as funcionalidades de produtos.

## Execução

1. Clone o repositório do GitHub.
2. Instale as dependências do projeto:
   ```bash
   npm install
   ```
3. Configure o banco de dados PostgreSQL.(Ou pule isso e inicie o serviço normalmente caso não tenha um DB configurado)
   
4. Inicie o servidor local:
   ```bash
   npm start
   ```

O sistema estará disponível em `http://localhost:3000`.

---
