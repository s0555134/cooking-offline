<template>
    <div>
        <v-container>
            <v-layout class="pt-3">
                <v-flex xs12 md6 sm4 offset-sm3>
                    <h1 class="primary--text">Log in to continue</h1>
                    <router-link to="/signup" tag="span" style="cursor: pointer;  text-decoration: underline;" class="primary--text" >You dont have a account? Click here to Sign-Up!</router-link>
                </v-flex>
            </v-layout>
            <v-layout row class="pt-2">
                <v-flex xs12 md6 sm4 offset-sm3>
                    <v-card class="elevation-20">
                        <v-card-text>
                            <v-container>
                                <form @submit.prevent="onSignIn" lazy-validation>
                                    <v-layout row>
                                        <v-flex xs12>
                                            <v-text-field
                                                    v-model.lazy="email"
                                                    :rules="emailRules"
                                                    label="E-mail"
                                                    required
                                            ></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row>
                                        <v-flex xs12>
                                            <v-text-field
                                                    name="password"
                                                    label="Password"
                                                    id="password"
                                                    v-model.lazy="password"
                                                    type="password"
                                                    :rules="passwordRules"
                                                    required
                                                    >
                                            </v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row>
                                        <v-flex xs12>
                                            <v-btn type="submit">Sign in</v-btn>
                                        </v-flex>
                                    </v-layout>
                                </form>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>

    export default {
        data: () => ({
            valid: true,
            password: '',
            passwordRules: [
                v => !!v || 'Password is required',
                v => (v && v.length > 5) || 'Password must be longer than 5 characters'
            ],
            email: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid'
            ],
            select: null,
            checkbox: false
        }),
        computed: {
            user () {
                return this.$store.getters.user
            }
        },
        watch: {
            user(value) {
                if(value){
                    this.$router.push('/');
                }
            }
        },
        methods: {
            onSignIn() {
                this.$store.dispatch('signUserIn', { email: this.email, password: this.password });
            }
        }

    }
</script>
