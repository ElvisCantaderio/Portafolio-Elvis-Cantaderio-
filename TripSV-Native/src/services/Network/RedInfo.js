import * as Network from 'expo-network';



async function estoyConectado() {
        try {
                const red = await Network.getNetworkStateAsync();
                return red.isConnected;
        } catch (error) {
                console.log(error)
                return null;
        }
}

export default estoyConectado;