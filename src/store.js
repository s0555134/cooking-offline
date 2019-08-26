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

        loadingRecipes: false,
        loadingButtonState: false,
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
        },
        removeRecipe: (state, payload) => {
            let recipe = state.loadedRecipes;
            for (let index in recipe) {
                if (recipe[index].id === payload.id) {
                    console.log("Store-RemoveRecipe: ",recipe[index])
                    console.log("Store-RemoveRecipes-payload: ", payload);
                }
            }
        },
        setUser: (state, payload) => {
            state.user = payload;
        },
        saveKey: (state, payload) => {
            state.dbKey = payload;
        },
        setLoadingRecipes (state, payload) {
            state.loadingRecipes = payload;
        },
        setButtonLoading (state, payload) {
            state.loadingButtonState = payload;
        },

    },
    actions: {
        loadRecipes({ commit, getters }, payload) {
            commit('setLoadingRecipes', true);
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
                    console.log("Store-loadRecipes(). Response from Server: ", response.data);
                    commit('loadRecipes', resultArrayRecipes);
                    commit('setLoadingRecipes', false);
                })
                .catch(function (error) {
                    commit('setLoadingRecipes', false);
                    commit('setSnackbar', { text: "You have no Internet-Connection.", color: 'warning', snack: true });
                    logError(error)
                });
        },
        createRecipes({commit, getters}, payload) {
            commit('setButtonLoading', true);
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
                    console.log("(Store) create Recipe(): dbKEY: ", dbKey);
                    commit('setSnackbar', { text: "Recipe created. Check it out under Recipes. ", color:'success', snack:true });
                    commit('saveKey', dbKey);
                    commit('setButtonLoading', false);
                    return saveImageOnDB(dbKey, payload, imageURL)
                })
                .then(() => {
                    commit('createRecipes', {
                        ...recipes,
                        imageURL: imageURL,
                        id: dbKey
                    });
                })
                .catch(error => {
                    commit('setButtonLoading', false);
                    commit('setSnackbar', { text: "Your Post will be stored and uploaded by Internet-Connection", color: 'warning', snack: true });
                    logError(error)
                })
        },
        updateRecipe({commit}, payload) {
            commit('setLoadingRecipes', true);
            commit('setButtonLoading', true);
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
                    commit('setLoadingRecipes', false);
                    commit('setButtonLoading', false);
                    commit('setSnackbar', { text:"Your recipe has been changed.", color:'success', snack:true });
                    router.push('/recipes')
                })
                .catch(error => {
                    commit('setButtonLoading', false);
                    commit('setLoadingRecipes', false);
                    commit('setSnackbar', { text: "Your changes will be updated, if you got your Internet-Connection back", color: 'warning', snack: true });
                    logError(error)
                })
        },
        removeRecipe({commit}, payload) {
            commit('setButtonLoading', true);
            // commit('setButtonLoading', true);
            axios
                .delete('/recipes/' + payload.id)
                .then(response => {
                    commit('removeRecipe', response.data.key);
                    commit('setButtonLoading', false);
                    commit('setSnackbar', { text:"Your recipe has been deleted.", color:'success', snack:true });
                })
                .catch(error => {
                    // commit('setButtonLoading', false);
                    commit('setButtonLoading', false);
                    commit('setSnackbar', { text: "Your changes will be updated, if you got your Internet-Connection back", color: 'warning', snack: true });
                    logError(error)
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
                    commit('setSnackbar', { text: error, color: 'error', snack: true });
                    logError(error)
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
                        displayName: user.user.displayName,
                        registeredRecipes: []
                    };
                    commit('setUser', newUser);
                    commit('setSnackbar', { text: 'Welcome back ' + newUser.displayName, color:'success', snack:true });
                })
                .catch(error => {
                    commit('setSnackbar', { text: error, color: 'error', snack: true });
                    logError(error)
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
                    logError(error)
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
        loadingRecipe(state) {
            return state.loadingRecipes
        },
        loadingButtonState(state) {
            return state.loadingButtonState
        },
    }
})

function logError(error) {
    if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        console.log(error.request);
    } else {
        console.log('Error', error.message);
    }
}

function saveImageOnDB(dbKey, payload, imageURL) {
    const fileName = payload.image.name;
    const extFileName = fileName.slice(fileName.lastIndexOf('.'));
    return firebase.storage().ref('recipes/' + dbKey + extFileName).put(payload.image)
        .then(fileData => {
            return imageURL = fileData.ref.getDownloadURL()
        })
        .then(imageURL => {
            console.log("imageURL: ", imageURL);
            console.log("extFileName: ", extFileName);
            console.log("dbKey: ", dbKey);
            return firebase.database().ref('embedded/recipes').child(dbKey).update(JSON.parse(JSON.stringify({ imageURL: imageURL })))
        })
        .catch(error => {
            console.log(error)
        })
}
