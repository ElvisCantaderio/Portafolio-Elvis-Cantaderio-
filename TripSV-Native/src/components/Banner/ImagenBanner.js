import { useState, useEffect } from "react";
import { Image } from "react-native";
import { View } from "dripsy";
import { SitesServices } from "../../services/FireStorage/SitesServices";
import { getPublicidad } from "../../services/CouchDb/database_publicidad";

const ImagenBanner = () => {

    const { getImageByDir } = SitesServices();
    const [images, setImages] = useState([]);
    const [cargoImagenes, setCargoImagenes] = useState(true);
    useEffect(() => {

        async function obtenerImagenes() {
            const imagenes = await getPublicidad();
           
            if (imagenes) { 
                const numeroAleatorioImages = obtenerNumeroAleatorio(0, imagenes.length - 1);
                const select = imagenes.filter((item,index)=> index=== numeroAleatorioImages);
                setImages(select);
            }
        }

        if (cargoImagenes) {
            console.log("Obteniendo las imagenes");
            obtenerImagenes();
        }
        setCargoImagenes(false);
    }, [cargoImagenes]);

    function obtenerNumeroAleatorio(min, max) {
        // Calcula el rango de números
        const rango = max - min;
        // Genera un número aleatorio dentro del rango y lo ajusta al entero más cercano
        let numeroAleatorio = Math.floor(Math.random() * (rango + 1)) + min;
        // Devuelve el número aleatorio generado
        return numeroAleatorio;
    }
    //En base a este numero muestra la imagen
    

    if (!cargoImagenes) {
        return (
            <View>
                {images.map((item, index) => (
                    <View key={index} sx={{ height: [70, 90, 125] }} >
                        <Image resizeMode={"cover"} style={{ marginTop: 10, width: "100%", height: "100%" }} source={{ uri: item.imagenes[0] }} />
                    </View>
                ))
                }
            </View>


        )
    }
}

export default ImagenBanner;