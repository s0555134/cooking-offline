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
                                       <v-btn raised class="primary" @click="uploadImage()">Choose Image</v-btn>
                                        <input type="file" style="display: none" ref="fileInput" accept="image/*" @change="onFilePicked">
                                    </v-flex>
                                </v-layout>
                                <v-layout align-center justify-start row fill-height>
                                    <v-flex xs12 sm6>
                                        <img :src="imageURL" height="150">
                                    </v-flex>
                                </v-layout>
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
                image: null,
                description: '',
                ingredients: [],
            }
        },
        methods: {
            submitRecipesToServer(){
                if (!this.image) {
                    this.$store.commit('setSnackbar', { text: "Please add an image of your recipe, before your post.", color:'error', snack:true });
                    return;
                }
                const postRecipeData = {
                    title: this.title,
                    name: this.name,
                    image: this.image,
                    description: this.description,
                    ingredients: this.ingredients
                };
                console.log(postRecipeData);
                this.$store.dispatch('createRecipes', postRecipeData);
            },
            uploadImage() {
                this.$refs.fileInput.click()
            },
            onFilePicked(event) {
                const files = event.target.files;
                let fileName = files[0].name;
                    if (fileName.match(/\.(png|jpg|jpeg|gif)$/)) {
                        const fileReader = new FileReader();
                        fileReader.addEventListener('load', () => {
                            this.imageURL = fileReader.result
                        });
                        fileReader.readAsDataURL(files[0]);
                        this.image = files[0];
                    } else {
                        this.$store.commit('setSnackbar', { text: "Please add only image-files", color:'error', snack:true })
                    }
            }
        }
    }
</script>
