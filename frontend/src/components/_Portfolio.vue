<template>
  <v-container>
    
    <!-- Use v-for loop to render each transaction from state -->
    <v-card v-for="(item, index) of portfolio" :key="index" class="my-3" :color="color(item)" flat>
      <v-card-title class="title font-weight-regular">
        <v-row dense>
          <v-col align="center">{{item.symbol}}</v-col>
          <v-divider vertical></v-divider>
          <v-col align="center">{{item.shares}} shares</v-col>
          <v-divider vertical></v-divider>
          <v-col align="center">${{item.value}}</v-col>
        </v-row>
      </v-card-title>
    </v-card>

  </v-container>
</template>

<script>
/**
 * Render portfolio as a list of stocks owned with color determined by opening price.
 * @component
 */

export default {
  data() {
    return {

    }
  },
  computed: {
    portfolio() {
      return this.$store.state.user.portfolio
    },
    ohlc() {
      return this.$store.state.ohlc
    }
  },
  methods: {
    /**
     * Apply color class based on latest price of stock compared to opening price
     * @param {Object} item - object within user portfolio array { symbol, shares, value}
     * @public
     */
    color(item) {
      if ((item.value / item.shares) > this.$store.state.ohlc[item.symbol].open) {
        return 'green lighten-3'
      }
      else if ((item.value / item.shares) < this.$store.state.ohlc[item.symbol].open) {
        return 'red lighten-3'
      } else {
        return 'grey lighten-2'
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>