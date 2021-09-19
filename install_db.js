'use strict';

//Conexión a la base de datos
const dbConnection = require('./lib/connectMongoose');

//Modelo de agentes
const Anuncio = require('./models/Anuncio');
const anuncioData = require('./anunciosIniciales.json');

main().catch(err => console.log('Hubo un error', err));

async function main() {
    await initAnuncios();
    dbConnection.close();
};

async function initAnuncios() {
    //Elimino todos los documentos de la colección de agentes
    const deleted = await Anuncio.deleteMany();
    console.log(`Eliminados ${deleted.deletedCount} anuncios`);

    //Crear agentes iniciales
    console.log(anuncioData);
    const anuncios = await Anuncio.insertMany(anuncioData.anuncios);
    console.log(`Creados ${anuncios.length} anuncios`);
}