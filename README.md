# About the project

This API was developed for a full-stack challenge. This is the backend and frontend of a e-commerce app.
In this file you will find how to install and run the application.

## Prerequisites
- Node.js (v18+)
- Git
- [Postman](https://www.postman.com/) (for testing)

## Setup

1. **Clone the repository**

```bash
git clone https://github.com/username/loja-backend.git
cd loja-backend
```

2. **Install the dependencies**

```bash
npm install
```

3. **Create the .env**

Create a .env file in the root dir and add:
```bash
DATABASE_URL="file:./dev.db"
ACCESS_KEY="minha_chave_secreta"
```

4. **Setup the DataBase**

```bash
npx prisma migrate dev --name init
```
```bash
npx prisma db seed
```

5. **Run the server**

```bash
npm run dev
```

6. **Open the application**

Open the folder /public via terminal, then run a simple static server.
_Make sure that the API is running before using the frontend_

```bash
cd public
```

```bash
npx serve .
```

_To stop the servers press Ctrl + C on the terminal_

## Technologies Used

- Node.js
- TypeScript
- Express
- SQLite
- Prisma ORM
- JWT
- Dotenv
- Bcrypt