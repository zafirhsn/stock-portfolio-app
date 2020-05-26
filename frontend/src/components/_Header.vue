<template>
    <v-app-bar fixed elevate-on-scroll height="80" color="white">
      <v-spacer></v-spacer>
      <v-btn to="/home" small class="mr-3" depressed>Portfolio</v-btn>
      <v-btn to="/transactions" small class="mr-3" depressed>Transactions</v-btn>
      <v-btn to="/login" color="error" @click="logout()" small depressed>Logout</v-btn>
    </v-app-bar>

</template>

<script>
/**
 * App wide header allowing user to switch pages and logout.abnf
 * @component
 */

export default {
  computed: {
    name() {
      return this.$store.state.user.name
    }
  },
  methods: {
    /** 
     * Clear state variables and sessionStorage and user user to /login
     * 
     * @public
    */
    logout() {
      this.$store.state.token = '';
      this.$store.state.symbols = '';
      this.$store.state.user.name = '';
      this.$store.state.user.email = '';
      this.$store.state.user.cash = '';
      this.$store.state.user.transactions = [];
      this.$store.state.user.portfolio = [];
      this.$store.state.ohlc = {};

      sessionStorage.clear();


      this.$router.push('/login');
    }
  }
}
</script>

<style lang="scss" scoped>

</style>