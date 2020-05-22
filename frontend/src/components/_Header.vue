<template>
  <div>
    <router-link to="/home">Portfolio</router-link><span> | </span>
    <router-link to="/transactions">Transactions</router-link><span> | </span>
    <router-link to="/login" @click="logout()">Logout</router-link>
    
  </div>
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
      this.$store.state.transactions = {};
      this.$store.state.portfolio = {};
      this.$router.push('/login');
    }
  }
}
</script>

<style lang="scss" scoped>

</style>