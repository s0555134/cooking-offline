<template>
    <v-container>
        <v-layout v-if="loadingDataBeforeRenderingRecipes" row wrap>
            <v-flex xs12 md8 lg8 px-2>
                <div class="text-xs-center">
                    <v-progress-circular
                            :size="50"
                            color="primary"
                            indeterminate
                    ></v-progress-circular>
                </div>
            </v-flex>
        </v-layout>
        <v-layout v-if="!recipe" row wrap>
            <v-flex xs12>
                <h1 class="primary--text">You have no recipes.</h1>
                <h3 class="primary--text">Do not wait create your own recipe for the community.</h3>
            </v-flex>
            <v-flex xs12 class="pt-2">
                <v-btn color="primary" to="/createrecipe">Create your Recipe</v-btn>
            </v-flex>
        </v-layout>
        <div v-if="recipe">
        <v-layout v-if = "!loadingDataBeforeRenderingRecipes" row wrap>
            <v-flex xs12>
                <h1 class="primary--text">My Recipe</h1>
            </v-flex>
        </v-layout>
        <v-layout v-if="!loadingDataBeforeRenderingRecipes" row wrap class="pt-3">
            <v-flex xs12 md9 lg8 px-2 class="align-center">
                <v-card>
                    <v-img :src="recipe.imageURL" height="400px"/>
                    <v-card-title primary-title>
                        <div class="headline">{{ recipe.title }}</div>
                    </v-card-title>
                    <div class="grey--text pl-3">{{ recipe.preparation}}</div>
                    <v-card-text class="text-truncate">{{ recipe.description}}</v-card-text>
                    <v-card-actions>
                        <template v-if="checkUserIsCreatorOfRecipe">
                            <delete-recipe :recipe="recipe"></delete-recipe>
                            <v-spacer></v-spacer>
                            <edit-recipe :recipe="recipe"></edit-recipe>
                        </template>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
        <v-layout v-if = "!loadingDataBeforeRenderingRecipes && recipe">
            <v-flex xs12>
                <v-btn color="blue lighten-1" dark to="/recipes">
                    <v-icon dark left>arrow_backwards</v-icon>
                    Back to Recipes
                </v-btn>
            </v-flex>
        </v-layout>
        </div>
    </v-container>
</template>

<script>
    export default {
        props: ['id'],
        data() {
            return{
            }
        },
        computed : {
            recipe() {
                return this.$store.getters.loadRecipe(this.id)
            },
            userIsAuthenticated() {
                return this.$store.getters.user !== null && this.$store.getters.user !== undefined
            },
            checkUserIsCreatorOfRecipe() {
                if (!this.userIsAuthenticated) {
                    return false
                }
                return this.$store.getters.user.id === this.recipe.creatorId
            },
            loadingDataBeforeRenderingRecipes() {
                return this.$store.getters.loadingRecipes
            }
        },
        mounted() {
            console.log("Recipe-solo: ", this.recipe);
        }
    }
</script>
