<template>
  <div class="dashboard">

    <div class="w3-redx w3-content w3-container w3-margin-top" style="">
        <div>
            <InnerNavbar />
            <br />

            <div class="w3-padding">
                <img @click="launchMono({reauthorise: false, reauthToken:''})" class="mono-button" src="@/assets/connect_button.png" alt="">
                <LoaderMin v-if="mainLoader" />
            </div>


            <div class="w3-col">

                <div v-if="accounts">
                    <div v-for="(account) in accounts" :key="account._id"  class="w3-third w3-round w3-padding">
                        <div class="w3-padding-small w3-large w3-round w3-black" style="margin: 0 0 20px 0;">
                            {{ account.accountName }}
                            ({{ account.accountNumber }})
                            <br />
                            {{ account.currency }}
                            {{ (Number(account.balance)/100).toLocaleString() }}
                            <br />
                            {{ account.bank }}
                        </div>
                    </div>
                </div>
                <div class="w3-padding" v-else>
                    No accounts added yet.
                </div>


            </div>

        </div>

      </div>

  </div>
</template>

<script>
// @ is an alias to /src
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import InnerNavbar from '../components/InnerNavbar.vue'
import LoaderMin from '../components/LoaderMin.vue'
import Connect from '@mono.co/connect.js'


export default {
  name: 'Accounts',
   data() {
        return{
            isLoading: true,
            mainLoader: false,
            notificationSystem: {
                options: {
                    error: {
                        position: "bottomRight"
                    },
                }
            },
        }
    },
  components: {
        InnerNavbar,
        LoaderMin
    },
   methods: {
        ...mapActions('services', ['getCategories', 'addAccount', 'fetchAccountId']),
        launchMono({reauthorise, reauthToken}) {
            // this.mainLoader = true;

            self = this;
            const connect = new Connect({
                key: process.env.VUE_APP_ENV_MONO_PUBLIC_KEY,
                onSuccess: ({code}) => {
                    self.mainLoader = true;
                    // Fetch account id and information with token on account endpoint
                    self.fetchAccountId(code)
                        .then(response => {

                            // Ensure unique accounts
                            let accountFound = self.accounts.find(o => o.accountNumber === response.data.account.accountNumber);

                            if (accountFound){
                                this.$toast.error(`${response.data.account.institution.name} Account already connected.`, 'Message:', this.notificationSystem.options.error)

                            }else{
                                // Add account to DB
                                console.log("Add account to DB");
                                console.log(response.data);
                                self.addAccount({
                                    userId: self.user.id,
                                    accountId: response.data.account._id,
                                    accountName: response.data.account.name || "n/a",
                                    accountNumber: response.data.account.accountNumber || "n/a",
                                    balance: `${response.data.account.balance}` || "n/a",
                                    currency: response.data.account.currency || "n/a",
                                    bank: response.data.account.institution.name || "n/a",
                                    type: response.data.account.type || "n/a",
                                    bvn: response.data.account.bvn || "n/a",
                                    // bvn: response.data.account.bvn == null ? "n/a" : response.data.account.bvn,
                                })
                            }

                            self.mainLoader = false;

                        })
                },
                onLoad: () => console.log("widget loaded successfully"),
                onClose: () => {
                    // this.mainLoader = false;
                    console.log("widget has been closed");
                },
                onEvent: (eventName, data) => {
                    console.log(eventName);
                    console.log(data);
                },
                reference: "random_ref_string"
            });

            if (reauthorise) {
                connect.reauthorise(reauthToken);
            }else{
                connect.setup();
            }

            connect.open();
            // return connect;
        },
   },

  created: function () {
    this.getCategories()
        .then(res => {})
        .catch((err) => {})

    // console.log(this.accounts);
    console.log({categories: this.categories});
  },




  computed: {
    ...mapState('auth', ['user']),
    ...mapState('services', ['categories', 'accounts']),
    // ...mapGetters('auth', ['user', ]),
  },





  
}
</script>

<style scoped>
.mono-button{
    width: 200px;
}
</style>