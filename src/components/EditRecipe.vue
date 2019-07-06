<template>
    <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on }">
            <v-btn color="blue lighten-1" fab dark v-on="on">
                <v-icon dark>edit</v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-card-title>
                <span class="headline">Edit Recipe</span>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-text-field
                                    label="title"
                                    v-model="editedTitle"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 >
                            <v-textarea
                                    label="Description"
                                    v-model="editedDescription"
                            ></v-textarea>
                        </v-flex>
                        <v-flex xs12>
                            <v-textarea
                                    label="Preparation"
                                    v-model="editedPreparation"
                            ></v-textarea>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                            <v-autocomplete
                                    :items="recipe.itemsCategory"
                                    label="recipe.itemsCategory"
                                    v-model="itemsCategory"
                            ></v-autocomplete>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                            <v-select
                                    :items="recipe.itemsIngredients"
                                    label="recipe.itemsIngredients"
                                    item-text="adwad"
                                    multiple
                                    persistent-hint
                                    v-model="itemsIngredients"
                            ></v-select>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="dialog = false">Cancel</v-btn>
                <v-btn color="blue darken-1" flat @click="dialog = false; saveEdits()">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        props: ['recipe'],
        data() {
            return {
                dialog: false,
                editedTitle: this.recipe.title,
                editedDescription: this.recipe.description,
                editedPreparation: this.recipe.preparation,
                itemsCategory: this.recipe.itemsCategory,
                itemsIngredients: this.recipe.itemsIngredients
            }
        },
        mounted() {
            console.log(this.recipe);
        },
        methods: {
            saveEdits() {
                this.$store.dispatch('updateRecipe', {
                    id: this.recipe.id,
                    title: this.editedTitle,
                    description: this.editedDescription,
                    preparation: this.editedPreparation
                })
            }
        }
    }
</script>
