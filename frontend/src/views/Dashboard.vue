<template>
  <div class="dashboard" v-if="accounts">
    <div class="w3-redx w3-content w3-container w3-margin-top" style="">
        <InnerNavbar />
        
        <div class="w3-padding">
            <br />

            <div class="w3-row">
              <div class="w3-black w3-padding w3-margin" style="display: inline-block">
                <div class="w3-small">
                  NUMBER OF BANKS CONNECTED
                </div>
                <div class="w3-large">
                  {{ accounts.length }}
                </div>
              </div>

              <div class="w3-black w3-padding" style="display: inline-block">
                <div class="w3-small">
                  TOTAL BANK BALANCE ACROSS ALL BANKS
                </div>
                <div class="w3-large">
                  NGN {{ (Number(totalBankBalance)/100).toLocaleString() }}
                </div>
              </div>

              <div class="w3-black w3-padding w3-margin" style="display: inline-block">
                <div class="w3-dropdown-hover w3-small">
                  <div class="w3-black">SWITCH BANK ACCOUNT <i class="fa fa-caret-down"></i></div>
                  <div class="w3-dropdown-content w3-bar-block w3-black">
                    <a class="w3-bar-item w3-button w3-hover-white" v-for="(account) in defaultAccountList" :key="account._id" @click="switchAccount(account.accountId)">
                      {{ account.bank }}
                    </a>
                  </div>
                </div>
                <div class="w3-large">
                  {{ defaultAccountDetails.bank }}
                </div>
              </div>
            </div>

            <br />

            <div class="w3-large w3-margin-top w3-row">
              <div class="w3-half">
                <div>Insights</div>
                <hr style="border: 3px solid black; max-width: 50px" />

                <canvas id="planet-chart"></canvas>
              </div>

              <div class="w3-half">
                <br />
                <br />
                <br />
                <br />


                <div class="w3-black w3-padding w3-margin-top">
                  <div class="w3-xlarge">TOTAL INFLOW</div>
                  <div class="w3-small"> NGN {{ (Number( totalValuationType('credit') )/100).toLocaleString() }}</div>
                </div>
                
                <div class="w3-black w3-padding">
                  <div class="w3-xlarge">TOTAL OUTFLOW</div>
                  <div class="w3-small"> NGN {{ (Number( totalValuationType('debit') )/100).toLocaleString() }}</div>
                </div>

              </div>
            </div>

            <br />

             <div class="w3-margin-bottom w3-margin-top w3-large w3-row">
               <!-- <div class="w3-twothird w3-padding-right"> -->
               <div class="w3-padding-right">

                <div>Latest Transactions</div>
                <!-- <div class="">View All</div> -->
                <hr style="border: 3px solid black; max-width: 50px" />

                <div v-if="transactions">
                  <div v-for="(transaction) in transactions.slice(0,6)" :key="transaction._id" >
                      <div class="w3-padding-small w3-medium w3-border-left w3-border-black w3-margin-bottom w3-half" style=";">
                        <div class="w3-margin-bottom">
                          {{ transaction.narration.slice(0,50) }}
                        </div>
                        <span class="w3-black w3-round w3-padding-small w3-margin-right"> NGN {{ (Number(transaction.amount)/100).toLocaleString() }}</span>
                        <span class="w3-black w3-round w3-padding-small w3-margin-right">
                          {{ handleEmptyCategory(transaction.category) }}
                          <i class="fa fa-pen fa-xs"></i>
                        </span>
                        <span class="w3-black w3-round w3-padding-small w3-margin-right"> {{ moment(transaction.date).format('MMM Do YY') }}</span>
                      </div>
                  </div>
                </div>
                <div v-else>
                  No transactions yet...
                </div>
               </div>

                <!-- <div class="w3-third">
                    <br />
                    <br />
                    <br />
                  <div class="w3-padding w3-round w3-black">
                    <div class="w3-margin-bottom w3-large">
                        My Spending Categories
                        <hr />
                    </div>
                    
                    <div v-for="(category, index) in categories" :key="category._id" >
                        <div class="w3-padding-smallx w3-large" style="margin: 0 0 20px 0;">
                            {{ index+1 }}.
                            {{ category.name }}
                        </div>
                    </div>
                  </div>
                </div> -->

                
                
            </div>

            
        </div>

      </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import Chart from 'chart.js/auto'
import Data from './planet-data.js'
import InnerNavbar from '../components/InnerNavbar.vue'

export default {
  name: 'Dashboard',
  data() {
    return {
      planetChartData: [],
      transactions: [],
    }
  },
   components: {
        InnerNavbar,
    },
   methods: {
    ...mapActions('services', ['getCategories', 'setDefaultAccount', 'getTransactionByAccountId', 'categoriseTransaction', 'unlinkAccount']),
    ...mapMutations('services', ['set_default_account']),

    switchAccount(id) {
      this.setDefaultAccount({accountId: id}).then(res => {
        // Update default account state
        this.set_default_account(id);

        // --
        this.getTransactionByAccountId(id)
          .then(res => {
            this.transactions = res.data.data;

            this.planetChartData = Data.ChartData( this.valuationSummary('credit'), this.valuationSummary('debit') )

            // const ctx = document.getElementById('planet-chart');
            new Chart(ctx, this.planetChartData);
            // console.log(res.data.data);
          })
          .catch((err) => {});

        // --
      })
      .catch((err) => {})
    },

    totalValuationType(type) {
      const result = this.transactions.filter(x =>
        x.type == type
      )
      .map(trx => Number(trx.amount))
      .reduce((prev,curr) => prev + curr, 0)
      return result;
    },

    valuationSummary(type) {
      const result = this.transactions.filter(x =>
        x.type == type
      )
      .map(trx => Number(trx.amount)/100)
      // .reduce((prev,curr) => prev + curr, 0)
      // .map(column => column.amount);
      return result;
    },

    handleEmptyCategory(category){
      if (!category) {
        return "Unclassified"
      }
      return category
    },

    unlinkAccount(accountId){
      this.unlinkAccount(accountId)
          .then(res => {
            alert('Account have been Unlinked')
          })
          .catch((err) => {});

    },

    categoriseTransaction(id, category){
      const data = {id, category};
      this.categoriseTransaction(data)
      .then(res=> {})
      .catch(res=>{})
    }

   },

   mounted() {
    // const ctx = document.getElementById('planet-chart');
    // new Chart(ctx, this.planetChartData);
  },

  created: function () {
    this.getCategories()
        .then(res => {})
        .catch((err) => {});
    
     this.getTransactionByAccountId(this.defaultAccount)
        .then(res => {
          this.transactions = res.data.data
          console.log(res.data.data);
          
          // Load up chart data
          console.log("Entering all trxs")
          this.planetChartData = Data.ChartData( this.valuationSummary('credit'), this.valuationSummary('debit') )

          const ctx = document.getElementById('planet-chart');
          new Chart(ctx, this.planetChartData);
          console.log("Existing all trxs")
        })
        .catch((err) => {});
    
    // console.log(this.accounts);
    console.log({categories: this.categories});


  },

  // Update later

  computed: {
    ...mapState('services', ['categories', 'accounts', 'defaultAccount']),
    // ...mapGetters('auth', ['user', ]),

    totalBankBalance: function(){
      return this.accounts
        .map(account => Number(account.balance))
        .reduce((prev,curr) => prev + curr, 0)
    },

    defaultAccountDetails: function () {
      
      if (this.accounts && this.accounts.length) {
        return this.accounts.find(x => x.accountId === this.defaultAccount);
      } else {
        return "";
      }
    },

    defaultAccountList: function (){
      const myData = this.accounts.filter(item => item.accountId !== this.defaultAccount);
      return myData;
    }

  }

}
</script>
