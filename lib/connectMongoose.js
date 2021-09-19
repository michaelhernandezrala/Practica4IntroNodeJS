'use strict';

const mongoose = require('mongoose');

//Emite eventos
mongoose.connection.on('error', err => {
    console.log('Error de conexión', err);

    //Paramos la aplicación en caso de no poder conectarme a la base de datos
    process.exit(1);
}, {
    collection: 'anuncios'
});

mongoose.connection.once('open', () => {
    console.log('Conectado a MongoDB a la DB:', mongoose.connection.name);
})

//Me conecto a la base de datos
mongoose.connect('mongodb://localhost/nodepop', {});

module.exports = mongoose.connection;