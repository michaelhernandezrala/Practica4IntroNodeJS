'use strict'

const mongoose = require('mongoose');

//Definimos un esquema
const anuncioSchema = mongoose.Schema({
    nombre: String,
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: [],
});

//, skip, limit, select, page, sort, start

anuncioSchema.statics.lista = function(filtros, sort, start, limit, select) {
    let precio = '';

    if (typeof filtros.precio === 'string') {
        precio = filtros.precio;
    } else if (filtros.precio && filtros.precio.precioMin && filtros.precio.precioMax === '') {
        precio = { '$gte': filtros.precio.precioMin }
    } else if (filtros.precio && filtros.precio.precioMin && filtros.precio.precioMax === '') {
        precio = { '$gte': filtros.precio.precioMax }
    } else if (filtros.precio && filtros.precio.precioMin && filtros.precio.precioMax) {
        precio = { '$gte': filtros.precio.precioMin, '$lte': filtros.precio.precioMax }
    } else {
        precio = { $exists: true }
    }

    let query = Anuncio.find({
        nombre: filtros.nombre ? new RegExp(".*" + filtros.nombre + ".*", "i") : new RegExp(".*", "i"),
        venta: filtros.venta ? filtros.venta : { $exists: true },
        precio: precio,
        foto: filtros.foto ? new RegExp(".*" + filtros.foto + ".*", "i") : new RegExp(".*", "i"),
        tags: filtros.tags ? filtros.tags : { $exists: true },
    });

    query.skip(start).sort({ sort: -1 }).limit(limit).select(select);
    return query.exec();
}

//Creamos el modelo
const Anuncio = mongoose.model('Anuncio', anuncioSchema);

//Exportamos el modelo
module.exports = Anuncio;