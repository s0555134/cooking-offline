<template>
    <div>
        <v-container>
            <v-layout pt-4>
                <v-flex xs12>
                    <v-btn color="primary" to="/createrecipe">Create a Recipe</v-btn>
                </v-flex>
                <v-flex xs12>
                    <v-btn color="primary" :disabled="isEnableButton" @click="askForNotification()">Enable-Notifications</v-btn>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: 'App',
        components: {

        },
        mounted() {
            if ('navigation' in window) {
                this.isEnableButton = true;
            }
        },
        data () {
            return {
                isEnableButton: false
            }
        },
        methods: {
            askForNotification() {
                Notification.requestPermission(result => {
                    console.log("User Choice: ", result);
                    if(result !== "granted") {
                        console.log("No Permission granted by User");
                    } else {
                        this.handlePushSubscription();
                    }
                })
            },
            handlePushSubscription() {
              if (!('serviceWorker' in navigator && 'SyncManager' in window)) {
                  return;
              }
              var swReqistration;
              navigator.serviceWorker.getRegistration()
                  .then(swReq => {
                      swReqistration = swReq;
                      return swReq.pushManager.getSubscription()
                  })
                  .then(sub => {
                      if (sub) {
                          /**Subscription already exist  **/
                          console.log("Sub already exist: ", sub);
                      } else {
                          /** Create a new Subscription **/
                          return swReqistration.pushManager.subscribe({
                              userVisibleOnly: true
                          });
                      }
                  })
                  .then( newSub => {
                      console.log("Subscription: ",newSub);
                      if(newSub) {
                          return axios.post('/create-subscription', newSub)
                      }
                  })
                  .then(() => {
                          this.openNotification();
                  })
                  .catch(err => {
                      console.log(err.message);
                      this.$store.commit('setSnackbar', { text: err.message, color:'warning', snack:true });
                  })
            },
            openNotification() {
                if ("serviceWorker" in navigator) {
                    var options = {
                        body: "Cook-Offline",
                        icon: "./images/src/assets/notification_icon.png",
                        image: "./images/src/assets/notification_image.jpg",
                        vibrate: [100, 50, 200],
                        badge: "./images/src/assets/notification_icon.png",
                        tag: "notificationTagID",
                        renotify: true,
                        actions: [
                            { action: "confirm", title: "Okay", icon: "./images/src/assets/notification_checkmark.png" },
                            { action: "cancel", title: "Cancel", icon: "./images/src/assets/notification_xmark.png" }
                        ]
                    };
                    navigator.serviceWorker.getRegistration()
                        .then(swReq => {
                          swReq.showNotification("Successfully Subscription", options)
                        })
                }
            }
        }
    }
</script>
