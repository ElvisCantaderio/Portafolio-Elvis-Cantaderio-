import { db, collection, getDocs } from "src/boot/firebase";
import { query } from "firebase/firestore";
import { defineStore } from "pinia";
export const usedetalleUsuarioStore = defineStore("DetalleUsuarios", {
  state: () => {
    return {
      Usuarios: [],
    };
  },
  actions: {
    querySnapshoteUser() {
      const usuarios = [];
      const q = query(collection(db, "administradores"));
      const querySnapshotRoute = getDocs(q);
      //console.log(querySnapshotRoute);
      querySnapshotRoute.then(
        (doc) =>
          doc.docs.map((s) => {
            //console.log(s._document.data.value.mapValue.fields)
            const dat = s._document.data.value.mapValue.fields;
            this.Usuarios.push(dat.email.stringValue);
          })
        // console.log(doc.docs)
        // usuarios.push()
      );
    },
  },
});
