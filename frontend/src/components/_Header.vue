<template>
  <div>
    <router-link to="/home">Portfolio</router-link><span> | </span>
    <router-link to="/transactions">Transactions</router-link><span> | </span>
    <router-link to="/login" @click="logout()">Logout</router-link>
    
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>

</style>