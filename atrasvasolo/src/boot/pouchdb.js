import { boot } from "quasar/wrappers";
import PouchDB from "pouchdb";
import { useCounterStore } from "stores/dataGlobal";
const store = useCounterStore();

const urlParada =
  "https://atrasvasolo:jocote&0109UES@couchdbbackend.esaapp.com/atrasvasolo-paradas";
const urlRuta =
  "https://atrasvasolo:jocote&0109UES@couchdbbackend.esaapp.com/atrasvasolo-rutas";
const dbParada = new PouchDB("paradas");
const dbRuta = new PouchDB("rutas");
export default boot(() => {
  console.log("booting pouchdb");

  dbParada.replicate
    .from(urlParada, { live: true, retry: true })
    .on("change", function () {
      console.log("actualizado Paradas");
      //store.ptermino = true;
    })
    .on("complete", function () {
      console.log("completo");
      //store.ptermino = true;
    })
    .on("error", function (err) {
      console.log(err);
    });

  dbRuta.replicate
    .from(urlRuta, { live: true, retry: true })
    .on("change", function () {
      console.log("actualizado");
      //store.ptermino = true;
    })
    .on("complete", function () {
      console.log("completo");
      //store.ptermino = true;
    })
    .on("error", function (err) {
      console.log("estoy teniendo un error aqui");
      console.log(err);
    });
}); //fin del boot

export { dbParada, dbRuta };
