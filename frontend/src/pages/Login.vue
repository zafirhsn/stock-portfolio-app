<template>
  <div>
    <h1>Login</h1>
  
    <form @submit.prevent="submit()">
      <label for="email">Email: </label>
      <input type="email" id="email" name="email" v-model="email" required>
      <br>
      <br>
      <label for="password">Password: </label>
      <input type="password" id="pass" name="pass" v-model="pass" required>
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
      email: '',
      pass: '',
      err: false,
      errMsg: ''
    }
  },
  methods: {
    submit() {
      console.log("Login submitted")
      
      
      // 1. Prevent submission if fields empty - DONE
      // 2. Check email for @ - DONE
      // 3. Send email and password to server
      this.$http.post(`${process.env.VUE_APP_BACKEND_URL}/login`, { email: this.email, pass: this.pass }).then((res)=> {
        console.log(res);

        this.$store.token = res.body.token;
        console.log(this.$store.token);
        let payload = JSON.parse(atob(this.$store.token.split(".")[1]));
        console.log(payload);
        this.$store.state.email = payload.user.email;
        this.$store.state.cash = payload.user.cash;
        this.$store.state.transactions = payload.user.transactions;
        this.$store.state.portfolio = payload.user.portfolio;

        this.$store.state.symbols = res.body.symbols;
        console.log(this.$store.state);
        this.$router.push('/home');
      }).catch(error=> {
        this.err = true;
        this.errMsg = error;
      })

      // 4. Show necessary error msgs
      // 5. Or, save JWT in vuex and push /home
      
      
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