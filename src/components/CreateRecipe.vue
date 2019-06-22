<template>
    <v-container class="text-xs-center text-sm pt-5">
        <v-layout>
            <v-flex xs12>
                <h1 class="text--primary pt-3">Create a new Recipe</h1>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12 sm6 class="text-xs-center text-sm-right pt-5">
                <v-dialog v-model="dialog"  max-width="600px">
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark v-on="on">Create a Recipe</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">Your Recipe-Form</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12 sm6 md4>
                                        <v-text-field
                                                name="title"
                                                id="title"
                                                label="Title*"
                                                v-model.lazy="title"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md4>
                                        <v-text-field
                                                name="name"
                                                id="name"
                                                label="Name*"
                                                hint="Type any Name"
                                                v-model.lazy="name"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12>
                                       <v-btn raised class="primary" @click="">Choose Image</v-btn>
                                        <input type="file" style="display: none" ref="fileInput">
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-textarea
                                                name="description"
                                                id="description"
                                                label="Description*"
                                                hint="Type a short version"
                                                v-model.lazy="description"
                                        ></v-textarea>
                                    </v-flex>
                                    <v-flex xs12 sm6>
                                        <v-autocomplete
                                                :items="['Butter', 'Sugar', 'Butter1']"
                                                name="ingredients"
                                                label="Ingredients*"
                                                id="ingredients"
                                                hint="Select your Ingredients"
                                                v-model.lazy="ingredients"
                                                multiple
                                        ></v-autocomplete>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
                            <v-btn color="blue darken-1" flat @click="dialog = false; submitRecipesToServer()">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { openDB, deleteDB, wrap, unwrap } from 'idb';

    export default {
        name: 'App',
        components: {
        },
        data () {
            return {
                dialog: false,
                title: '',
                name: '',
                imageURL: '',
                description: '',
                ingredients: [],
                indexedDB: ''
            }
        },
        methods: {
            async initialIndexedDB() {
                console.log("initialIndexedDB")
               this.indexedDB = await openDB('posts-store', 1, {
                    upgrade(db) {
                        // Create a store of objects
                        const store = db.createObjectStore('posts', {
                            // The 'id' property of the object will be the (primary)key.
                            keyPath: 'id',
                            autoIncrement: true,
                        });
                    }
                });
                await this.writeDataIndexedDB('posts');
            },
            async writeDataIndexedDB(store, data) {
                // Add an article:
                await this.indexedDB.add(store, {
                    title: 'Article 1',
                    date: new Date('2019-01-01'),
                    id: 1,
                    body: '…',
                });
            },
            async clearAllData(store) {
                await clear(store)
            },
            submitRecipesToServer(){
                const postRecipeData = {
                    title: this.title,
                    name: this.name,
                    imageURL: this.imageURL,
                    description: this.description,
                    ingredients: this.ingredients
                };
                this.$store.dispatch('createRecipes', postRecipeData);
            },
            backGroundSync(){
                if ('serviceWorker' in navigator && 'SyncManager' in window) {
                    console.log('[SW]&[SyncManger] were found in Browser');
                    navigator.serviceWorker.getRegistrations()
                        .then(sw => {
                            var postRecipeData = {
                                title: this.title,
                                name: this.name,
                                imageURL: this.imageURL,
                                description: this.description,
                                ingredients: this.ingredients
                            };
                            console.log("<<<<<<<<<< 1")
                            this.initialIndexedDB('sync-posts', postRecipeData)
                                .then( () => {
                                    console.log("<<<<<<<<<< 2")
                                    return sw.sync.register('sync-new-post');
                                })
                                .then( () => {
                                    console.log("<<<<<<<<<< 3")
                                    this.$store.commit('setSnackbar', {text: 'Offline-Background-Sync. ' +
                                            'Will Post if you got Internet Connection.', color:'success', snack:true })
                                })
                                .catch(error => {
                                    this.$store.commit('setSnackbar', {text: error, color:'error', snack:true });
                                    console.log(error);
                                })
                        })
                        .catch(error =>{
                            console.log('[SW]&[SyncManger]', error);
                        })
                } else {
                    this.submitRecipesToServer();
                }

            }
        }
    }
</script>
