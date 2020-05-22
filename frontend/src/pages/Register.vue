<template>
  <div>
    <h1>Register</h1>

    <form @submit.prevent="submit()">
      <label for="name">Name: </label>
      <input type="text" id="name" name="name" v-model="name" required>
      <br>
      <br>
      <label for="email">Email: </label>
      <input type="email" id="email" name="email" v-model="email" required>
      <br>
      <br>
      <label for="password">Password: </label>
      <input type="password" id="pass" name="pass" v-model="pass" required>
      <br>
      <br>
      <label for="repassword">Repeat Password: </label>
      <input type="password" id="repass" name="repass" v-model="repass" required>
      <br>
      <br>
      <button type="submit" value="Submit">Submit</button>
    </form>
    <span class="custom-error" v-if="err">{{errMsg}}</span>
  </div>
</template>

<script>

export default {
  data() {
    return {
      name: '',
      email: '',
      pass: '',
      repass: '',
      err: false,
      errMsg: ''
    }
  },
  methods: {
    submit() {
      console.log("Register submitted")
      
      //1. Prevent submission if fields empty - DONE
      //1. check that name contains only letters, hyphens, and apostrophes
      //2. check that email contains @
      
      // Check that password is between 8 and 32 characters long , , 1 letter, and at least 8 character in length
      if (this.pass.length < 8 || this.pass.length > 32) {
        this.err = true;
        this.errMsg = "Password must be between 8 and 32 characters long"
        this.pass = '';
        this.repass = ''
      }
      // Contains at least 1 number
      else if (!this.pass.match(/[0-9]/)) {
        this.err = true;
        this.errMsg = "Password must contain at least one number (0-9)";
        this.pass = '';
        this.repass = '';
      }
      // Contains at least 1 letter
      else if (!this.pass.match(/[a-z,A-Z]/)) {
        this.err = true;
        this.errMsg = "Password must contain at least one letter";
        this.pass = '';
        this.repass = '';
      }
      // Contains at least 1 symbol
      else if (!this.pass.match(/[*.!@#$%^&(){}[\]:;<>,\.\?\/~_\+\-\=]/)) {
        this.err = true; 
        this.errMsg = "Password must contain at least one special character *.!@#$%^&(){}[]:;<>,.?/~_+-="
        this.pass = '';
        this.repass = '';
      }
      // Check that passwords match
      else if (this.pass !== this.repass) {
        this.err = true;
        this.errMsg = "Passwords must match"
        this.pass = '';
        this.repass = '';
      }
      // Send to server for server side validation
      else {
        this.err = false;
        this.$http.post(`${process.env.VUE_APP_BACKEND_URL}/register`, { name: this.name, email: this.email, pass: this.pass }).then((res)=>{
            console.log(res)
            this.$router.push('/login');
        }).catch(err=> {
          this.err = true;
          this.errMsg = err.body;
        });

      }

    }
  }

}

</script>

<style lang="scss" scoped>
  form {
    background-color: #d6d6d6
  }

  button {
    background-color: red;
  }

  input {
    border-style: solid;
    border-width: 1px;
  }

  .custom-error {
    color: #c40000;
    background-color: #ffb7b7;
  }
</style>