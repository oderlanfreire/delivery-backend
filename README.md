#### README
- [link dos pontos do projeto no Notion ](https://fish-tartan-78e.notion.site/Projeto-AP1-Estagio-a8d3922f372f41069d61df37c6f9cebb)

# Delivery Backend

Este projeto consiste em uma API backend para um sistema de gerenciamento de entregas. Ele foi desenvolvido para facilitar a administração de pedidos, entregas, e gerenciar a interação com entregadores, clientes e restaurantes.

## Funcionalidades

- Gerenciamento de pedidos
- Controle de entregas
- Autenticação de usuários (clientes e restaurantes)
- Registro de status de pedidos
- Integração com cardápios de restaurantes

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript
- **Express**: Framework web para Node.js
- **MySQL**: Banco de dados relacional, via `mysql2`
- **Sequelize**: ORM para interação com o banco de dados MySQL
- **JWT**: Para autenticação e gerenciamento de sessões
- **bcryptjs**: Para criptografia de senhas
- **Swagger**: Documentação interativa da API

## Estrutura do Projeto

- `controller/`: Contém os controladores que gerenciam a lógica de negócios.
  - `cliente.Controller.js`: Controla o registro, autenticação e dados do cliente.
  - `pedidoController.js`: Gerencia pedidos, incluindo criação e atualização.
  - `restauranteController.js`: Controla o cadastro e autenticação de restaurantes.
  
- `models/`: Modelos de dados utilizados no projeto.
  - `cliente.Model.js`: Define o modelo do cliente no banco de dados.
  - `pedido.Model.js`: Define o modelo de pedidos no banco de dados.
  - `restaurante.Model.js`: Define o modelo de restaurante no banco de dados.
  
- `routes/`: Define as rotas da API, conectando endpoints aos controladores.

## Configuração do Ambiente

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/delivery-backend.git
   ```

2. Acesse o diretório do projeto:
  ```bash
   cd delivery-backend
   ```
3. Instale as dependências:
  ```bash
 npm install
```

4. Crie um arquivo .env baseado no arquivo .env.example e preencha as variáveis de ambiente necessárias (como a string de conexão com o banco de dados):
  ```bash
   cp .env.example .env
  ```

Exemplos de variáveis de ambiente:
 ```bash
DB = 'nome do banco'
USER = 'usuario'
PASS = 'senha'
DIALECT = 'banco'

SECRET = 'palavra_secreta'
JWT_EXPIRES_IN = '2h'
 ```

5. Inicie o servidor:
```bash
 npm start
```

6. A API estará disponível em http://localhost:3000


 

   
