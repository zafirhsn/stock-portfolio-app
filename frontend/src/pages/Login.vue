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

  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      pass: ''
    }
  },
  methods: {
    submit() {
      console.log("Login submitted")
      /* 
      
      1. Prevent submission if fields empty
      2. Check email for @
      3. Send email and password to server
      4. Show necessary error msgs
      5. Or, save JWT in vuex and push /home
      
      */
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
</style>