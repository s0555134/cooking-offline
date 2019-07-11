<template>
    <div>
        <v-navigation-drawer
                v-model="drawer"
                absolute
                temporary
                app
        >
            <v-list class="pa-1">
                <v-list-tile-title>
                    <router-link to="/" tag="span" style="cursor: pointer">Cook Offline</router-link>
                </v-list-tile-title>
            </v-list>
            <v-list dense>
                <v-divider></v-divider>
                <v-list-tile
                        v-for="item in toolBarItems"
                        :key="item.title"
                        :to="item.link">
                    <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
            <v-list dense v-if="userIsAuthenticated">
                <v-divider></v-divider>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon>exit_to_app</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title @click="onLogout">Logout</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar color="indigo" dark fixed app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer" class="hidden-sm-and-up"></v-toolbar-side-icon>
            <v-toolbar-title>
                <router-link to="/" tag="span" style="cursor: pointer">Cook Offline</router-link>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-xs-only">
                <v-btn
                        flat
                        v-for="item in toolBarItems"
                        :key="item.title"
                        :to="item.link">
                    <v-icon left>{{item.icon}}</v-icon>
                    {{item.title}}
                </v-btn>
                <v-btn
                        flat
                        v-if="userIsAuthenticated"
                        @click="onLogout">
                    <v-icon left>exit_to_app</v-icon>
                    Logout
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                drawer: null,
            }
        },
        computed: {
            toolBarItems() {
                let toolBarItems = [
                    { icon: 'face', title:'Sign-up', link: '/signup' },
                    { icon: 'lock_open', title:'Sign-in', link: '/signin' },
                ];
                if (this.userIsAuthenticated) {
                    toolBarItems = [
                        { icon: 'cake', title:'Recipes', link: '/recipes' },
                        { icon: 'local_pizza', title:'My-Recipe', link: '/recipe/' + this.$route.params.id },
                        { icon: 'category', title:'Categories', link: '/categories' },
                        { icon: 'cloud_upload', title:'Create-Recipe', link: '/createrecipe' },
                    ];
                }
                return toolBarItems;
            },
            userIsAuthenticated() {
                return this.$store.getters.user !== null && this.$store.getters.user !== undefined;
            }
        },
        methods: {
            onLogout() {
                this.$store.dispatch('logout');
                this.$router.push('/signin');
            }
        }
    }
</script>
