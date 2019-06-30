import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import firebase from 'firebase/app';
import 'firebase/auth';
import { openDB, deleteDB, wrap, unwrap } from 'idb';


async function writeDataIndexedDB(st, data) {
    const tx = db.transaction(st, 'readwrite');
    const store = tx.objectStore(st);
    const val = await store.get('counter') || 0;
    store.put(val + 1, 'counter');
    await tx.done;
}

function writeData(st, data) {
    return dbPromise
        .then(function(db) {
            var tx = db.transaction(st, 'readwrite');
            var store = tx.objectStore(st);
            store.put(data);
            return tx.complete;
        });
}


Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loadedRecipes: [],
        loadedIngredients: [],
        loadedCategories: [],
        loadedOwnRecipes: [],

        snack: false,
        snackMessage: '',
        snackColor: '',

        dialog: false,

        user: null,

        loadingRequest: false,
        error: null,

        objectStoreNameIndexedDB: '',
        dataIndexedDB: '',
        primaryKeyDB: '',

        key: []
    },
    mutations: {
        loadRecipes: (state, payload) => {
            state.loadedRecipes = payload;
        },
        setSnackbar: (state, { text, color, snack }) =>{
            state.snack = snack;
            state.snackMessage = text;
            state.snackColor = color;
        },
        createRecipes: (state, payload) => {
            state.loadedOwnRecipes.push(payload);
        },
        setUser: (state, payload) => {
            state.user = payload;
        },
        saveKey: (state, payload) => {
            state.key = payload;
        }
    },
    actions: {
        loadRecipes({ commit, getters }, payload) {
            axios
                .get('/recipes')
                .then(response => {
                    let responseData = response.data.recipes;
                    let resultArrayRecipes = [];
                    for (let index in responseData) {
                        resultArrayRecipes.push(responseData[index]);
                        // console.log( uid)
                    }
                    console.log(response.data);
                    commit('loadRecipes', resultArrayRecipes);
                })
                .catch(function (error) {
                    if (error.response) {
                        // Request made and server responded
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                        commit('setSnackbar', { text: error.message, color:'error', snack:true });
                    } else if (error.request) {
                        // The request was made but no response was received
                        console.log(error);
                        commit('setSnackbar', { text: error.message, color:'error', snack:true });
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        commit('setSnackbar', true);
                        console.log('Error', error.message);
                    }
                });
        },
        createRecipes({commit, getters}, payload) {
            const recipes = {
                title: payload.title,
                name: payload.name,
                description: payload.description,
                ingredients: payload.ingredients,
                creatorId: getters.user.id
            };
            let key;
            let responseDataFromServer;
            let imageURL;
            axios
                .post('/createrecipe', recipes)
                .then(response => {
                    key = response.data.key;
                    responseDataFromServer = response;
                    console.log("Response: ", responseDataFromServer);
                    commit('saveKey', key);
                    return key
                })
                .then((key) => {
                    const fileName = payload.image.name;
                    const extFileName = fileName.slice(fileName.lastIndexOf('.'));
                    return firebase.storage().ref('recipes/' + key + '.' + extFileName).put(payload.image)
                })
                .then(fileData => {
                  return  imageURL = fileData.ref.getDownloadURL()
                })
                .then(imageURL => {
                    console.log("imageURL: ", imageURL);
                    console.log("key: ", key);
                    return firebase.database().ref('embedded/recipes').child(key).update(JSON.parse( JSON.stringify({imageURL: imageURL})))
                })
                .then(() => {
                    commit('createRecipes', {
                        ...recipes,
                        imageURL: imageURL,
                        id: key
                    });
                    commit('setSnackbar', { text: "Recipe was created. ( " + responseDataFromServer.data.status + responseDataFromServer.status + " )", color:'success', snack:true });
                    console.log("Response from Server for create Recipe: ", responseDataFromServer);
                })
                .catch(error => {
                    commit('setSnackbar', { text: "Your Post will be stored and send by Internet-Connection", color: 'warning', snack: true });
                    console.log(error)
                });
        },
        signUserUp({commit}, payload) {
            const user = {
                email: payload.email,
                password: payload.password
            };
            axios
                .post('/signup', user)
                .then(response =>{
                    let getUserData = response.data.newUser;
                    let newUser = {
                        email: getUserData.email,
                        id: getUserData.id,
                        password: getUserData.password,
                        registeredRecipes: getUserData.registeredRecipes
                    };
                    commit('setUser', newUser);
                    commit('setSnackbar', {text: 'User signed up. '+ response.status, color:'success', snack:true })
                })
                .catch(error => {
                    commit('setSnackbar', {text: error, color:'error', snack:true });
                })
        },
        signUserIn ({commit}, payload) {
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
                .then(user => {
                    const newUser = {
                        id: user.uid,
                        registeredRecipes: []
                    };
                    commit('setUser', newUser);
                    commit('setSnackbar', { text: 'User logged in', color:'success', snack:true });
                })
                .catch(error => {
                    commit('setSnackbar', {text: error.message, color:'error', snack:true });
                })
        },
        autoSignIn ({commit}, payload) {
            commit('setUser', { id: payload.uid, registeredRecipes: [] })
        },
        logout({commit}){
            firebase.auth().signOut();
            commit('setUser', null)
        }
    },
    getters: {
        loadRecipes(state){
            return state.loadedRecipes;
        },
        loadIngredients(state){
            return state.loadedIngredients;
        },
        user(state) {
            return state.user;
        },
        loadDialog(state){
            return state.dialog;
        }
    }
})
