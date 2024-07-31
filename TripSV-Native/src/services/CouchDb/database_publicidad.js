import couch_connection from "./couch_connection";
import base64js from "base64-js";

const database_image = "tripsv-app-publicidad";




//Subir una imagen a couchdb
export const uploadImage = async (images) => {
    const image = images.map((images, index) => {
        return {
            name: `${index}.${images.uri.split(".").pop()}`,
            uri: images.uri,
            type: `image/${images.uri.split(".").pop()}`,
            base64: images.base64
        }
    });
    // console.log(JSON.stringify(image, null, 2))
    let revDoc = null;
    let docId = null;
    for (const img of image) {
        const binaryData = base64js.toByteArray(img.base64);
        console.log("Enviando imagen")
        const createDoc = await couch_connection.post(`${database_image}`, {
            "nombre": "publicidad"
        });
        if (createDoc.status !== 201) {
            return false;
        }
        revDoc = createDoc.data.rev;
        docId = createDoc.data.id;
        // console.log("Documento creado rev: " + revDoc + " id: " + docId)
        const response = await couch_connection.put(`${database_image}/${docId}/${img.name}`,
            binaryData,
            {
                headers: {
                    'Content-Type': img.type,
                    'processData': false,
                    'If-Match': revDoc
                },
            });
        // Verifico si se subio la imagen
        if (response.status !== 201) {
            return false;
        }
        // Guardo el rev del documento
        console.log("Imagen enviada")
    }
    return true;

}

export const getPublicidad = async () => {
    const URL = `${database_image}/_all_docs?include_docs=true`;
    const response = await couch_connection.get(URL);
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
                        const imageUrls = `https://couchdbbackend.esaapp.com/${database_image}/${documentoCouchDB._id}/${key}`;
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


//Eliminar un documento
export const deleteImage = async (id, rev) => {
    const response = await couch_connection.delete(`${database_image}/${id}?rev=${rev}`);
    return response.status === 200;
}