import * as SecureStore from "expo-secure-store";


export const SecureStorageIdioma = () =>{
    async function save(key, value) {
        await SecureStore.setItemAsync(key, value);
    }

    async function getValueFor(key) {
        let result = await SecureStore.getItemAsync(key);
        if (result) {
            return result
        } else {
            throw new Error("No estaba la clave")
        }
    }

    return {
        save,
        getValueFor
    }
}

