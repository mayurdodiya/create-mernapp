const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require('../config/config');

module.exports = {
    create: async (model, data, additional = undefined) => {
        return model.create(data, additional || undefined)
    },
    update: async (model, query, data, additional = undefined) => {
        return model.update(data, query, additional || undefined)
    },
    delete: async (model, query, additional = undefined) => {
        return model.destroy(query, additional || undefined)
    },
    get: async (model, query, additional = undefined) => {
        return model.findOne(query, additional || undefined)
    },
    getAll: async (model, query) => {
        return model.findAll({ ...query })
    },
    generateHashPassword: async (myPassword) => {
        return await bcrypt.hashSync(myPassword, 10)
    },
    passwordCompare: async (myPassword, hash, additional = undefined) => {
        return await bcrypt.compareSync(myPassword, hash, additional || undefined)
    },
    generateToken: (userId, role) => {
        let token = jwt.sign({ userId: userId, role: role }, config.JWT_SECRET, { expiresIn: config.EXPIRES_IN });
        return token;
    },
    decodeToken: ({ token }) => {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        return decoded;
    },
};
