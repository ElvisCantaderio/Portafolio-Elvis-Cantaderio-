import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("sitios")


db.transaction((tx) => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS sitios (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT)", [], (tx, resultSet) => {
                console.log("[TABLA sitios creado con exito]", resultSet)
        }, (tx, error) => {
                console.log("[Error al crear la base de datos sitio] : ", error)
        }
        )
})


export function cantDocumento(callback) {

        try {
                db.transaction((tx) => {
                        tx.executeSql("SELECT COUNT(*) AS cant FROM sitios;"
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

export function limpiarDb() {
        db.transaction((tx) => {
                tx.executeSql(
                        'DELETE FROM sitios',
                        [],
                        (tx, resultSet) => {
                                console.log('Todas las filas de "sitios" se han eliminado con éxito.');
                        },
                        (tx, error) => {
                                console.error('Error al eliminar las filas de "miTabla":', error);
                        }
                )
        })
}

export function insertarSitios(sitios) {
        sitios.forEach((x, index) => {
                db.transaction((tx) => {
                        tx.executeSql('INSERT INTO sitios (content) VALUES (?)', [JSON.stringify(x)],
                                (tx, resultSet) => {
                                        console.log("Se inserto con exito #", index);
                                }, (transaction, error) => {
                                        console.log(error)
                                }
                        )
                })
        })
}


export function obtenerSitios(callback) {

        try {
                db.transaction((tx) => {
                        tx.executeSql('SELECT * FROM sitios', [], (tx, { rows }) => {
                                console.log("Recuperando cant doc #", rows.length)
                                const data = []
                                for (let i = 0; i < rows.length; i++) {
                                        const item = JSON.parse(rows.item(i).content);
                                        // const jsonContent = JSON.parse(item.content);
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