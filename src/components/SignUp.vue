<template>
    <div>
       <v-container>
           <v-layout class="pt-3">
               <v-flex xs12 md6 sm4 offset-sm3>
                   <h1 class="primary--text">Sign-Up to create your own recipe.</h1>
               </v-flex>
           </v-layout>
           <v-layout row class="pt-2">
               <v-flex xs12 sm6 offset-sm3>
                   <v-card class="elevation-20">
                       <v-card-text>
                           <v-container>
                               <form @submit.prevent="onSignup">
                                   <v-layout row>
                                       <v-flex xs12>
                                           <v-text-field
                                                   v-model.lazy="displayName"
                                                   :rules="displayNameRules"
                                                   label="Name"
                                                   required
                                           ></v-text-field>
                                       </v-flex>
                                   </v-layout>
                                   <v-layout row>
                                       <v-flex xs12>
                                           <v-text-field
                                                   v-model="email"
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
                                               v-model="password"
                                               type="password"
                                               :rules="passwordRules"
                                               required>
                                           </v-text-field>
                                       </v-flex>
                                   </v-layout>
                                   <v-layout row>
                                       <v-flex xs12>
                                           <v-text-field
                                                   name="confirmPassword"
                                                   label="confirm Password"
                                                   id="confirmPassword"
                                                   v-model="confirmPassword"
                                                   type="password"
                                                   :rules="[comparePasswords]">
                                           </v-text-field>
                                       </v-flex>
                                   </v-layout>
                                   <v-layout row>
                                       <v-flex xs12>
                                           <v-btn type="submit">Sign up</v-btn>
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
    import {mapActions} from 'vuex'

    export default {
        name: 'App',
        components: {

        },
        data: () => ({
            valid: true,
            displayName: '',
            displayNameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length > 1) || 'Set your name before continue'
            ],
            password: '',
            passwordRules: [
                v => !!v || 'Password is required',
                v => (v && v.length > 6) || 'Password must be bigger than 6 characters'
            ],
            confirmPassword:'',
            email: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid'
            ],
            select: null,

            checkbox: false
        }),
        computed: {
            comparePasswords() {
                return this.password !== this.confirmPassword ? 'Passwords do not match' : true﻿
            },
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
            onSignup() {
                    this.$store.dispatch('signUserUp', { displayName: this.displayName, email: this.email, password: this.password });
            }
        }

    }
</script>
