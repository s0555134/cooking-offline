<template>
    <div>
        <v-layout row>
            <v-btn color="error" dark @click.stop="dialog = true" :loading="buttonLoadingState">
                Delete Recipe
            </v-btn>
            <v-dialog v-model="dialog" max-width="290">
                <v-card>
                    <v-card-title class="headline">Are you sure to delete your recipe?</v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="dialog = false">Cancel</v-btn>
                        <v-btn color="blue darken-1" flat @click="dialog = false; deleteRecipe()">Delete</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </div>
</template>

<script>
    export default {
        props: ['recipe'],
        data() {
            return {
                dialog: false
            }
        },
        methods: {
            deleteRecipe() {
                this.$store.dispatch('removeRecipe', {
                    id: this.recipe.id
                })
                    .then(() =>{
                        this.$router.push('/recipes');
                    })
            }
        },
        computed: {
            buttonLoadingState: {
                get: function() {
                    console.log("buttonLoadingState(): ", this.$store.getters.loadingButtonState);
                    return this.$store.getters.loadingButtonState
                },
                set: function (value) {
                    return this.$store.getters.loadingButtonState
                }
            }
        }
    }
</script>
