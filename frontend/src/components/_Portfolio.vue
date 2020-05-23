<template>
  <v-container>
    
    <v-card v-for="(item, index) of portfolio" :key="index" class="my-3" :color="(item.value / item.shares) > ohlc[item.symbol].open ? 'green lighten-3': 'red lighten-3' ">
      <v-card-title class="title font-weight-regular">
        <v-row dense>
          <v-col align="center">{{item.symbol}}</v-col>
          <v-divider vertical></v-divider>
          <v-col align="center">{{item.shares}} shares</v-col>
          <v-divider vertical></v-divider>
          <v-col align="center">{{item.value}}</v-col>
        </v-row>
      </v-card-title>
    </v-card>

  </v-container>
</template>

<script>
export default {
  data() {
    return {
      portfolio: this.$store.state.portfolio,
      ohlc: this.$store.ohlc
    }
  },
  methods: {
    pollData() {
      /*

      1. Poll price data every 15 seconds from server
      2. Render accordingly

       */
    }
  },
  beforeCreate() {

  },
  created() {
    /* 
    
    1. Take portfolio data from Vuex store and render in component
    2. Hit server for latest price info + open/close
    3. Render portfolio with correct colors
  
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