import couch_connection from "./couch_connection";
import {ToastAndroid} from "react-native";

const database = "tripsv-usuarios"

export const userCouchInfo = async (uuid, user) => {
   const URL = `${database}/${uuid}`
    try{
        const response = await couch_connection.get(URL);
        return response.data;
    }catch (err){
       ToastAndroid.show("Bienvenido a TripSv", ToastAndroid.SHORT);
        const response = await couch_connection.put(`${database}/${uuid}`, user);
        return response.data;
    }

}

//Obtiene los usuarios por rol de administrador
export const getUsersByRole = async () => {

    try{
        const viewUrl = `${database}/_design/sites-admins/_view/administradores?include_docs=true`;
        const response = await couch_connection.get(viewUrl);
        console.log(response.data.rows);
        const datos = response.data.rows.map((docs) => {
            const {email, role, _rev} = docs.doc;
            return {email, role, _rev, id: docs.id};
        });
        return await Promise.all(
            datos
        );
    }catch (err){
        throw new Error("Ha ocurrido un error al querer cargar los usuarios con rol administrador");
    }
    
};

//Obtiene un usuario por email
export const getUsersByEmail = async (email) => {

    try {
        const viewUrl = `${database}/_design/sites-usersEmail/_view/usuariosEmail?key="${email}"`;
        const response = await couch_connection.get(viewUrl);
        const datos = response.data.rows.map((docs) => {
            const {email, role, _rev} = docs.value;
            return {email, role, _rev, id: docs.id};
        })
        return await Promise.all(
            datos
        );
    } catch (err) {
        throw new Error("No se puedo obtener el usuario por email");
    };    
};

/*Cambia los roles dependiendo si esta en administrador o usuario 
para quitar o colocarle rol diferente*/
export const changeRoleUsers = async (email, rev, id, role) => {

    let rol = (role === "usuario") ? "administrador" : "usuario";
    const viewUrl = `${database}/${id}`;

    console.log("id " + id + " revision " + rev + " email " + email);
    const newData = {
        email: `${email}`,
        role: `${rol}`
    };

    try {
        const response = await couch_connection.put(viewUrl, newData, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'If-Match': rev,
                },
            }
        );

        if(response.status !== 201){
            ToastAndroid.show("Ha ocurrido un error", ToastAndroid.SHORT)
            return false;
        };

        ToastAndroid.show("Rol modificado con exito", ToastAndroid.SHORT)

    } catch (err) {
        ToastAndroid.show("No se pudo cambiar el Rol", ToastAndroid.SHORT)
        throw new Error("No se pudo cambiar el rol");
    }
}