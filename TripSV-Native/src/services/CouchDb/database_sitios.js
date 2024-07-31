import couch_connection from "./couch_connection";
import base64js from 'base64-js';
import {ToastAndroid} from "react-native";

// Nombre de la base de datos
const database = "tripsv-sitios";
const database_image = "tripsv-imagenes";


/**
 * Obtener todos los sitios
 * @param estado 0: revision, 1: aprobado, 2: denegado
 * @returns {Promise<*>}
 */
export const getAllSites = async (estado = 0) => {
    const URL = {
        0: `${database}/_design/sites-revision/_view/revision?include_docs=true`,
        1: `${database}/_design/sites-aprobados/_view/aprobados?include_docs=true`,
        2: `${database}/_design/sites-denegado/_view/denegado?include_docs=true`,
    };

    if (!URL.hasOwnProperty(estado)) {
        throw new Error('Estado no válido');
    }

    const response = await couch_connection.get(URL[estado]);

    return await Promise.all(
        response.data.rows.map(async (siteRow) => {
            // Obtener las imágenes del sitio
            const imagenes = await getImage(`${database_image}/${siteRow.id}`);

            // Devolver un objeto de sitio con las imágenes
            return {
                ...siteRow.doc,
                imagenes,
            };
        })
    );
};

export const getAllSitesByEmail = async (email) => {
    const URL = `${database}/_design/sites-email/_view/email?key="${email}"&include_docs=true`


    const response = await couch_connection.get(URL);

    return await Promise.all(
        response.data.rows.map(async (siteRow) => {
            // Obtener las imágenes del sitio
            try {
                const imagenes = await getImage(`${database_image}/${siteRow.id}`);
                console.log("trayendo")
                return {
                    ...siteRow.doc,
                    imagenes,
                };
            } catch (e) {
                console.log("Error trayendo")
                return {
                    ...siteRow.doc,
                    imagenes: [],
                }

            }
            // Devolver un objeto de sitio con las imágenes

        })
    );
};
// mandar un sitio
export const sendSite = async (site) => {
    const response = await couch_connection.post(`${database}`, site);
    console.log(response)
    return response.data;
}

// mandar multiples imagenes desde react native
export const sendImages = async (imagenes, id) => {
    // Preparo y saco la informacion de las imagenes
    const imagen = imagenes.map((images, index) => {
        return {
            name: `${index}${id}.${images.uri.split(".").pop()}`,
            uri: images.uri,
            type: `image/${images.uri.split(".").pop()}`,
            base64: images.base64
        }
    });

    //Lectura de imagenes y envio de las mismas asociadas con un id
    let revDoc = null;
    for (const image of imagen) {
        const binaryData = base64js.toByteArray(image.base64);
        console.log("Enviando imagen")
        const response = await couch_connection.put(`${database_image}/${id}/${image.name}`,
            binaryData,
            {
                headers: {
                    'Content-Type': image.type,
                    'processData': false,
                    'If-Match': revDoc
                },
            });
        // Verifico si se subio la imagen
        if (response.status !== 201) {
            return false;
        }
        // Guardo el rev del documento
        revDoc = response.data.rev;
        console.log("Imagen enviada")

    }
    return true;
}

//Eliminar un documento atraves de su id y rev
export const deleteSite = async (id, rev) => {
    const response = await couch_connection.delete(`${database}/${id}?rev=${rev}`);
    return response.data;
}

export const getImage = async (imageUrl) => {

    const response = await couch_connection.get(imageUrl);
    try {
        // Verificar que la solicitud se haya realizado correctamente (código de respuesta 200)
        if (response.status === 200) {
            // Obtener el documento JSON de la respuesta
            const documentoCouchDB = response.data;

            // Acceder al objeto _attachments que contiene los archivos adjuntos
            const attachments = documentoCouchDB._attachments;
            const imagenes = []
            // Iterar a través de las claves (nombres de archivos adjuntos) en _attachments
            for (const key in attachments) {
                if (attachments.hasOwnProperty(key)) {
                    const attachment = attachments[key];
                    if (attachment.length) {
                        // Crear una URL para la imagen y mostrarla en la consola
                        const imageUrls = `https://bucket.tripsv.xyz/${database_image}/${documentoCouchDB._id}/${key}`;
                        imagenes.push(imageUrls)
                    }
                }
            }
            return imagenes;
        } else {
            console.error('Error al obtener el documento desde CouchDB:', response.status);
        }
    } catch (error) {
        console.error('Error en la solicitud GET:', error);
    }
    return false;
};


//Eliminar sitio de la base de datos y sus imagenes
export const deleteSiteAndImages = async (id, rev) => {
    // console.log("Eliminando sitio id: " + id + "Con rev: " + rev)
    // Obtener las imagenes del sitio
    console.log("Obteniendo revision de las imagenes")
    const responseDocImagen = await couch_connection.get(`${database_image}/${id}`);
    //Obtener el id, rev del documento de imagenes
    // console.log(JSON.stringify(responseDocImagen.data,null,2))
    let revImagenes = responseDocImagen.data._rev;

    // console.log("Imagenes id: " + id + "Con rev: " + revImagenes)
    console.log("Eliminando documentos de imagenes")
    const responseImagenes = await couch_connection.delete(`${database_image}/${id}/?rev=${revImagenes}`);
    if (responseImagenes.status !== 200) {
        console.log("Error al eliminar las imagenes")
        return false;
    }
    //Eliminando el sitio
    console.log("Eliminando documento de sitio")
    const responseSitio = await couch_connection.delete(`${database}/${id}?rev=${rev}`);
    if (responseSitio.status !== 200) {
        console.log("Error al eliminar el sitio")
        return false;
    }
    return true;
}


//Modifica el estado para poder aprobar o denegar sitios
export const updateFieldDocumentStateCouch = async (newData, id, rev) => {

    const viewUrl = `${database}/${id}`;

    try {
        const response = await couch_connection.put(viewUrl, newData, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'If-Match': rev,
                },
            }
        );
        console.log(response.status)
        if(response.status !== 201){
            return false;
        }
        
        return true;

    } catch (err) {
            console.log(err)
            // ToastAndroid.show("Error al subir un sitio", ToastAndroid.SHORT)
            return false;
        // (newData.estado == 1) ?

        // :
        //     ToastAndroid.show("Error: Sitio NO Denegado", ToastAndroid.SHORT)
        // throw new Error("No se pudo aprobar o denegar estado");
    }
}