import { boot } from 'quasar/wrappers';
import PouchDB from 'pouchdb';
//import { async } from '@firebase/util';

let sitios = new PouchDB('chivotour-sitios');
let administradores = new PouchDB('chivotour-administradores');
let usuarios = new PouchDB('chivotour-usuarios');
let imagenes = new PouchDB('chivotour-imagenes');
let url = 'https://couchdbbackend.esaapp.com/chivotour-imagenes/';
let url2 = 'http://localhost:5984/chivotour-imagenes/';
let authUrl = 'https://chivotour:papaya&4725UES@couchdbbackend.esaapp.com/';
let authUrl2 = 'http://admin:admin@localhost:5984/';
const Nadministradores = new PouchDB(authUrl + 'chivotour-administradores');
const Nsitios = new PouchDB(authUrl + 'chivotour-sitios');
const Nusuarios = new PouchDB(authUrl + 'chivotour-usuarios');
const Nimagenes = new PouchDB(authUrl + 'chivotour-imagenes');

const opciones = {
  live: true,
  retry: true
};

export default boot(async (/* {app, router, ...*/) => {

});

sitios.replicate.from(Nsitios, opciones).on('change', function (info) {
  console.log('algo cambio');
  console.log(info);
});

export { sitios, administradores, usuarios, imagenes, Nsitios, Nadministradores, Nusuarios, Nimagenes, url, url2 };

/*
anterior
https://couchdb.esaapp.com/

nuevo
https://couchdbbackend.esaapp.com/

chivotour
papaya&4725UES


colecciones:
chivotour-administradores
chivotour-sitios
chivotour-usuarios
chivotour-imagenes

la coleccion de imagenes no se va a replicar localmente, sino que se consumirá la de nube

ejemplo para interfaz web
anterior
https://couchdb.esaapp.com/_utils/#database/chivotour-sitios/_all_docs

nuevo
https://couchdbbackend.esaapp.com/_utils/#database/chivotour-sitios/_all_docs
*/
