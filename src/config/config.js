module.exports = {
    PORT: process.env.PORT || 5000,
    MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017/demo',
    JWT_SECRET: process.env.JWT_SECRET || 'mysecretkey',
    EXPIRES_IN: process.env.EXPIRES_IN || '10h',
    ADMIN: {
        NAME: process.env.NAME || "Admin",
        EMAIL: process.env.ADMIN_EMAIL || "admin@gmail.com",
        PASSWORD: process.env.ADMIN_PASSWORD || "Admin@123",
    }
}