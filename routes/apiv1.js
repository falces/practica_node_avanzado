'use strict';

const express = require('express');
const router = express.Router();
const multer  = require('multer');
const cote = require('cote');

const requester = new cote.Requester({
    name: 'thumbnail microservice'
});

// Carga del modelo
const apiv1 = require('../models/APIv1');

// Middleware de Autenticación
const jwtAuth = require('../lib/jwtAuth');

router.get('/anuncios', jwtAuth(), async (req, res, next) => {
    try{
        const tag = req.query.tag;
        const venta = req.query.venta;
        const nombre = req.query.nombre;
        const precio = req.query.precio;
        const start = parseInt(req.query.start);
        const limit = parseInt(req.query.limit);
        const sort = req.query.sort;

        const filter= {};
        if(nombre) filter.nombre = new RegExp('^'+nombre);
        if(venta) filter.venta = venta;
        if(precio) filter.precio = priceFilterToMongo(precio);
        if(tag) filter.tags = { $in: tagFilter(tag) };

        const anuncios = await apiv1.list({filter, start, limit, sort});
        res.json({
            success:true,
            anuncios: anuncios
        });
    }catch(error){
        next(error);
    }
});

router.get('/tags', async (req, res, next) => {
    try{
        let sort = '_id';
        const items = await apiv1.categories({sort});
        let arrayTags = [];
        items.forEach(item => {
            item.tags.forEach(tag => {
                arrayTags.push(tag);
            });
        });
        let uniqueTags = arrayTags.filter( (value, index, self) => { 
            return self.indexOf(value) === index;
        } );
        res.json({
            success:true,
            tags: uniqueTags
        });
    }catch(error){
        next(error);
    }
});

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/nuevo', jwtAuth(), upload.single("imagen"), async (req, res, next) => {
    try{
        const nombre = req.body.nombre;
        const tags = req.body.tags;
        const precio = req.body.precio;
        const imagen = req.file.filename;
        const venta = req.body.venta;

        let error = '';
        let success = true;
        
        if(!nombre){
            success = false,
            error += 'Falta el nombre del artículo. '
        }
        if(!tags){
            success = false,
            error += 'Falta la categoría del artículo. '
        }
        if(!precio){
            success = false,
            error += 'Falta el precio del artículo. '
        }
        if(!venta){
            success = false,
            error += 'Debes indicar si compras o vendes el artículo. '
        }
        if(!imagen){
            success = false,
            error += 'Falta la imagen del artículo. '
        }
        if(!success){
            res.json({
                success:false,
                error: error
            });
        }else{
            req.body.foto = imagen;

            requester.send(
                {
                    type: 'createThumb',
                    file: `./uploads/${imagen}`,
                    fileName: req.file.filename
                },
                response => {
                    console.log(`Thumbnail Service: ${response}`);
                }
            );

            const upload = multer({ dest: './uploads/' });
            const datos = req.body;
            const anuncio = new apiv1(datos);
            const nuevo = await anuncio.save();
            res.json({
                success:true
            });
        }
    }catch(error){
        next(error);
    }
});

function priceFilterToMongo(pPrice){
    let minus = pPrice.indexOf('-');
    let precio = '';
    if(minus === -1){
        precio = parseInt(pPrice);
    }else if( (minus + 1) ==  pPrice.length ){ // Está al final
        precio = { $gte: pPrice.substr(0, (pPrice.length - 1) )};
    }else if(minus == 0){
        precio = { $lte: pPrice.substr(1, (pPrice.length - 1) )};
    }else{
        let precio1 = parseInt(pPrice.substr(0, minus));
        let precio2 = parseInt(pPrice.substr(minus + 1, pPrice.length - 1));
        if(precio2 < precio1){
            precio = { $gte: precio2, $lte: precio1 };
        }else{
            precio = { $gte: precio1, $lte: precio2 };
        }
    }
    return precio;
}

function tagFilter(pTag){
    if(pTag.indexOf(',') === -1){
        return pTag;
    }else{
        let tags = pTag.split(',');
        return tags;
    }
}

module.exports = router;