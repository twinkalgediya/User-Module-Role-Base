# Role-Based Access Control (RBAC) API

This project is a **Node.js + Express REST API** with MongoDB (Mongoose) implementing **Authentication**, **Role-Based Access Control (RBAC)**, and **User Management**.  
It follows clean architecture with controllers, services, models, and middlewares.


## 🚀 Features

### 🔐 Authentication
- **Signup & Login** APIs
- JWT-based authentication
- Secure password hashing (bcrypt)

### 👥 Users
- List users with **search + pagination**
- View user details
- Update multiple users:
  - **Bulk same update** (`PATCH /users/bulk-update`)
  - **Bulk different update** (`POST /users/bulk-diff`)
- Delete user (soft delete or permanent delete, depending on config)



### ⚙️ Middleware
- **Authentication Middleware** → checks JWT
- **Role Middleware** → verifies role access when required
- **Validation Middleware** → uses `express-validator` for request validation
- **Global Error Middleware** → unified error handling with proper messages


## 🛠️ Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT (JSON Web Tokens)**
- **Express Validator** for validation
- **Bcrypt** for password hashing
- **TypeScript** (recommended)


### 1. Clone repository
```bash
git clone <repo-url>
cd project-folder
npm install

Change .env

npm run dev