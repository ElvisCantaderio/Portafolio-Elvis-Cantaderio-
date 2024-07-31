import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { View, StyleSheet, Text } from "react-native";
import { CardSitios } from "../components/SitiosFavoritos/CardSitios";
import { Idioma } from "../context/ContextoLogin";
import { PantallaFavoritosLenguaje } from "../services/idiomas/PantallaFavoritosLenguaje";
import { FlashList } from "@shopify/flash-list";
import SinData from "../components/FlashList/SinData";
import { PantallaInicioLenguaje } from "../services/idiomas/PantallaInicioLenguaje";
import { storageGet, storageDelete } from "../services/LocalStorage/AsyncStorage";
import { eliminarFavorito, limpiarDbFavorito, obtenerFavoritos } from "../services/SQLite/SqliteFavoritos";


const Favoritos = () => {
  const { idioma, setIdioma } = useContext(Idioma);
  const [cargando, setCargando] = useState(true);
  const [traer, setTraer] = useState(true);
  const [favoritos, setFavoritos] = useState([])

  useEffect(() => {
    console.log("Pantalla favoritos estado:", traer)
    obtenerFavoritos((sitio) => {
      console.log("Sitios en favoritos db: ", sitio.length)
      setFavoritos(sitio)
    })
    setTraer(false)
  }, [traer, cargando]);


  const handleRefresh = () => {
    setTraer(true)
  }

  const eliminarSitio = (id) => {
    console.log("Eliminando: ", id)
    eliminarFavorito(id)
    handleRefresh()
  }

  return (
    <SafeAreaView style={{ width: "100%", height: "100%" }}>
      {/* Aqui va las card de favoritos */}
      <View style={{paddingHorizontal: 20, paddingVertical: 5}}>
        <Text style={{ fontSize: 18, color: "gray" }}>{PantallaFavoritosLenguaje["mensaje"][idioma]}</Text>
      </View>
      <View style={styles.cardContenedor}>

        <FlashList
          horizontal={false}
          refreshing={!cargando}
          onRefresh={() => handleRefresh()}
          data={favoritos}
          ListEmptyComponent={<SinData mensaje={PantallaInicioLenguaje["mensajeSinSitio"][idioma]} />}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={100}
          renderItem={({ item, index }) => {
            console.log(JSON.stringify(item, null, 2))
            return <CardSitios key={index} titulo={item.titulo[idioma]} imagen={item.imagenes[0]} textoBtn={PantallaFavoritosLenguaje['verSitio'][idioma]} eliminarFuncion={() => eliminarSitio(item._id)} data={item} />
          }}
        />

      </View>


    </SafeAreaView>



  );
}

const styles = StyleSheet.create({
  cardContenedor: {
    width: "100%",
    flex: 1,
    paddingHorizontal: 10,
  }
});

export default Favoritos;

