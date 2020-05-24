<template>
<v-container class="mt-12">

  <compHeader></compHeader>

  <v-row>

    <v-col cols="12" sm="5" align="center" justify="start">
        <h2 class="display-1 my-5">Portfolio - ${{portfolioValue}}</h2>
        <compPortfolio></compPortfolio>
    </v-col>


    <v-divider class="d-none d-sm-block mx-10" justify="end" vertical></v-divider>

    <v-col cols="12" sm="5" align="center">
      <h2 class="display-1 my-5">Cash - ${{cash}}</h2>
      <v-form @submit.prevent="buy()" v-model="valid">

        <v-autocomplete background-color="#eeeeee" placeholder="Ticker" v-model="ticker" :rules="[rules.required]" :items="symbols" hide-no-data outlined full-width>
        </v-autocomplete>

        <v-text-field type="text" label="Quantity" id="quantity" name="quantity" background-color="#eeeeee" v-model="quantity" :rules="[rules.required, rules.integer]" outlined required></v-text-field>

        <v-btn type="submit" color="green" class="mt-10" :loading="submitted" :disabled="!valid" large block>Buy</v-btn>
      </v-form>
      <v-alert type="error" class="mt-10" v-if="err">{{errMsg}}</v-alert>
    </v-col>
  </v-row>




  <a href="https://iexcloud.io">Data provided by IEX Cloud</a>
</v-container>
</template>

<script>
import Header from '../components/_Header.vue';
import Portfolio from '../components/_Portfolio.vue';

export default {
  data() {
    return {
      ticker: '',
      quantity: '',
      err: false,
      errMsg: '',
      submitted: false,
      valid: false,
      rules: {
        required: v => !!v || "Required",
        integer: v => Number.isInteger(Number(v)) || "Quantity must be integer"
      }
    }
  },
  components: {
    'compHeader': Header,
    'compPortfolio': Portfolio
  },
  computed: {
    portfolioValue() {
      let value = 0;
      for (let item of this.$store.state.portfolio) {
        value += Number(item.value);
      }
      return value.toFixed(2);
    },
    cash() {
      if (this.$store.state.cash) {
        return (this.$store.state.cash).toFixed(2)
      }
        return '';
    },
    symbols() {
      return this.$store.symbols
    }
  },
  methods: {
    buy() {
      console.log("Buy submitted")
      this.submitted = true;
      this.$http.post(`${process.env.VUE_APP_BACKEND_URL}/buy`, 
      { ticker: this.ticker, quantity: this.quantity }, {
        headers: {
          "Authorization": `Bearer ${this.$store.token}`
        }
      }).then((res)=> {
        console.log(res);
        this.submitted = false;
        this.err = false;

        let user = JSON.parse(sessionStorage.getItem("user"));
        let ohlc;
        if (sessionStorage.getItem("ohlc")) {
          ohlc = JSON.parse(sessionStorage.getItem("ohlc"));
        } else {
          ohlc = {};
        }

        user.cash = Number(res.body.data.cash);
        user.transactions = res.body.data.transactions;
        user.portfolio = res.body.data.portfolio;
        let key = Object.keys(res.body.ohlc)[0];
        ohlc[key] = res.body.ohlc[key];

        this.$set(this.$store.state, "cash", user.cash);
        this.$set(this.$store.state, "transactions", user.transactions)
        this.$set(this.$store.state, "portfolio", user.portfolio);
        this.$set(this.$store, ohlc , ohlc);

        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("ohlc", JSON.stringify(ohlc));

        console.log(this.$store.state);
        console.log(this.$store.ohlc);


      }).catch(err=> {
        this.err = true;
        this.errMsg = err.body;
        this.submitted = false;
      })
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

    let token = sessionStorage.getItem("token");
    let user = JSON.parse(sessionStorage.getItem("user"));
    let symbols = JSON.parse(sessionStorage.getItem("symbols"));

    let ohlc;
    if (sessionStorage.getItem("ohlc")) {
      ohlc = JSON.parse(sessionStorage.getItem("ohlc"));
      this.$store.ohlc = ohlc
      console.log(this.$store.ohlc);
    }

    this.$set(this.$store, "token", token);

    this.$set(this.$store.state, "cash", Number(user.cash));
    this.$set(this.$store.state, "transactions", user.transactions)
    this.$set(this.$store.state, "portfolio", user.portfolio);


    this.$set(this.$store, "symbols", symbols);
    console.log(this.$store.state);


  },
  beforeMount() {

  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>

</style>