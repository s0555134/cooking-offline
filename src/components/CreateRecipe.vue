<template>
    <v-container >
        <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <h1 class="primary--text pt-5">Create a new Recipe</h1>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12 pb-5>
                <v-form @submit.prevent="onSignIn">
                    <v-layout row wrap>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field
                                    v-model.lazy="title"
                                    :rules="[rules.required]"
                                    label="Title"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 offset-sm3 pb-2>
                            <v-btn raised class="primary" @click="uploadImage()">Choose Image</v-btn>
                            <input type="file" style="display: none" ref="fileInput" accept="image/*" @change="onFilePicked">
                        </v-flex>
                        <v-flex xs12 sm6 offset-sm3>
                            <img :src="imageURL" height="150">
                        </v-flex>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-textarea
                                    v-model.lazy="description"
                                    label="Description"
                                    :rules="[rules.required]"
                                    hint="Type a short version"
                            ></v-textarea>
                        </v-flex>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-textarea
                                    v-model="preparation"
                                    label="Preparation"
                                    :rules="[rules.required]"
                                    hint="Type your ingredients"
                                    v-model.lazy="preparation"
                            ></v-textarea>
                        </v-flex>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-autocomplete
                                    :items="['Starter', 'Main-Course', 'Dessert', 'To-Go', 'Vegan']"
                                    name="category"
                                    label="Select a Category*"
                                    :rules="[v => !!v || 'Item is required']"
                                    v-model.lazy="ingredients"
                            ></v-autocomplete>
                        </v-flex>
                        <v-flex xs12 sm6 offset-sm3 pt-4>
                            <v-btn color="primary" @click="submitRecipesToServer()">Save</v-btn>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>

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
                preparation: '',
                rules: {
                    required: value => !!value || 'Required.'
                }
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
