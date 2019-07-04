<template>
    <v-container class="pt-5">
        <v-layout row wrap>
            <v-flex xs 12>
                <h1 class="primary--text pt-3">My Recipe</h1>
            </v-flex>
        </v-layout>
        <v-layout row wrap class="pt-3 pb-5">
            <v-flex xs12 md8 lg8 px-2>
                <v-card class="align-center">
                    <v-img
                            :src="recipe.imageURL"
                            height="400px"
                    />
                    <v-card-title primary-title>
                        <div>
                            <div class="headline">{{ recipe.title }}</div>
                            <span class="grey--text">{{ recipe.preparation}}</span>
                        </div>
                    </v-card-title>
                    <v-card-text class="text-truncate">{{ recipe.description}}</v-card-text>
                    <v-btn icon @click="show = !show">
                        <v-icon>{{ show ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
                    </v-btn>
                    <v-slide-y-transition>
                        <v-card-text v-show="show">
                            {{recipe.description}}
                        </v-card-text>
                    </v-slide-y-transition>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn fab dark color="cyan">
                            <v-icon dark>edit</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {mapGetters} from 'vuex';
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
            }
        },
        mounted() {
            console.log("Recipe-solo: ",this.recipe);
            console.log("Recipe-solo: ", this.id);
        }
    }
</script>
