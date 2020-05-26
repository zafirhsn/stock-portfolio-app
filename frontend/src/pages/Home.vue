<template>
<v-container class="mt-12">

  <compHeader></compHeader>

  <v-row>

    <v-col cols="12" sm="5" align="center" justify="start">
        <h1 class="my-5">Portfolio - ${{portfolioValue}}</h1>
        <compPortfolio></compPortfolio>
    </v-col>


    <v-divider class="d-none d-sm-block mx-10" justify="end" vertical></v-divider>

    <v-col cols="12" sm="5" align="center">
      <h1 class="my-5">Cash - ${{cash}}</h1>
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
/**
 * User home after successfully logged in. Renders portfolio and buy form.
 * 
 * @component
 */

import Header from '../components/_Header.vue';
import Portfolio from '../components/_Portfolio.vue';
import reverse from '../utils/reverse';

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
      for (let item of this.$store.state.user.portfolio) {
        value += Number(item.value);
      }
      return value.toFixed(2);
    },
    cash() {
      if (this.$store.state.user.cash) {
        return (this.$store.state.user.cash).toFixed(2)
      }
        return '';
    },
    symbols() {
      return this.$store.state.symbols
    }
  },
  methods: {
    pollData() {
      /*

      1. Poll price data every 15 seconds from server
      2. Render accordingly

       */
    },
    /**
     * Sends ticker and quantity to server to validate purchase of stock. Renders with new data or shows error msg
     * @public
     */
    buy() {
      //console.log("Buy submitted")
      this.submitted = true;
      this.$http.post(`${process.env.VUE_APP_BACKEND_URL}/buy`, 
      { ticker: this.ticker, quantity: this.quantity }, {
        headers: {
          "Authorization": `Bearer ${this.$store.state.token}`
        }
      }).then((res)=> {
        //console.log(res);
        this.submitted = false;
        this.err = false;

        if (typeof res.body === "string") {
          this.err = true;
          this.errMsg = res.body;
          this.submitted = false;
        } else {

          let user = JSON.parse(sessionStorage.getItem("user"));
          let ohlc = JSON.parse(sessionStorage.getItem("ohlc"))

          user.cash = Number(res.body.data.cash.toFixed(2));
          user.transactions = reverse(res.body.data.transactions);
          user.portfolio = reverse(res.body.data.portfolio);

          let key = Object.keys(res.body.ohlc)[0];
          ohlc[key] = res.body.ohlc[key];

          this.$set(this.$store.state, "user", user)
          this.$set(this.$store.state, "ohlc" , ohlc);

          sessionStorage.setItem("user", JSON.stringify(user));
          sessionStorage.setItem("ohlc", JSON.stringify(ohlc));

          //console.log(this.$store.state);
        }

      }).catch(err=> {
        this.err = true;
        this.errMsg = "This service is currently unavailable";
        this.submitted = false;
        return err;
      })
    }

  },
  created() {
    // Pull all data from sessionStorage and use it to create base state
    let token = sessionStorage.getItem("token");
    let user = JSON.parse(sessionStorage.getItem("user"));
    let symbols = JSON.parse(sessionStorage.getItem("symbols"));
    let ohlc = JSON.parse(sessionStorage.getItem("ohlc"))

    this.$set(this.$store.state, "ohlc", ohlc);
    this.$set(this.$store.state, "token", token);
    this.$set(this.$store.state, "user", user);
    this.$set(this.$store.state, "symbols", symbols);

    //console.log(this.$store.state);


  }
}
</script>

<style lang="scss" scoped>

</style>