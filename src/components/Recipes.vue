<template>
    <v-container class="pt-5">
        <v-layout>
            <v-flex xs 12>
                <h1 class="primary--text pt-3">View Recipes</h1>
            </v-flex>
        </v-layout>
        <v-layout row wrap class="pt-3 pb-5">
            <v-flex
                v-for="item in loadRecipes"
                :key="item.title"
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
                                <div>
                                    <div class="headline">{{ item.title }}</div>
                                    <span class="grey--text">{{ item.preparation}}</span>
                                </div>
                            </v-card-title>
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
            ])
        },
        mounted() {
            console.log("Recipes: ",this.loadRecipes);
        }
    }
</script>
