<template>
    <v-app-bar fixed elevate-on-scroll height="80" color="white">
      <v-spacer></v-spacer>
      <v-btn to="/home" small class="mr-3" depressed>Portfolio</v-btn>
      <v-btn to="/transactions" small class="mr-3" depressed>Transactions</v-btn>
      <v-btn to="/login" color="error" @click="logout()" small depressed>Logout</v-btn>
    </v-app-bar>

</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.token = '';
      this.$store.symbols = '';
      this.$store.state.name = '';
      this.$store.state.email = '';
      this.$store.state.cash = '';
      this.$store.state.transactions = [];
      this.$store.state.portfolio = [];

      sessionStorage.clear();


      this.$router.push('/login');
    }
  }
}
</script>

<style lang="scss" scoped>

</style>