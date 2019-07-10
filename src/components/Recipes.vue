<template>
    <v-container class="pt-5">
        <v-layout v-if="loading" row wrap class="pt-5 pb-5">
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
        <v-layout>
            <v-flex v-if="!loading" xs 12>
                <h1 class="primary--text pt-3">View Recipes</h1>
            </v-flex>
        </v-layout>
        <v-layout v-if="!loading" row wrap class="pt-3 pb-5">
            <v-flex
                v-for="item in loadRecipes"
                :key="item.id"
                xs12 md4 px-2 pb-3
            >
                <v-item-group>
                    <v-item>
                        <v-card
                            class="align-center"
                        >
                            <v-img
                                :src= "item.imageURL"
                                aspect-ratio="2.0"
                            />
                            <v-card-title primary-title>
                                    <div class="headline text-truncate">{{ item.title }}</div>
                            </v-card-title>
                            <v-card-text class="grey--text text-truncate">{{ item.preparation}}</v-card-text>
                            <v-card-text class="text-truncate">{{ item.description}}</v-card-text>
                            <v-btn icon @click="show = !show">
                                <v-icon>{{ show ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
                            </v-btn>
                            <v-slide-y-transition>
                                <v-card-text v-show="show">
                                    {{item.description}}
                                </v-card-text>
                            </v-slide-y-transition>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue lighten-1" dark :to="/recipe/ + item.id">
                                    <v-icon dark left>arrow_forward</v-icon>
                                        Open Recipe
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-item>
                </v-item-group>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        data() {
            return{
                show: false,
            }
        },
        computed : {
            ...mapGetters([
                'loadRecipes',
                'loadIngredients'
            ]),
            loading () {
                console.log("Recipes: ", this.$store.getters.loading);
                return this.$store.getters.loading
            }
        },
        mounted() {
            console.log("Recipes: ",this.loadRecipes);
        }
    }
</script>
