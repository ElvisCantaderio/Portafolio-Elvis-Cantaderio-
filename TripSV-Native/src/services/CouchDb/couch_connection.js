import { decode, encode } from 'base-64'
import axios from "axios";

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}
//Host
export const host = 'https://couchdbbackend.esaapp.com/';

// Autenticación básica para la base de datos CouchDB
const auth = {
    username: 'admin',
    password: 'Hemeroteca#123'
};

// Realizar la petición POST a la base de datos CouchDB con la autenticación básica
const couch_connection = axios.create({
    baseURL: host,
    auth,
    headers: {
        'Content-Type': 'application/json'
    },
})

export default couch_connection;


