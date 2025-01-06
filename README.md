# Library Management API

A backend API for managing a library system, built with Express.js and MongoDB. This system supports user authentication, book management, and administrative operations.

## Table of Contents
- [Features](#features)
- [Directory Structure](#directory-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features
- **User Authentication**: Sign-up, login, and token-based authentication.
- **Book Management**: CRUD operations for books, authors, genres, and publishers.
- **Admin Operations**: Manage users, books, and other library entities with administrative privileges.
- **Membership Tracking**: Handles user memberships and loan records.
- **RESTful API**: Clean and modular API structure.

## Directory Structure
```
khanhhlee05-Book_DB_BackEnd_API/
├── README.md                 # Project documentation
├── index.mjs                 # Application entry point
├── package.json              # Project dependencies and scripts
├── middlewares/              # Middleware logic
│   └── authMiddlewares.mjs   # Authentication and authorization middleware
├── mongoose/
│   └── schemas/              # Mongoose schemas for database entities
│       ├── author.mjs
│       ├── comment.mjs
│       ├── genre.mjs
│       ├── item.mjs
│       ├── loan.mjs
│       ├── publisher.mjs
│       ├── review.mjs
│       └── user.mjs
├── routes/                   # API route handlers
│   ├── auth.mjs
│   ├── authors.mjs
│   ├── genres.mjs
│   ├── index.mjs
│   ├── items.mjs
│   ├── publishers.mjs
│   ├── users.mjs
│   └── admin/                # Admin-specific route handlers
│       ├── ad_authors.mjs
│       ├── ad_genres.mjs
│       ├── ad_items.mjs
│       ├── ad_publishers.mjs
│       └── ad_users.mjs
└── utils/
    └── users.mjs             # Utility functions
```

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/khanhhlee05/Book_DB_BackEnd_API.git
   cd Book_DB_BackEnd_API
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the required environment variables (see [Environment Variables](#environment-variables)).

## Usage
To start the development server:
```bash
npm run start:dev
```
The server will run on `http://localhost:3000` by default.

## Environment Variables
The following environment variables are required:
- `PORT`: The port number to run the server.
- `MONGO_URI`: MongoDB connection URI.
- `JWT_SECRET`: Secret key for JWT token encryption.

Example `.env` file:
```plaintext
PORT=3000
MONGO_URI=mongodb://localhost/library-system
JWT_SECRET=my-ultimate-secret
```

## API Endpoints
### Authentication
- **POST /api/auth/signup**: User registration.
- **POST /api/auth/login**: User login and token generation.
- **GET /api/auth/logout**: User logout.

### Users
- **GET /api/me**: Retrieve user details.
- **PATCH /api/me**: Update user profile.
- **DELETE /api/me**: Delete user account.

### Books
- **GET /api/items**: List all books.
- **GET /api/items/:id**: Retrieve details of a specific book.

### Admin
- **POST /api/admin/items**: Add a new book.
- **PATCH /api/admin/items/:id**: Update book details.
- **DELETE /api/admin/items/:id**: Delete a book.

_For a full list of endpoints, refer to the source code in the `routes/` directory._

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m "Add feature"`).
4. Push to the branch (`git push origin feature-name`).
5. Create a pull request.


