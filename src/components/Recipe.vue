<template>
    <v-container class="pt-5">
        <v-layout   v-if="loadingDataBeforeRenderingRecipes"
                    row wrap class="pt-5 pb-5">
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
        <v-layout v-if = "!loadingDataBeforeRenderingRecipes" row wrap>
            <v-flex xs 12>
                <h1 class="primary--text pt-3">My Recipe</h1>
            </v-flex>
        </v-layout>
        <v-layout v-if="!loadingDataBeforeRenderingRecipes" row wrap class="pt-3 pb-5">
            <v-flex xs12 md9 lg8 px-2 offset-xs1>
                <v-card class="align-center">
                    <v-img :src="recipe.imageURL" height="400px"/>
                    <v-card-title primary-title>
                        <div class="headline text-truncate">{{ recipe.title }}</div>
                    </v-card-title>
                    <v-card-text class="grey--text text-truncate">{{ recipe.preparation}}</v-card-text>
                    <v-card-text class="text-truncate">{{ recipe.description}}</v-card-text>
                    <v-btn icon @click="show = !show">
                        <v-icon>{{ show ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
                    </v-btn>
                    <v-slide-y-transition>
                        <v-card-text v-show="show" class="text-truncate">
                            {{recipe.description}}
                        </v-card-text>
                    </v-slide-y-transition>
                    <v-card-actions>
                        <template v-if="checkUserIsCreatorOfRecipe">
                            <v-spacer></v-spacer>
                            <edit-recipe :recipe="recipe"></edit-recipe>
                        </template>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        props: ['id'],
        data() {
            return{
                show: false,
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
                return this.$store.getters.loading
            }
        },
        mounted() {
            console.log("Recipe-solo: ", this.recipe);
            console.log("Recipe-solo-dbKey: ", this.id);
        }
    }
</script>
