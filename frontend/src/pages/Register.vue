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
      
      //3. Check that password has 1 number, 1 symbol, 1 letter, and at least 8 character in length
      if (this.pass.length < 8) {
        this.err = true;
        this.errMsg = "Password must be at least 8 characters long"
        this.pass = '';
        this.repass = ''
      }
      if (this.pass !== this.repass) {
        this.err = true;
        this.errMsg = "Passwords must match"
        this.pass = '';
        this.repass = '';
      }
      if (this.pass === this.repass & this.pass.length >= 8) {
        this.errMsg = "Good job"
        setTimeout(()=> {
          this.$router.push('/home')
        },2000);
      }
      //4. Check that passwords match
      //5. Send data to backend
      

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