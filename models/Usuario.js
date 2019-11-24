'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var usuarioSchema = mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
}, {collection: 'usuarios'}); // Evitamos la pluralización

usuarioSchema.statics.hashPassword = function(plainPassword)
{
    return bcrypt.hash(plainPassword, 10);
}

const Usuario = mongoose.model('usuarios', usuarioSchema);
// Buscará usuarios (pluralizando)

module.exports = Usuario;