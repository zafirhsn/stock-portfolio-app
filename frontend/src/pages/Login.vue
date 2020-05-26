<template>
  <v-container>
    <v-row class="mt-10">
      <v-col align="center" justify="center" sm="8" md="6" xl="4" offset-sm="2" offset-md="3" offset-xl="4">

        <v-sheet elevation="12" class="pa-6">

        <v-row>
          <v-col align="center" justify="center">
            <p class="display-2">Login</p>
          </v-col>
        </v-row>

        <v-container>
          <v-form @submit.prevent="submit()" v-model="valid">

            <v-text-field type="email" label="Email" id="email" name="email" background-color="#eeeeee" v-model="email" :rules="[rules.required, rules.email]" outlined required></v-text-field>

            <v-text-field type="password" label="Password" id="pass" name="pass" background-color="#eeeeee" v-model="pass" :rules="[rules.required]" outlined required></v-text-field>

            <v-btn type="submit" color="green" :loading="submitted" :disabled="!valid" large>Login</v-btn>
          </v-form>
        </v-container>

        <v-row>
          <v-col>
            <v-alert type="error" v-if="err">{{errMsg}}</v-alert>
          </v-col>
        </v-row>

        </v-sheet>


      </v-col>
    </v-row>

    <v-row>
      <v-col align="center">
        <router-link to="/register">Register</router-link>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
/** 
 * Logs in a user given the correct email and password
 * 
 * @component`
*/

import reverse from '../utils/reverse';

export default {
  data() {
    return {
      email: '',
      pass: '',
      err: false,
      errMsg: '',
      valid: false,
      submitted: false,
      // Client side validation rules
      rules: {
        required: v => !!v || "Required",
        email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      }
    }
  },
  methods: {
    /**
     * Performs basic email validation and submits form data to server for validation. If valid, stores data from response in state and sessionStorage
     *
     * @public
     */
    submit() {
      //console.log("Login submitted")
      this.submitted = true;
      this.err = false;
      if (this.valid) {
        this.$http.post(`${process.env.VUE_APP_BACKEND_URL}/login`, { email: this.email, pass: this.pass }).then((res)=> {
          //console.log(res);

          // If the body is a string then it is a user defined err exception, so render to screen
          if (typeof res.body === "string") {
            this.submitted = false;
            this.email = '';
            this.pass = '';
            this.err = true;
            this.errMsg = res.body;
          } else {
            let payload = JSON.parse(atob(res.body.token.split(".")[1]));
            //console.log(payload);

            let portfolio = reverse(payload.user.portfolio);
            let transactions = reverse(payload.user.transactions);

            let user = {
              name: payload.user.name,
              email: payload.user.email,
              cash: payload.user.cash,
              portfolio, 
              transactions
            }
            //console.log(user);
            // Save token, user, symbols, and ohlc in sessionStorage and push user home
            sessionStorage.setItem("token", res.body.token);
            sessionStorage.setItem("user", JSON.stringify(user));
            sessionStorage.setItem("symbols", JSON.stringify(res.body.symbols))
            sessionStorage.setItem("ohlc", JSON.stringify(res.body.ohlc))

            this.$router.push('/home');
          }
        }).catch(error=> {
          this.submitted = false;
          this.email = '';
          this.pass = '';
          this.err = true;
          this.errMsg = "This service is currently unavailable";
          return error;
        })
      } else {
        this.submitted = false;
      }
    }
  }

}
</script>

<style lang="scss" scoped>


</style>