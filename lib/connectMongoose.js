'use strict';

const mongoose = require('mongoose');
const conn = mongoose.connection;

// Evitar warning deprecated:
mongoose.set('useFindAndModify', false);

conn.on('error', err => {
    console.log('Error de conexión:', err);
    process.exit(1);
});

conn.once('open', () => {
    console.log('Conectado a MongoDB en', mongoose.connection.name);
});

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser:true});

module.exports = conn;