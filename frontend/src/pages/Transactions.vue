<template>
  <div>
    <h1>Transactions</h1>
    <compHeader></compHeader>
  </div>
</template>

<script>
import Header from '../components/_Header.vue'

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