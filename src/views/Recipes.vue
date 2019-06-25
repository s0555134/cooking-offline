<template>
    <div>
        <base-list-items :loadRecipes="loadRecipes"></base-list-items>
    </div>
</template>

<script>

    import BaseListItems from '../components/RecipesList'
    import {mapActions} from 'vuex'

    export default {
        components: {
            BaseListItems
        },
        computed: mapActions([
                    'loadRecipes'
        ])
    }
</script>

