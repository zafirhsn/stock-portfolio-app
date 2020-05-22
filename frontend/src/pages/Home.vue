<template>
<div>
  <h1>Home</h1>
  <compHeader></compHeader>
  
  <form @submit.prevent="buy()">
    <label for="ticker">Ticker: </label>
    <input type="text" id="ticker" name="ticker" v-model="ticker" required>
    <br>
    <br>
    <label for="quantity">Qty: </label>
    <input type="text" id="quantity" name="quantity" v-model="quantity" required>
    <br>
    <br>
    <button type="submit" value="Submit">Submit</button>
  </form>



  <a href="https://iexcloud.io">Data provided by IEX Cloud</a>
</div>
</template>

<script>
import Header from '../components/_Header.vue';

export default {
  data() {
    return {
      ticker: '',
      quantity: ''
    }
  },
  components: {
    'compHeader': Header
  },
  methods: {
    buy() {
      console.log("Buy submitted")

      /* 
      
      1. Make sure form can't be submitted empty 
      2. Make sure ticker submitted is a valid ticker symbol
      3. Make sure quantity is a positive whole number
      4. Send quantity and ticker symbol to server to validate purchase
      5. If err, show err msg (not enough cash)
      
      */
    }

  },
  beforeCreate() {
    // No access to variables here or DOM
  },
  created() {
    /* 
    
    1. Use JWT in Vuex store to render portfolio component
    2. 
    
    */
  },
  beforeMount() {

  },
  mounted() {

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