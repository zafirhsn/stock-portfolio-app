<template>
  <v-container class="mt-12">
    <h1 class="mt-12">Transactions</h1>
    <compHeader></compHeader>
    <v-card v-for="(item, index) of transactions" :key="index" class="my-3">
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
import Header from '../components/_Header.vue'

export default {
  data() {
    return {
      transactions: this.$store.state.transactions,
    }
  },
  components: {
    'compHeader': Header
  },
  methods: {

  },
  beforeCreate() {

  },
  created() {
    /* 
    
    1. Take transactions data from Vuex and render accordingly
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

</style>