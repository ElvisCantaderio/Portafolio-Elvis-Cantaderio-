import {
    db,
    collection,
    getDocs,
    getAuth,
    signInWithPopup,
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    addDoc  
  } from '../../boot/db'
  
  export default {
    namespaced: true,
  
    state: {
      auth: {
        id: null,
        name: 'Anónimo',
        username: '@anonimo',
        email: 'none',
        type: 'none',
        photoURL: 'https://bit.ly/3C83WXF'
      },
  
      admins: [],
  
      users: []
    },
  
    getters: {
      getAuth: (state) => {
        return state.auth
      },
  
      getAdmins: (state) => {
        return state.admins
      },
  
      getUsers: (state) => {
        return state.users
      }
    },
  
    mutations: {
      setAuth: (state, auth) => {
        state.auth = auth
      },
  
      setAdmins: (state, admins) => {
        state.admins = admins
      },
  
      setUsers: (state, users) => {
        state.users = users
      },
  
      setAuthID: (state, id) => {
        state.auth.id = id
      },
  
      validateAuthType (state, currentUser) {
        if (state.admins.some((admin) => admin.email === currentUser.email)) {
          state.auth.type = 'admin'
        } else if (state.users.some((user) => user.email === currentUser.email)) {
          state.auth.type = 'user'
        } else {
          state.auth.type = 'newUser'
        }
      }
    },
  
    actions: {
      doLogin: ({ commit, getters, dispatch }) => {
        const auth = getAuth()
        const provider = new GoogleAuthProvider()
  
        signInWithPopup(auth, provider)
          .then(async (result) => {
            const currentUser = result.user
  
            await commit('validateAuthType', currentUser)
  
            const auth = getters.getAuth
  
            let id = null
  
            let array = []
  
            if (auth.type === 'admin') {
              array = getters.getAdmins
            } else if (auth.type === 'user') {
              array = getters.getUsers
            }
  
            if ((auth.type === 'admin') || (auth.type === 'user')) {
              array.forEach(user => {
                if (currentUser.email === user.email) {
                  id = user.id
                }
              })
  
              commit('setAuth', {
                id: id,
                name: currentUser.displayName,
                username: '@' + currentUser.email.slice(0, currentUser.email.indexOf('@')),
                email: currentUser.email,
                type: auth.type,
                photoURL: currentUser.photoURL
              })
            } else {
              await dispatch('getActiveAuth')
  
              const auth = getters.getAuth
  
              await dispatch('addUser', auth.email)
            }
          })
          .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
  
            console.error(errorCode, errorMessage)
          })
      },
  
      onLogout ({ commit }) {
        const auth = getAuth()
  
        signOut(auth)
          .then(() => {
            commit('setAuth', {
              id: null,
              name: 'Anónimo',
              username: '@anonimo',
              email: 'none',
              type: 'none',
              photoURL: 'https://bit.ly/3C83WXF'
            })
  
            this.$router.push('/')
          })
          .catch((error) => {
            console.error(error)
          })
      },
  
      addUser: async ({ commit }, email) => {
        const docRef = await addDoc(collection(db, 'usuarios'), {
          email: email,
          paradasFavoritas: [],
          rutasFavoritas: [],
          destinosFavoritos: []
        })
  
        commit('setAuthID', docRef.id)
      },
  
      getActiveAuth: ({ commit }) => {
        const auth = getAuth()
  
        onAuthStateChanged(auth, async (currentUser) => {
          commit('setAuth', {
            id: null,
            name: currentUser.displayName,
            username: '@' + currentUser.email.slice(0, currentUser.email.indexOf('@')),
            email: currentUser.email,
            type: 'user',
            photoURL: currentUser.photoURL
          })
        })
      },
  
      getFirebaseAdmins: async ({ commit }) => {
        const admins = []
  
        const querySnapshot = await getDocs(collection(db, 'administradores'))
  
        querySnapshot.forEach((doc) => {
          const admin = doc.data()
  
          admin.id = doc.id
  
          admins.push(admin)
        })
  
        commit('setAdmins', admins)
      },
  
      getFirebaseUsers: firestoreAction(async ({ bindFirestoreRef }) => {
        const ref = db.collection('usuarios')
  
        await bindFirestoreRef('users', ref)
      })
    }
  }