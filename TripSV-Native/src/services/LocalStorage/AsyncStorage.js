import * as SecureStore from 'expo-secure-store';


export const storageSave = async (clave, valor) => {
    try {
        return await SecureStore.setItemAsync(clave, valor);
    } catch (error) {
        console.log("Error al guardar el valor en AsyncStorage:", error);
    }
};
export const storageGet = async (clave) => {
    try {
        return await SecureStore.getItemAsync(clave);
    } catch (error) {
        console.log('Error al obtener el valor de AsyncStorage:', error);    }
};

export const storageDelete = async (clave) => {
    try {
        return await SecureStore.deleteItemAsync(clave);
    } catch (error) {
        throw new Error('Error al eliminar el valor de AsyncStorage')
    }
};



export const modificarValor = async (clave, valor) => {
    try {
        console.log('Valor modificado correctamente en AsyncStorage.');
        return await AsyncStorage.setItem(clave, valor);

    } catch (error) {
        console.log('Error al modificar el valor en AsyncStorage:', error);
    }
};
