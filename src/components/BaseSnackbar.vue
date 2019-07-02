<template>
    <v-snackbar v-model="show" :color="color" :timeout="timeout" absolute right top>
        {{message}}
        <v-btn flat color="white" @click.native="show = false">Close</v-btn>
    </v-snackbar>
</template>

<script>
    export default {
        data () {
            return {
                show: false,
                message: '',
                color: '',
                timeout: 10000
            }
        },
        created() {
            this.$store.watch(state => state.snack, () => {
                const msg = this.$store.state.snackMessage;
                if (msg) {
                    this.show = true;
                    this.message = this.$store.state.snackMessage;
                    this.color = this.$store.state.snackColor;
                    this.$store.commit('setSnackbar', '');
                }
            })
        }
    }
</script>
