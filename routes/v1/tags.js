'use strict';

const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Anuncio');

//Peticion a /v1/anuncios
//Devuelve  una lista de anuncios
router.get('/', async(req, res, next) => {
    try {

        const tags = await Anuncio.distinct('tags');

        res.status(200).json({
            status: 200,
            message: 'OK',
            body: tags
        });

    } catch (err) {
        next(err);
    }
});

module.exports = router;