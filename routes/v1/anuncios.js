'use strict';

const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Anuncio');

//Peticion a /v1/anuncios
//Devuelve  una lista de anuncios
router.get('/', async(req, res, next) => {
    try {
        const nombre = req.query.nombre;
        const venta = req.query.venta;
        const precio = req.query.precio;
        const foto = req.query.foto;
        const tags = req.query.tags;

        const sort = req.query.sort;
        const start = parseInt(req.query.start);
        const limit = parseInt(req.query.limit);
        const select = req.query.select;

        const filtros = {};

        if (nombre) {
            filtros.nombre = nombre;
        }
        if (venta) {
            filtros.venta = venta;
        }
        if (precio && precio.includes('-')) {
            const rangosPrecios = precio.split('-');
            const precioMin = rangosPrecios[0];
            const precioMax = rangosPrecios[1];

            filtros.precio = { precioMin, precioMax }
            console.log(precioMin);
            console.log(precioMax);
        }
        if (precio && !precio.includes('-')) {
            filtros.precio = precio
        }
        if (foto) {
            filtros.foto = foto;
        }
        if (tags) {
            filtros.tags = tags;
        }

        console.log('filtros', filtros);

        const anuncios = await Anuncio.lista(filtros, sort, start, limit, select);

        if (anuncios.length === 0) {
            res.json({
                body: "No hay elementos que coincidan con la busqueda realizada"
            });
            return;
        }

        res.render('anuncios', { title: 'Lista de anuncios', anuncios });

    } catch (err) {
        next(err);
    }
});

//Peticion a /v1/anuncios
//Obtener un anuncio
router.get('/:id', async(req, res, next) => {
    try {
        const _id = req.params.id;

        const anuncio = await Anuncio.find({ _id: _id });

        res.render('anuncio', { title: anuncio.nombre, anuncio });

    } catch (err) {
        next(err);
    }
});

//Peticion a /v1/anuncios (body)
//Crear un anuncio
router.post('/', async(req, res, next) => {
    try {
        const anuncioData = req.body;

        const anuncio = new Anuncio(anuncioData); //Creo un objeto de tipo Agente EN MEMORIA
        const anuncioCreado = await anuncio.save();
        res.status(201).json({ status: 201, message: 'OK', body: anuncioCreado });
    } catch (err) {
        next(err);
    }
});

//Peticion a /v1/anuncio:id (body)
//Borra un anuncio
router.delete('/:id', async(req, res, next) => {
    try {
        const _id = req.params.id;

        await Anuncio.deleteOne({ _id: _id });
        res.status(200).json({
            status: 200,
            message: 'Anuncio eliminado con con éxito'
        })
    } catch (err) {
        next(err);
    }
});

//Peticion a /v1/anuncio:id (body)
//Edita un anuncio
router.put('/:id', async(req, res, next) => {
    try {
        const _id = req.params.id;
        const anuncioData = req.body;

        const anuncioActualizado = await Anuncio.findOneAndUpdate({
            _id: _id
        }, anuncioData, {
            new: true //Esto es para que me devuelva el estado final del documento
        });

        if (!anuncioActualizado) {
            res.status(404).json({ error: 'not found' });
            return;
        };

        res.status(201).json({
            status: 201,
            message: 'OK',
            body: anuncioActualizado
        });
    } catch (err) {
        next(err);
    }
});

//Peticion a /v1/anuncio/tags
//Obtiene los tags
router.get('/tags', (req, res, next) => {

});

module.exports = router;