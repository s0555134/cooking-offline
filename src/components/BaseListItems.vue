<template>
    <v-container class="pt-5">
        <v-layout>
            <v-flex xs 12>
                <h1 class="text--primary pt-3">List of Recipes</h1>
            </v-flex>
        </v-layout>
        <v-layout row wrap class="pt-3">
            <div v-for="item in loadRecipes">
                <v-flex xs10 offset-xs1>
                    <v-card
                            min-width="333"
                            class="mx-auto xs6 pt-5"
                    >
                        <v-card-title>{{ item.name }} </v-card-title>
                        <v-card-text> {{ item.description}}</v-card-text>
                        <v-card-actions>
                            <v-btn text>Open Recipe</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </div>
        </v-layout>
    </v-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        computed : {
            ...mapGetters([
                'loadRecipes',
                'loadIngredients'
            ])
        }
    }
</script>
