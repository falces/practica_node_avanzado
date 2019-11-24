const cote = require('cote');
const Jimp = require('jimp');

const responder = new cote.Responder({ name: 'thumbnail microservice' })

responder.on('createThumb', (req, done) => {
  Jimp.read(req.file)
    .then(file => {
      return file
        .resize(200, Jimp.AUTO)
        .quality(80)
        .write(`./public/images/thumbnails/${req.fileName}`)
    })
    .catch(err => {
      console.log(err)
    });
  done(null, { success: true, result: 'Thumbnail created' })
})


/*
'use strict';

// Servicio de cambio de moneda

const cote = require('cote');

// Declarar el microservicio
const responder = new cote.Responder({
    name: 'currency responder'
});

// Tabla de conversión --> base de datos del microservicio
const rates = {
    usd_eur: 0.86,
    eur_usd: 1.14
}

// Lógica del microservicio
responder.on('convertir moneda', (req, done) => {
    console.log('servicio: ', req.from, req.to, req.amount, Date.now());
    // Calculamos el resultado
    const result = rates[`${req.from}_${req.to}`] * req.amount;
    done(result);
});
*/