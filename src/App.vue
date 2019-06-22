<template>
    <v-app>
        <snackbar/>
        <dialog-progressbar/>
        <header-navigation-bar/>
        <main>
            <router-view/>
        </main>
        <my_footer/>
    </v-app>
</template>

<script>
    import headerNavigationBar from './components/BaseHeader'
    import my_footer from './components/BaseFooter'
    import snackbar from './components/BaseSnackbar'
    import dialogProgressbar from './components/BaseDialogProgressbar'

    export default {
        name: 'App',
        components: {
            headerNavigationBar,
            my_footer,
            snackbar,
            dialogProgressbar
        }
    }
</script>
