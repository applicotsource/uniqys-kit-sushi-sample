<template>
  <div id="app">
    <p>私のアドレス: {{ myAddress }}</p>
    <div class="sushi-wrapper">
      <div class="sushi-box" v-for="sushi in sushiList" :key="sushi.id">
        <p>{{ myAddress === sushi.owner ? '私のおすし' : 'だれかのおすし' }}</p>
        <p>{{ code(sushi) }}</p>
        <p v-if="sushi.status === 'sell'">販売中</p>
        <p v-if="sushi.status === 'sell'">{{ sushi.price }} Gari</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  methods: {
    code(sushi) {
      const dna = new Buffer(sushi.dna)
      return {
        dish: dna.readUInt16BE(0) % 10,
        neta: dna.readUInt16BE(4) % 10,
        spice: dna.readUInt16BE(8) % 10,
      }
    }
  },
  data() {
    return {
      myAddress: '0xhogehoge',
      sushiList: [
        { // 自分の販売中じゃないおすし
          id: 1,
          status: 'normal',
          price: 0,
          owner: '0xhogehoge',
          dna: 'irjiorgoiwegjioergj'
        },
        { // 自分の販売中のおすし
          id: 2,
          status: 'sell',
          price: 0,
          owner: '0xhogehoge',
          dna: '0rtihij6i45h4jgioijerf'
        },
        { // 他の人の販売中じゃないおすし
          id: 3,
          status: 'normal',
          price: 0,
          owner: '0xhugahuga',
          dna: 'x3igwegjsij5gjj35p4hi45h'
        },
        { // 他の人の販売中のおすし
          id: 4,
          status: 'sell',
          price: 5000,
          owner: '0xhugahuga',
          dna: 'irjiorgoiwegjioergj'
        },
      ]
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
.sushi-wrapper {
  flex-wrap: wrap;
  display: flex;
}
.sushi-box {
  width: 200px;
  height: 300px;
  margin: 8px;
  border: 1px solid black;
}
</style>