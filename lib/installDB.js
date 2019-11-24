'use strict';

require('dotenv').config();

const conn = require('./connectMongoose');
const apiv1 = require('../models/APIv1');
const Usuario = require('../models/Usuario');
const datasetAnuncios = require('./anuncios.json');

conn.once("open", async () => {
    try {
      await apiv1.deleteMany();
      await apiv1.insertMany(datasetAnuncios.anuncios);
      await initUsuarios();
      conn.close();
    } catch (error) {
      console.log("Error", error);
      process.exit(1);
    }
  });

async function initUsuarios()
{
  await Usuario.deleteMany();
  await Usuario.insertMany([
    {
      email: 'falces@gmail.com',
      password: await Usuario.hashPassword('1234')
    },
    {
      email: '​user@example.com',
      password: await Usuario.hashPassword('1234')
    }
  ])
}
