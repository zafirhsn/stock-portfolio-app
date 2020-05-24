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
export default {
  data() {
    return {
      email: '',
      pass: '',
      err: false,
      errMsg: '',
      valid: false,
      submitted: false,
      rules: {
        required: v => !!v || "Required",
        email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      }
    }
  },
  methods: {
    submit() {
      console.log("Login submitted")
      this.submitted = true;
      this.err = false;
      if (this.valid) {
        // 1. Prevent submission if fields empty - DONE
        // 2. Check email for @ - DONE
        // 3. Send email and password to server
        this.$http.post(`${process.env.VUE_APP_BACKEND_URL}/login`, { email: this.email, pass: this.pass }).then((res)=> {
          console.log(res);

          sessionStorage.setItem("token", res.body.token);

          // this.$store.token = res.body.token;
          // console.log(this.$store.token);
          let payload = JSON.parse(atob(res.body.token.split(".")[1]));
          console.log(payload);

          sessionStorage.setItem("user", JSON.stringify(payload.user));


          // this.$store.state.email = payload.user.email;
          // this.$store.state.cash = payload.user.cash;
          // this.$store.state.transactions = payload.user.transactions;
          // this.$store.state.portfolio = payload.user.portfolio;

          sessionStorage.setItem("symbols", JSON.stringify(res.body.symbols))

          // this.$store.symbols = res.body.symbols;
          if (res.body.ohlc) {
            sessionStorage.setItem("ohlc", JSON.stringify(res.body.ohlc));
          }

          // this.$store.ohlc = res.body.ohlc;
          // console.log(this.$store.state);
          this.$router.push('/home');
        }).catch(error=> {
          this.submitted = false;
          this.email = '';
          this.pass = '';
          this.err = true;
          this.errMsg = error.body;
        })
      } else {
        this.submitted = false;
      }
      // 4. Show necessary error msgs
      // 5. Or, save JWT in vuex and push /home
        
    }
  }

}
</script>

<style lang="scss" scoped>


</style>