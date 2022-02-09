<template>
  <div class="w3-padding-small">
		<!-- <div class="login-header">SIGN UP</div> -->

    <div class="main w3-padding-small">
      <div class="w3-center w3-xlarge">
        Login your Account
        <br>
        <hr>
      </div>
			<form @submit.prevent="loginUser" autocomplete="on">

        <div class="error" v-if="error_message">
          {{error_message}}
        </div>

        <div class="error" v-if="authError['loginError']">{{ authError['loginError'] }}<br/>
        </div>

				<div class="item">
          <input v-model="email" type="email" class="w3-input" placeholder="Email" value="a@a.com" required="">
				</div>

        <div class="item">
          <input v-model="password" type="password" class="w3-input" placeholder="Your Password" value="" required="">
        </div>

        <div class="item w3-center">
          <button-spinner
            :is-loading="isLoading"
            :disabled="isLoading"
            :status="status"
            class="button">
              Continue
          </button-spinner>
        </div>

        <hr />

        <router-link :to="{ name: 'Signup' }" class="w3-bar-item">
          <div class="w3-small w3-center">
            New here? <u>Create an Account</u>
          </div>      
        </router-link>

			</form>
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import VueButtonSpinner from 'vue-button-spinner';
export default {
  name: 'Login',
  data(){
    return {
      error_message : "",
      email: "",
      password: "",
      isLoading: false,
      status: '',
    }
  },
  methods: {
    ...mapActions('auth', ['login']),
    // ...mapMutations('auth', ['auth_reset']),
    
    loginUser: function () {
      this.error_message = ""        
      this.isLoading = true
      let userInfo = {
        email: this.email,
        password: this.password
      }
      
      this.login(userInfo).then(res => {})
      .catch((err) => {
        this.isLoading = false
      })
    
    }
  },
 
  components: {
    'button-spinner': VueButtonSpinner,
  },
//   beforeRouteLeave (to, from, next) {
//     this.auth_reset('signup')
//     next()
//   },
  computed:{
    ...mapState('auth', ['authError']),
  } 
}
</script>

<style scoped>
/* @import '../assets/css/login.css'; */
.main{
  /* background-color: red; */
  margin-top: 80px !important;
  margin: 0 auto;
  max-width: 400px;
}
.item{
  margin-top: 20px;
}
.button{
  /* margin: 0 auto; */
  width: 100%;
  height: 40px !important;
  margin-top: 10px;
  /* background-color: #1d4476cb !important; */
  background-color: black !important;
  color: #fff !important;
  border: none;
}
.error{
  background-color: #CE3939;
  padding: 8px;
  text-align: center;
  margin-top: 20px;
  color: #fff;
  border-radius: 4px;
}
</style>