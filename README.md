# 🚀 create-express-mongodb-boiler

A powerful CLI tool to quickly scaffold a production-ready **Express + MongoDB boilerplate** with best practices, clean architecture, and essential features.

---

## 📦 Features

✨ One-command project setup
⚡ Pre-configured Express server
🗄️ MongoDB with Mongoose integration
🔐 JWT Authentication system
🧱 Clean MVC architecture
✅ Request validation using Joi
🛡️ Centralized error handling
📧 Email service setup
👤 Admin seeder script
📂 Modular & scalable folder structure
🔧 Environment-based configuration
🚀 Production-ready setup
🔐 Auth functionality

---

## ⚡ Quick Start

### Using npx (Recommended)

```bash
npx create-express-mongodb-boiler my-app
```

> No installation required. Always uses the latest version.

---

### Using npm

```bash
npm init -y
npm i create-express-mongodb-boiler
```
After installation, you can find the boilerplate files inside:
```
node_modules/create-express-mongodb-boiler/
```

---

## 📁 Project Structure

```
my-app/
│
├── src/
│   ├── config/        # App configuration (DB, logger, etc.)
│   ├── controllers/   # Business logic
│   ├── db/            # Database connection
│   ├── middlewares/   # Auth, error handling, validation
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── services/      # External services (email, etc.)
│   ├── seeder/        # Seed scripts
│   ├── utils/         # Helper functions
│   ├── validations/   # Joi validation schemas
│   └── index.js       # Entry point
│
├── .env.example
├── package.json
└── README.md
```

---

## 🛠️ Installation Steps (After Setup)

```bash
cd my-app
cp .env.example .env
npm install
npm run dev
```

---

## 🌐 Environment Variables

Create a `.env` file and configure:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
EMAIL_HOST=smtp_host
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

---

## 🔐 Authentication

* JWT-based authentication
* Secure route protection middleware
* Login / Register APIs included

---

## 📡 API Modules Included

* Auth APIs (Login / Register)
* User management
* Admin seeding
* Email service integration

---

## 🧪 Scripts

```bash
npm run dev      # Start development server
npm start        # Start production server
npm run seed     # Seed admin data
```

---

## 📌 Requirements

* Node.js >= 14.x
* npm >= 6.x

---

## 💡 Why use this?

Instead of setting up:

* Express server
* MongoDB connection
* Auth system
* Folder structure

👉 This CLI does everything in seconds ⚡

---

## 📸 Example Usage Flow

```
npx create-express-mongodb-boiler my-app
cd my-app
npm install
npm run dev
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create your feature branch
3. Commit changes
4. Open a pull request

---

## 🧑‍💻 Author

**Mayur Dodiya**

---

## 📄 License

MIT License © 2026

---

## ⭐ Support

If you like this project:

👉 Star the repo
👉 Share with developers
👉 Contribute improvements

---

## 🚀 Future Improvements

* TypeScript support
* Docker setup
* Role-based access control
* Swagger API documentation
* Microservice-ready structure

---

## Version Requirements
- Node.js >= 14.x
- npm >= 6.x

---

🔥 Built to save developers time and boost productivity.
