<template>
    <v-container >
        <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <h1 class="primary--text pt-5">Create a new Recipe</h1>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12 pb-5>
                <v-form ref="form" @submit.prevent="submitRecipesToServer">
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
                                    label="Preparation"
                                    :rules="[rules.required]"
                                    hint="Type your ingredients"
                                    v-model.lazy="preparation"
                            ></v-textarea>
                        </v-flex>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-autocomplete
                                    :items="itemsCategory"
                                    label="Select a Category*"
                                    :rules="[rules.required]"
                                    v-model.lazy="category"
                            ></v-autocomplete>
                        </v-flex>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-select
                                    :items="itemsIngredients"
                                    label="Ingredients*"
                                    v-model.lazy="ingredients"
                                    multiple
                                    hint="Pick your favorite ingredients"
                                    persistent-hint
                                    :rules="[rules.required]"
                            ></v-select>
                        </v-flex>
                        <v-flex xs12 sm6 offset-sm3 pt-4>
                            <v-btn color="primary" type="submit" :loading="buttonLoadingState">Save</v-btn>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>

    export default {
        data () {
            return {
                title: '',
                imageURL: '',
                image: null,
                description: '',
                ingredients: [],
                preparation: '',
                category: [],
                itemsCategory: ['Starter' , 'Main Course' , 'Dessert' , 'To Go' , 'Vegan' , 'Salad'],
                itemsIngredients: ['Sugar', 'Butter', 'Coke', 'Egg', 'Water'],
                rules: {
                    required: value => !!value || 'Required.'
                }
            }
        },
        methods: {
            submitRecipesToServer(){
                this.buttonLoadingState = true;
                if(!this.$refs.form.validate()) {
                    this.buttonLoadingState = false;
                    return;
                }
                if (!this.image) {
                    this.$store.commit('setSnackbar', { text: "Please add an image of your recipe, before your post.", color:'error', snack:true });
                    this.buttonLoadingState = false;
                    return;
                }
                const postRecipeData = {
                    title: this.title,
                    image: this.image,
                    description: this.description,
                    ingredients: this.ingredients,
                    category: this.category,
                    preparation: this.preparation
                };
                console.log("CreateRecipe: ", postRecipeData);
                this.$store.dispatch('createRecipes', postRecipeData)
                    .then(() => {
                        this.buttonLoadingState = false;
                        // this.$router.push('/recipes');
                    });
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
        },
        computed : {
            buttonLoadingState() {
                console.log("buttonLoadingState(): ", this.$store.getters);
                return this.$store.getters.loadingButtonState
            }
        },
    }
</script>
