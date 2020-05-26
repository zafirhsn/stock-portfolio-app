<template>
  <v-container>

    <v-row class="mt-10">
      <v-col align="center" justify="center" sm="8" md="6" xl="4" offset-sm="2" offset-md="3" offset-xl="4">
        <v-sheet elevation="12" class="pa-6">
        
        <v-row>
          <v-col align="center" justify="center">
            <p class="display-2">Register</p>
          </v-col>
        </v-row>

        <v-container>
          <v-form @submit.prevent="submit()" v-model="valid">

            <v-text-field label="Name" id="name" name="name" background-color="#eeeeee" v-model="name" :rules="[rules.required]" outlined required></v-text-field>

            <v-text-field type="email" label="Email" id="email" name="email" background-color="#eeeeee" v-model="email" :rules="[rules.required, rules.email]" outlined required></v-text-field>


            <v-text-field type="password" label="Password" id="pass" name="pass" background-color="#eeeeee" v-model="pass" hint="8-32 characters long, 1 number, 1 symbol, and 1 letter" :rules="[rules.required, rules.len, rules.num, rules.letter, rules.symbol]" outlined required></v-text-field>

            <v-text-field type="password" label="Re-type password" id="repass" name="repass" background-color="#eeeeee" v-model="repass" :rules="[rules.required, rules.match]" outlined required></v-text-field>

            <v-btn type="submit" color="green" :loading="submitted" :disabled="!valid" large>Register</v-btn>
          </v-form>
        </v-container>

        <v-row>
          <v-col>
            <v-alert type="error" v-if="err">{{errMsg}}</v-alert>
            <v-alert type="success" v-if="success">{{successMsg}}</v-alert>
          </v-col>
        </v-row>

        </v-sheet>
      </v-col>
    </v-row>



    <v-row>
      <v-col align="center">
        <router-link to="/login">Login</router-link>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>

/**
 * Registers users using name, email, and password. Performs validation of email and password.
 * 
 * @component
 */

export default {
  data() {
    return {
      name: '',
      email: '',
      pass: '',
      repass: '',
      valid: false,
      err: false,
      errMsg: '',
      success: false,
      successMsg: '',
      submitted: false,
      // Client side validation rules
      rules: {
        required: v => !!v || "Required",
        len: v => (v.length >= 8 && v.length <=32) || 'Must be between 8 and 32 characters long',
        num: v => {
          const pattern = /[0-9]/;
          return pattern.test(v) || "Must contain at least 1 number"
        },
        letter: v => {
          const pattern = /[a-z,A-Z]/;
          return pattern.test(v) || "Must contain at least 1 letter"
        },
        symbol: v => {
          const pattern = /[*.!@#$%^&(){}[\]:;<>,\.\?\/~_\+\-\=]/;
          return pattern.test(v) || "Must contain at least 1 symbol *.!@#$%^&(){}[]:;<>,.?/~_+-="          
        },
        match: v => (this.pass === v) || "Passwords must match",
        email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      }
    }
  },
  methods: {
    /**
     * Sends from data to server for validation. If valid, pushes user to /login. If not, displays error message.
     * @public
     */
    submit() {
      //console.log("Register submitted")
      this.submitted = true;
      this.err = false;
      if (this.valid) {
        this.err = false;
        this.$http.post(`${process.env.VUE_APP_BACKEND_URL}/register`, { name: this.name, email: this.email, pass: this.pass }).then((res)=>{
            //console.log(res)

            if (res.body !== 'OK') {
              this.err = true;
              this.errMsg = res.body;
              this.name = '';
              this.email = '';
              this.pass = '';
              this.repass = '';
              this.submitted = false;        
            } else {
              // console.log("success")
              this.success = true;
              this.successMsg = "Successfully created user, you will be redirected to log in..."
              let push = () => {
                this.$router.push('/login')
              }
              setTimeout(push, 3000);
            }


        }).catch(err=> {
          this.err = true;
          this.errMsg = "This service is currently unavailable";
          this.name = '';
          this.email = '';
          this.pass = '';
          this.repass = '';
          this.submitted = false;
          return err;
        });
      } else {
        this.submitted = false;
      }

    }
  }

}

</script>

<style lang="scss" scoped>

</style>