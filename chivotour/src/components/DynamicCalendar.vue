<template>
  <!--<div>
      <span>Días</span>
    </div>-->
  <section class="titulo">
    <div class="row q-pa-md">
      <div class="">{{ $t('agregarSitio.dia') }}</div>
      <div style="position: relative; left: 50%">{{ $t('agregarSitio.apertura') }}</div>
      <div style="position: relative; left: 55%">{{ $t('agregarSitio.cierre') }}</div>
      <q-btn icon="add" color="primary" @click="add" round style="position: relative; left: 60%" />
    </div>
  </section>
  <section class="carta2">
    <div class="row q-pa-md">
      <q-btn icon="add" color="primary" @click="add" round style="position: relative; left: 85%" />
    </div>
  </section>
  <q-card class="border-blue bg-bluess min-width" v-for="(targeta, indes) in horario" :key="indes">
    <q-card-section class="carta1 flex-center">
      <!-- por aqui esta el responsable de los colores de los dias-->
      <div class="col flex center">
        <div class="carta1">
          <div v-for="(day, index) in targeta.days" :key="index" @click="toggleDay(index, indes)" :style="{
            color: day.boolean ? 'red' : 'black',
            cursor: 'pointer',
          }" class="resaltarDia">
            <div v-if="idioma === 'español'">{{ day.nombre }}</div>
            <div v-else>{{ day.name }}</div>
          </div>
        </div>
      </div>
      <div class="row flex center sboton">
        <div class="col" v-for="(hour, index) in targeta.hours" :key="index">
          <!--se hizo uso de botones y dentro de esto se puso el valor de las variables-->
          <q-btn color="primary" flat>
            {{ hour.hour }}
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="hour.hour">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="OK" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-btn>
        </div>
        <div class="col">
          <q-btn icon="delete" @click="borrar(indes)" />
        </div>
      </div>
    </q-card-section>
    <!--Movil-tablet-->
    <q-card-section class="carta2">
      <div class="row1 flex-center">
        <!-- por aqui esta el responsable de los colores de los dias-->
        <div v-for="(day, index) in targeta.days" :key="index" @click="toggleDay(index, indes)" :style="{
          color: day.boolean ? 'red' : 'black',
          cursor: 'pointer',
        }" class="resaltarDia">
          <div v-if="idioma === 'español'">{{ day.nombre }}</div>
          <div v-else>{{ day.name }}</div>
        </div>
      </div>
      <div class="row1 flex-center">
        <div v-for="(hour, index) in targeta.hours" :key="index">
          <div v-if="idioma === 'español'">{{ hour.nombre }}</div>
          <div v-else>{{ hour.name }}</div>
          <!--se hizo uso de botones y dentro de esto se puso el valor de las variables-->
          <q-btn color="primary" flat>
            {{ hour.hour }}
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="hour.hour">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="OK" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-btn>
        </div>
        <q-btn icon="delete" @click="borrar(indes)" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  data() {
    var idioma = "español";
    var horario = [
      {
        days: [
          { name: "Mo", nombre: this.$t('agregarSitio.dias.lu'), boolean: true },
          { name: "Tu", nombre: this.$t('agregarSitio.dias.ma'), boolean: true },
          { name: "We", nombre: this.$t('agregarSitio.dias.mi'), boolean: true },
          { name: "Th", nombre: this.$t('agregarSitio.dias.ju'), boolean: true },
          { name: "Fr", nombre: this.$t('agregarSitio.dias.vi'), boolean: true },
          { name: "Sa", nombre: this.$t('agregarSitio.dias.sa'), boolean: false },
          { name: "Su", nombre: this.$t('agregarSitio.dias.do'), boolean: false }
        ],
        hours: [
          { nombre: "Apertura", name: "Open", hour: "08:00" },
          { nombre: "Cierre", name: "Close", hour: "17:00" }
        ],
        value: "",
        boolean: false,
        color: ""
      }
    ];
    return { horario, idioma };
  },
  created() {
    this.$i18n.locale = localStorage.getItem('selectedLanguage');
    this.updateLanguage();
  },
  methods: {
    updateLanguage() {
      this.horario[0].days[0].nombre = this.$t('agregarSitio.dias.lu');
      this.horario[0].days[1].nombre = this.$t('agregarSitio.dias.ma');
      this.horario[0].days[2].nombre = this.$t('agregarSitio.dias.mi');
      this.horario[0].days[3].nombre = this.$t('agregarSitio.dias.ju');
      this.horario[0].days[4].nombre = this.$t('agregarSitio.dias.vi');
      this.horario[0].days[5].nombre = this.$t('agregarSitio.dias.sa');
      this.horario[0].days[6].nombre = this.$t('agregarSitio.dias.do');
    },
    borrar(indes) {
      if (this.horario.length == "1") {
        this.horario = [
          {
            days: [
              { name: "Mo", nombre: this.$t('agregarSitio.dias.lu'), boolean: false },
              { name: "Tu", nombre: this.$t('agregarSitio.dias.ma'), boolean: false },
              { name: "We", nombre: this.$t('agregarSitio.dias.mi'), boolean: false },
              { name: "Th", nombre: this.$t('agregarSitio.dias.ju'), boolean: false },
              { name: "Fr", nombre: this.$t('agregarSitio.dias.vi'), boolean: false },
              { name: "Sa", nombre: this.$t('agregarSitio.dias.sa'), boolean: false },
              { name: "Su", nombre: this.$t('agregarSitio.dias.do'), boolean: false }
            ],
            hours: [
              { nombre: "Apertura", name: "Open", hour: "08:00" },
              { nombre: "Cierre", name: "Close", hour: "17:00" }
            ],
            value: "",
            boolean: false,
            color: ""
          }
        ];
        this.updateLanguage();
      }
      if (indes > -1 && this.horario.length != "1") {
        this.horario.splice(indes, 1);
      }
    },
    //actualizar() {
    //console.log(this.schedule);
    //},
    add() {
      this.horario.unshift({
        days: [
          { name: "Mo", nombre: this.$t('agregarSitio.dias.lu'), boolean: false },
          { name: "Tu", nombre: this.$t('agregarSitio.dias.ma'), boolean: false },
          { name: "We", nombre: this.$t('agregarSitio.dias.mi'), boolean: false },
          { name: "Th", nombre: this.$t('agregarSitio.dias.ju'), boolean: false },
          { name: "Fr", nombre: this.$t('agregarSitio.dias.vi'), boolean: false },
          { name: "Sa", nombre: this.$t('agregarSitio.dias.sa'), boolean: false },
          { name: "Su", nombre: this.$t('agregarSitio.dias.do'), boolean: false }
        ],
        hours: [
          { nombre: "Apertura", name: "Open", hour: "08:00" },
          { nombre: "Cierre", name: "Close", hour: "17:00" }
        ],
        value: "",
        boolean: false,
        color: ""
      });
    },
    toggleDay(index, indes) {
      this.horario[indes].days[index].boolean = !this.horario[indes].days[index].boolean;
    },
    setD(dato) {
      var base = {};
      var horario = [];
      var dayList = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
      const mapaTildes = {
        'á': 'a',
        'é': 'e',
        'í': 'i',
        'ó': 'o',
        'ú': 'u',
        'Á': 'A',
        'É': 'E',
        'Í': 'I',
        'Ó': 'O',
        'Ú': 'U',
        'ü': 'u',
        'Ü': 'U',
        'ñ': 'n',
        'Ñ': 'N'
      };
      var day = 0;
      var bol = true;
      if (dato.length > 0) {
        for (let i = 0; i < dato.length; i++) {
          for (let k = 0; k < dayList.length; k++) {
            if (dayList[k] === dato[i].day.replace(/[áéíóúÁÉÍÓÚüÜñÑ]/g, letra => mapaTildes[letra]).toLowerCase()) {
              day = k;
            }
          }
          for (let j = 0; j < dato[i].ranges.length; j++) {
            base = {
              days: [
                { name: "Mo", nombre: this.$t('agregarSitio.dias.lu'), boolean: false },
                { name: "Tu", nombre: this.$t('agregarSitio.dias.ma'), boolean: false },
                { name: "We", nombre: this.$t('agregarSitio.dias.mi'), boolean: false },
                { name: "Th", nombre: this.$t('agregarSitio.dias.ju'), boolean: false },
                { name: "Fr", nombre: this.$t('agregarSitio.dias.vi'), boolean: false },
                { name: "Sa", nombre: this.$t('agregarSitio.dias.sa'), boolean: false },
                { name: "Su", nombre: this.$t('agregarSitio.dias.do'), boolean: false }
              ],
              hours: [
                { nombre: "Apertura", name: "Open", hour: "08:00" },
                { nombre: "Cierre", name: "Close", hour: "17:00" }
              ],
              value: "",
              boolean: false,
              color: ""
            };
            if (i == 0) {
              base.hours[0].hour = dato[i].ranges[j].start;
              base.hours[1].hour = dato[i].ranges[j].end;
              base.days[day].boolean = true;
              horario.push(base);
            } else {
              for (let k = 0; k < horario.length; k++) {
                if (dato[i].ranges[j].start === horario[k].hours[0].hour && dato[i].ranges[j].end === horario[k].hours[1].hour) {
                  horario[k].days[day].boolean = true;
                  bol = false;
                }
              }
              if (bol) {
                base.hours[0].hour = dato[i].ranges[j].start;
                base.hours[1].hour = dato[i].ranges[j].end;
                base.days[day].boolean = true;
                horario.push(base);
              }
              bol = true;
            }
          }
        }
      }
      //console.log(horario);
      this.horario = horario;
    },
    getD() {
      var rangos = [[], [], [], [], [], [], []];
      var dato = [];
      var horario = [{
        days: [
          { name: "Mo", nombre: this.$t('agregarSitio.dias.lu'), boolean: true },
          { name: "Tu", nombre: this.$t('agregarSitio.dias.ma'), boolean: true },
          { name: "We", nombre: this.$t('agregarSitio.dias.mi'), boolean: true },
          { name: "Th", nombre: this.$t('agregarSitio.dias.ju'), boolean: true },
          { name: "Fr", nombre: this.$t('agregarSitio.dias.vi'), boolean: true },
          { name: "Sa", nombre: this.$t('agregarSitio.dias.sa'), boolean: false },
          { name: "Su", nombre: this.$t('agregarSitio.dias.do'), boolean: false }
        ],
        hours: [
          { nombre: "Apertura", name: "Open", hour: "08:00" },
          { nombre: "Cierre", name: "Close", hour: "17:00" }
        ],
        value: "",
        boolean: false,
        color: ""
      }];
      var bol = false;
      for (let index = 0; index < this.horario.length; index++) {
        for (let index2 = 0; index2 < 7; index2++) {
          if (this.horario[index].days[index2].boolean) {
            bol = true;
            rangos[index2].push({
              start: this.horario[index].hours[0].hour,
              end: this.horario[index].hours[1].hour
            });
          }
        }
      }
      if (!bol) {
        for (let index2 = 0; index2 < 7; index2++) {
          if (horario[0].days[index2].boolean) {
            bol = true;
            rangos[index2].push({
              start: horario[0].hours[0].hour,
              end: horario[0].hours[1].hour
            });
          }
        }
      }
      if (rangos[0].length > 0) {
        dato.push({ day: "Lunes", ranges: rangos[0] });
      }
      if (rangos[1].length > 0) {
        dato.push({ day: "Martes", ranges: rangos[1] });
      }
      if (rangos[2].length > 0) {
        dato.push({ day: "Miercoles", ranges: rangos[2] });
      }
      if (rangos[3].length > 0) {
        dato.push({ day: "Jueves", ranges: rangos[3] });
      }
      if (rangos[4].length > 0) {
        dato.push({ day: "Viernes", ranges: rangos[4] });
      }
      if (rangos[5].length > 0) {
        dato.push({ day: "Sabado", ranges: rangos[5] });
      }
      if (rangos[6].length > 0) {
        dato.push({ day: "Domingo", ranges: rangos[6] });
      }
      return dato;
    }
  },
};
</script>

<style scoped>
.resaltarDia {
  transition: transform 0.2s ease-in-out;
}

.resaltarDia:hover {
  transform: scale(1.4);
  border-radius: 20%;
  background-color: gray;
}

@media (max-width: 800px) {
  .carta1 {
    display: none;
  }

  .carta2 {
    display: block;
  }

  .min-width {
    min-width: 230px;
  }

  .titulo {
    display: none;
  }
}

@media (min-width: 801px) {
  .carta1 {
    max-height: 50px;
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .min-width {
    min-width: 470px;
  }

  .carta2 {
    display: none;
  }

  .sboton {
    gap: 1rem;
  }
}

.row1 {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.q-card.border-blue {
  border: 1px solid #1c2541;
}

.q-card.bg-bluess {
  background-color: #ffffff;
}
</style>
