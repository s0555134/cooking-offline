import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import firebase from 'firebase/app';
import 'firebase/auth';
import router from './router'


Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loadedRecipes: [],
        loadedOwnRecipes: [],

        snack: false,
        snackMessage: '',
        snackColor: '',

        dialog: false,

        user: null,

        loadingProgress: false,

        loadingRequest: false,
        error: null,

        dbKey: []
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
        updateRecipe: (state, payload) => {
            let recipe = state.loadedRecipes;
            for (let index in recipe) {
                if (recipe[index].id === payload.id) {
                    if (payload.title) {
                        recipe.title = payload.title
                    }
                    if (payload.description) {
                        recipe.description = payload.description
                    }
                    if (payload.preparation) {
                        recipe.preparation = payload.preparation
                    }
                }
            }
            console.log("Store: ", recipe);
            console.log("Store: ", payload);
        },
        setUser: (state, payload) => {
            state.user = payload;
        },
        saveKey: (state, payload) => {
            state.dbKey = payload;
        },
        setLoading (state, payload) {
            state.loadingProgress = payload;
        }
    },
    actions: {
        loadRecipes({ commit, getters }, payload) {
            commit('setLoading', true);
            axios
                .get('/recipes')
                .then(response => {
                    let responseData = response.data.recipes;
                    let resultArrayRecipes = [];
                    for (let index in responseData) {
                        resultArrayRecipes.push({
                            id: responseData[index].id,
                            title: responseData[index].title,
                            imageURL: responseData[index].imageURL,
                            description: responseData[index].description,
                            ingredients: responseData[index].ingredients,
                            preparation: responseData[index].preparation,
                            category: responseData[index].category,
                            creatorId: responseData[index].creatorId
                        });
                    }
                    console.log(response.data);
                    commit('loadRecipes', resultArrayRecipes);
                    commit('setLoading', false);
                })
                .catch(function (error) {
                    commit('setLoading', false);
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                        commit('setSnackbar', { text: error.message, color:'error', snack:true });
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        console.log(error.request);
                        commit('setSnackbar', { text: error.request, color:'error', snack:true });
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                    }
                });
        },
        createRecipes({commit, getters}, payload) {
            const recipes = {
                title: payload.title,
                description: payload.description,
                ingredients: payload.ingredients,
                preparation: payload.preparation,
                category: payload.category,
                creatorId: getters.user.id
            };
            let dbKey;
            let imageURL;
            axios
                .post('/createrecipe', recipes)
                .then(response => {
                    dbKey = response.data.key;
                    commit('setSnackbar', { text: "Recipe was created. ( " + response.data.status + " )", color:'success', snack:true });
                    console.log("Response from Server for create Recipe: ", response);
                    commit('saveKey', dbKey);
                    return dbKey
                })
                .then(key => {
                    const fileName = payload.image.name;
                    const extFileName = fileName.slice(fileName.lastIndexOf('.'));
                    return firebase.storage().ref('recipes/' + key + '.' + extFileName).put(payload.image)
                })
                .then(fileData => {
                  return imageURL = fileData.ref.getDownloadURL()
                })
                .then(imageURL => {
                    console.log("imageURL: ", imageURL);
                    console.log("dbKey: ", dbKey);
                    return firebase.database().ref('embedded/recipes').child(dbKey).update(JSON.parse( JSON.stringify({imageURL: imageURL})))
                })
                .then(() => {
                    commit('createRecipes', {
                        ...recipes,
                        imageURL: imageURL,
                        id: dbKey
                    });
                })
                .catch(error => {
                    commit('setSnackbar', { text: "Your Post will be stored and uploaded by Internet-Connection", color: 'warning', snack: true });
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        console.log(error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                    }
                })
        },
        updateRecipe({commit}, payload) {
            commit('setLoading', true);
            let editedRecipe = {};
            if (payload.title) {
                editedRecipe.title = payload.title
            }
            if (payload.description) {
                editedRecipe.description = payload.description
            }
            if (payload.preparation) {
                editedRecipe.preparation = payload.preparation
            }
            axios
                .put('/recipes/' + payload.id, editedRecipe)
                .then(response => {
                    commit('updateRecipe', editedRecipe);
                    commit('setLoading', false);
                    commit('setSnackbar', { text:"Your recipe: " + editedRecipe.title + " has been changed.", color:'success', snack:true });
                    router.push('/recipes')
                })
                .catch(error => {
                    commit('setLoading', false);
                    commit('setSnackbar', { text: "Your changes will be updated, if you got your Internet-Connection back", color: 'warning', snack: true });
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                        commit('setSnackbar', { text: error.message, color:'error', snack:true });
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        console.log(error.request);
                        commit('setSnackbar', { text: error.request, color:'error', snack:true });
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                    }
                })
        },
        signUserUp({commit}, payload) {
            const user = {
                displayName: payload.displayName,
                email: payload.email,
                password: payload.password
            };
            axios
                .post('/signup', user)
                .then(response =>{
                    let getUserData = response.data.newUser;
                    let newUser = {
                        displayName: getUserData.displayName,
                        email: getUserData.email,
                        id: getUserData.id,
                        password: getUserData.password,
                        registeredRecipes: getUserData.registeredRecipes
                    };
                    console.log("signUserUp: ",newUser);
                    commit('setUser', newUser);
                    commit('setSnackbar', { text: 'Thanks for your registration ' + newUser.displayName + " .", color:'success', snack:true })
                })
                .catch(error => {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                        commit('setSnackbar', { text: error.message, color:'error', snack:true });
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        console.log(error.request);
                        commit('setSnackbar', { text: error.request, color:'error', snack:true });
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                    }
                })
        },
        signUserIn ({commit}, payload) {
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
                .then(user => {
                    firebase.auth().currentUser.updateProfile({
                        displayName: payload.displayName
                    })
                    return user
                })
                .then(user => {
                    const newUser = {
                        id: user.user.uid,
                        name: user.user.displayName,
                        registeredRecipes: []
                    };
                    commit('setUser', newUser);
                    commit('setSnackbar', { text: 'Welcome back ' + newUser.name + " .", color:'success', snack:true });
                })
                .catch(error => {
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                        commit('setSnackbar', { text: error.message, color:'error', snack:true });
                    } else if (error.request) {
                        console.log(error.request);
                        commit('setSnackbar', { text: error.request, color:'error', snack:true });
                    } else {
                        console.log('Error', error.message);
                    }
                })
        },
        autoSignIn ({commit}, payload) {
            commit('setUser', { id: payload.uid, registeredRecipes: [] })
        },
        logout({commit}){
            firebase.auth().signOut()
                .then(() =>{
                    commit('setUser', null)
                })
                .catch(error => {
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                        commit('setSnackbar', { text: error.message, color:'error', snack:true });
                    } else if (error.request) {
                        console.log(error.request);
                        commit('setSnackbar', { text: error.request, color:'error', snack:true });
                    } else {
                        console.log('Error', error.message);
                    }
                })
        }
    },
    getters: {
        loadRecipes(state){
            return state.loadedRecipes;
        },
        user(state) {
            return state.user;
        },
        loadRecipe(state) {
            return(recipesId) => {
                return state.loadedRecipes.find((loadedRecipes) => {
                    return loadedRecipes.id === recipesId
                })
            }
        },
        loadDialog(state){
            return state.dialog;
        },
        loading (state) {
            return state.loadingProgress
        },
    }
})
