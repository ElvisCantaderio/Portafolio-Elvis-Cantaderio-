<template>
  <div>
    <!--Apartado para subir las imagenes-->
    <div class="row d-flex justify-center items-center">
      <div class="col-md-7 col-sm-8 col-xs-10">
        <h6 class="q-my-md">{{ $t("agregarSitio.imagenes") }}</h6>
      </div>
      <div class="col-xs-10 col-sm-8 col-md-7 col-xs-10">
        <input
          type="file"
          hidden
          :id="idInput"
          @change="handleFileUpload"
          multiple
          accept="image/*"
        />

        <q-btn @click="click" color="green" icon="add" round />

        <q-carousel class="q-my-md" animated v-model="slide" infinite>
          <!--en este v-for se cargan las imagenes subidas por el usuario-->
          <q-carousel-slide
            v-for="(image, index) in BImagenes"
            :key="index + tamanio"
            :name="index + tamanio"
          >
            <div class="image-container">
              <div class="image-wrapper">
                <img :src="image.data" class="carousel-image" />
              </div>
              <q-btn
                @click="deleteImage(index)"
                round
                dense
                class="delete-btn"
                flat
                ><q-icon name="close"
              /></q-btn>
            </div>
          </q-carousel-slide>

          <!--en este v-for se cargan las urls de las imagenes del documento de la database-->
          <q-carousel-slide
            v-for="(image, index) in BImagenes2"
            :key="index"
            :name="index"
          >
            <div class="image-container">
              <div class="image-wrapper">
                <img :src="Url + image + '/imagen'" class="carousel-image" />
              </div>
              <q-btn
                @click="deleteImage2(index)"
                round
                dense
                class="delete-btn"
                flat
                ><q-icon name="close"
              /></q-btn>
            </div>
          </q-carousel-slide>
        </q-carousel>
        <div class="carousel-buttons">
          <q-btn
            @click="flechamenos"
            color="green"
            icon="arrow_back"
            round
            style="margin-right: 5px"
          ></q-btn>
          <q-btn
            @click="flechamas"
            color="green"
            icon="arrow_forward"
            round
            style="margin-left: 5px"
          ></q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { url } from "../boot/pouchdb.js";
export default {
  mounted() {
    this.idInput = this.generarNombreUnico();
  },
  data() {
    return {
      BImagenes: [], //para subir las imagenes
      BImagenes2: [], //para las urls de imagenes en el doc de database
      IBorrar: [], //lista que urls de imagenes a eliminar
      slide: 0,
      tamanio: 0,
      Url: url,
      idInput: "idTemporalInput",
    };
  },
  methods: {
    flechamenos() {
      this.slide -= 1;
      if (this.slide < 0) {
        this.slide = this.BImagenes.length + this.BImagenes2.length - 1;
      }
    },
    flechamas() {
      this.slide += 1;
      if (this.slide >= this.BImagenes.length + this.BImagenes2.length) {
        this.slide = 0;
      }
    },
    //cargadas por el usuario
    deleteImage(index) {
      this.BImagenes.splice(index, 1);
      this.flechamas();
      this.flechamenos();
    },
    //urls del doc de database
    deleteImage2(index) {
      this.IBorrar.push(this.BImagenes2[index]);
      this.BImagenes2.splice(index, 1);
      this.flechamas();
      this.flechamenos();
      this.tamanio = this.tamanio - 1;
    },
    click() {
      document.getElementById(this.idInput).click();
    },
    //cargando las imagenes del usuario a la variable para luego enviar
    handleFileUpload(event) {
      /*
      Las propiedades más comunes de un objeto File en JavaScript son las siguientes:

      name: El nombre del archivo, incluyendo la extensión.
      size: El tamaño del archivo en bytes.
      type: El tipo MIME del archivo.
      lastModified: La fecha de la última modificación del archivo.
      lastModifiedDate: Un objeto Date que representa la fecha de la última modificación
        del archivo (deprecated en favor de lastModified).
      arrayBuffer(): Un método que devuelve una promesa que se resuelve con un ArrayBuffer
        que contiene los datos del archivo.
      text(): Un método que devuelve una promesa que se resuelve con el contenido del archivo
        como una cadena de texto.
      slice(): Un método que permite obtener una porción del archivo como un nuevo objeto File.
      */
      const files = event.target.files;
      const maxSize = 760 * 1024; // Tamaño máximo en bytes (770KB)
      const quality = 1.0; // Calidad inicial de compresión (puedes ajustar esto)

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        const file = files[i];

        reader.onload = (e) => {
          const image = new Image();
          image.onload = () => {
            const maxDimension = 1024; // Tamaño máximo para las dimensiones (puedes ajustar esto)
            let width = image.width;
            let height = image.height;

            // Redimensionar la imagen si es necesario
            if (width > maxDimension || height > maxDimension) {
              if (width > height) {
                height = (maxDimension / width) * height;
                width = maxDimension;
              } else {
                width = (maxDimension / height) * width;
                height = maxDimension;
              }
            }

            // Función para comprimir la imagen
            const compressImage = (quality) => {
              return new Promise((resolve) => {
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0, width, height);

                // Convertir el lienzo (canvas) en un blob con la calidad especificada
                canvas.toBlob(
                  (blob) => {
                    resolve(blob);
                  },
                  "image/jpeg",
                  quality
                );
                console.log("comprimiendo!!!");
              });
            };

            // Función para convertir un blob en base64
            const blobToBase64 = (blob) => {
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                  resolve(reader.result);
                };
                reader.readAsDataURL(blob);
              });
            };

            // Función recursiva para ajustar la calidad de compresión
            const adjustQuality = async (targetSize) => {
              let currentQuality = quality;
              while (true) {
                const blob = await compressImage(currentQuality);
                const base64Data = await blobToBase64(blob);
                if (
                  base64Data.length * 0.75 <= targetSize ||
                  currentQuality <= 0.05
                ) {
                  // Calcular el tamaño de la imagen en bytes
                  const sizeInBytes = (base64Data.length * 0.75) / 1024; // El tamaño en base64 se calcula así

                  console.log(
                    "Tamaño de la imagen después de redimensionar:",
                    sizeInBytes,
                    "Kbytes"
                  );
                  const imageObject = {
                    nombre: this.generarNombreUnico() + file.name,
                    data: base64Data,
                    type: blob.type,
                  };
                  this.BImagenes.push(imageObject);
                  break;
                } else {
                  currentQuality -= 0.01; // Reducir la calidad de compresión en 1%
                }
              }
            };

            // Iniciar el proceso de compresión
            adjustQuality(maxSize);
          };

          image.src = e.target.result;
        };

        reader.readAsDataURL(file);
        /*
        const file = files[i];
        const reader = new FileReader();
        reader.onload = () => {
          const imageDataUrl = reader.result;
          const imageObject = {
            nombre: this.generarNombreUnico() + file.name,
            data: imageDataUrl,
            type: file.type
          };
          this.BImagenes.push(imageObject);
        };
        reader.readAsDataURL(file);
        */
      }
      //console.log(this.BImagenes);
      document.getElementById(this.idInput).value = "";
      //cambia a la imagen recien subida
      this.slide = 0 + this.tamanio + this.BImagenes.length;
    },
    //generador de nombre para asegurar que las imagenes tengan nombre unico
    generarNombreUnico() {
      const caracteres =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let nombre = "";
      const longitud = 15; // Define la longitud deseada del nombre

      for (let i = 0; i < longitud; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        nombre += caracteres.charAt(indice);
      }
      //console.log(nombre);
      return nombre;
    },
    setD(dato) {
      for (let i = 0; i < dato.length; i++) {
        this.BImagenes2.push(dato[i]);
      }
      this.tamanio = this.BImagenes2.length;
      console.log(this.tamanio);
    },
  },
};
</script>

<style lang="scss">
.carousel-image {
  width: 100%;
  height: auto;
}

.image-container {
  position: relative;
}

.delete-btn {
  position: absolute;
  top: 1px;
  right: 0;
  background-color: rgba(255, 0, 0, 0.4);
  color: white;
}

.image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.carousel-buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
