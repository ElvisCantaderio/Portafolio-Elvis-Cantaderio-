import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("favoritos")


db.transaction((tx) => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS favoritos (id INTEGER PRIMARY KEY,json_data TEXT,id_doc TEXT);",
                [], (tx, resultSet) => {
                        console.log("[TABLA favoritos creado con exito]", resultSet)
                }, (tx, error) => {
                        console.log("[Error al crear la base de datos sitio] : ", error)
                }
        )
})


export function cantDocumento(callback) {

        try {
                db.transaction((tx) => {
                        tx.executeSql("SELECT COUNT(*) AS cant FROM favoritos;"
                                , [],
                                (tx, { rows }) => {
                                        const data = rows._array;
                                        console.log(data)
                                        let count = data[0]['cant'];
                                        callback(count);
                                },
                                (tx, error) => {
                                        console.log("Ocurrio un error al contar los sitios")
                                        callback(0);
                                })
                })

        } catch (err) {
                callback(0)
        }
}

export function limpiarDbFavorito() {
        db.transaction((tx) => {
                tx.executeSql(
                        'DELETE FROM favoritos',
                        [],
                        (tx, resultSet) => {
                                console.log('Todas las filas de "favoritos" se han eliminado con éxito.');
                        },
                        (tx, error) => {
                                console.error('Error al eliminar las filas de "miTabla":', error);
                        }
                )
        })
}

export function eliminarFavorito(id) {
        db.transaction((tx) => {
                tx.executeSql(
                        'DELETE FROM favoritos WHERE id_doc = ?;',
                        [id],
                        (tx, resultSet) => {
                                console.log('Todas el sitio de "favoritos" se ha eliminado con éxito.');
                        },
                        (tx, error) => {
                                console.error('Error al eliminar las filas de "miTabla":', error);
                        }
                )
        })
}

export function insertarFavorito(sitio, id) {

        db.transaction((tx) => {
                tx.executeSql('INSERT INTO favoritos (json_data, id_doc) VALUES (?, ?);', [JSON.stringify(sitio), id],
                        (tx, resultSet) => {
                                console.log("Se inserto con exito #", id);
                        }, (transaction, error) => {
                                console.log(error)
                        }
                )
        })
}


export function obtenerFavoritos(callback) {

        try {
                db.transaction((tx) => {
                        tx.executeSql('SELECT json_data FROM favoritos', [], (tx, { rows }) => {
                                console.log("Recuperando cant doc #", rows.length)
                                const data = []
                                for (let i = 0; i < rows.length; i++) {
                                        // console.log(rows._array[i]['json_data'])
                                        const item = JSON.parse(rows._array[i]['json_data'])
                                        data.push(item);
                                }
                                callback(data)
                        }, (tx, error) => {
                                throw new Error("[Error al traer los sitios] : ")
                        })
                })

        } catch (err) {
                callback([])
        }
}


export function obtenerFavorito(callback, id) {

        try {
                db.transaction((tx) => {
                        tx.executeSql('SELECT * FROM favoritos WHERE id_doc = ?', [id], (tx, { rows }) => {
                                console.log("Recuperando cant doc #", rows.length)

                                callback(rows.length)
                        }, (tx, error) => {
                                throw new Error("[Error al traer los sitios] : ")
                        })
                })

        } catch (err) {
                callback(0)
        }
}