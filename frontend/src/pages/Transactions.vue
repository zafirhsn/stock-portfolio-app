<template>
  <v-container class="mt-12">
    <h1 class="mt-12">Transactions</h1>
    <compHeader></compHeader>
    <v-card v-for="(item, index) of transactions" :key="index" class="my-3" color="#eeeeee" flat>
      <v-card-title class="title font-weight-regular">
        <v-row dense>
          <v-col align="center">BUY ({{item.symbol}})</v-col>
          <v-divider vertical></v-divider>
          <v-col align="center">{{item.shares}} shares</v-col>
          <v-divider vertical></v-divider>
          <v-col align="center">{{item.price}}</v-col>
        </v-row>
      </v-card-title>
    </v-card>

  </v-container>

</template>

<script>
/**
 * Renders transactions from user object
 * 
 * @component
 */

import Header from '../components/_Header.vue'

export default {
  data() {
    return {

    }
  },
  components: {
    'compHeader': Header
  },
  computed: {
    transactions() {
      return this.$store.state.user.transactions
    }
  },
  methods: {

  },
  created() {
    let user = JSON.parse(sessionStorage.getItem("user"));
    this.$set(this.$store.state.user, "transactions", user.transactions)
    this.$set(this.$store.state.user, "name", user.name)
    //console.log(this.$store.state);

  }
}
</script>

<style lang="scss" scoped>

</style>