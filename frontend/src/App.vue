<template>
  <div id="app">
    <p>私のアドレス: {{ myAddress }}</p>
    <p>こんにちは！</p>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      myAddress: '0xhogehoge',
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>