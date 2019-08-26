<template>
    <v-container>
        <v-layout v-if="loadingDataBeforeRenderingRecipes" row wrap>
            <v-flex xs12 md8 lg8 px-2>
                <div class="text-xs-center pt-2">
                    <v-progress-circular
                            :size="50"
                            color="primary"
                            indeterminate
                    ></v-progress-circular>
                </div>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex xs12 v-if="!loadRecipes || loadRecipes.length <= 0">
                <h1 class="primary--text">There are no recipes at this moment.</h1>
                <h3 class="primary--text">Do not wait create your own recipe for the community.</h3>
                <v-flex xs12 class="pt-3">
                    <v-btn id="RecipesCreateRecipe" color="primary" to="/createrecipe">Create your Recipe</v-btn>
                </v-flex>
            </v-flex>
        </v-layout>
        <div v-if="loadRecipes && loadRecipes.length > 0">
        <v-layout>
            <v-flex xs12 v-if="!loadingDataBeforeRenderingRecipes">
                <h1 class="primary--text">View Recipes</h1>
            </v-flex>
        </v-layout>
        <v-layout v-if="!loadingDataBeforeRenderingRecipes" row wrap class="pt-3 pb-5">
            <v-flex v-for="item in loadRecipes" :key="item.id" xs12 md4 px-2 pb-3>
                <v-item-group>
                    <v-item>
                        <v-card class="align-center" :to="/recipe/ + item.id">
                            <v-img :src="item.imageURL" aspect-ratio="2.0"/>
                            <v-card-title primary-title>
                                <div class="headline text-truncate">{{ item.title }}</div>
                            </v-card-title>
                            <v-card-text class="grey--text text-truncate">{{ item.preparation}}</v-card-text>
                                <v-card-text ref="getDescription" class="text-truncate" transition="slide-y-transition" hide-on-leave>{{ item.description}}</v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue lighten-1" dark :to="/recipe/ + item.id">
                                    <v-icon dark left>arrow_forward</v-icon>
                                    Show Recipe
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-item>
                </v-item-group>
            </v-flex>
        </v-layout>
        </div>
    </v-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        data() {
            return {
            }
        },
        computed : {
            ...mapGetters([
                'loadRecipes'
            ]),
            loadingDataBeforeRenderingRecipes() {
                return this.$store.getters.loadingRecipe
            },

        },
        mounted() {
            // console.log("Recipes: ",this.loadRecipes);
        }
    }
</script>
