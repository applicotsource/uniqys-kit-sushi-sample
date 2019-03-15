<template>
  <div id="app">
    <p>私のアドレス: {{ myAddress }}</p>
    <p>{{ myGari }} Gari</p>
    <button @click="generate()">にぎる</button>
    <div class="sushi-wrapper">
      <div class="sushi-box" v-for="sushi in sushiList" :key="sushi.id">
        <p>{{ myAddress === sushi.owner ? '私のおすし' : 'だれかのおすし' }}</p>
        <div class="sushi-image-box">
          <img :src="`/img/sushi/dish/dish-0${code(sushi).dish}.png`" alt="">
          <img :src="`/img/sushi/syari/syari.png`" alt="">
          <img :src="`/img/sushi/neta/neta-0${code(sushi).neta}.png`" alt="">
          <img :src="`/img/sushi/spice/spice-0${code(sushi).spice}.png`" alt="">
        </div>
        <p v-if="sushi.status === 'sell'">販売中</p>
        <p v-if="sushi.status === 'sell'">{{ sushi.price }} Gari</p>
        <div v-if="myAddress === sushi.owner && sushi.status === 'normal'">
          <input type="text" placeholder="販売額" v-model="price[sushi.id]">
          <button @click="sell(sushi, price[sushi.id])">売る！</button>
        </div>
        <div v-if="myAddress !== sushi.owner && sushi.status === 'sell'">
          <button @click="buy(sushi)">買う！</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EasyClientForBrowser } from '@uniqys/easy-client'
export default {
  name: 'app',
  created() {
    this.fetchMyAddress()
    this.fetchMyGari()
    this.fetchSushiList()
  },
  methods: {
    async fetchMyAddress() {
      this.myAddress = this.client.address.toString()
    },
    async fetchSushiList() {
      const response = await this.client.get('/api/sushiList')
      const { sushiList } = response.data
      this.sushiList = sushiList
    },
    code(sushi) {
      const dna = new Buffer(sushi.dna)
      return {
        dish: dna.readUInt16BE(0) % 10,
        neta: dna.readUInt16BE(4) % 10,
        spice: dna.readUInt16BE(8) % 10,
      }
    },
    generate() {
      const newId = this.sushiList.length + 1
      this.myGari -= 100
      this.sushiList.unshift({
        id: newId,
        status: 'normal',
        price: 0,
        owner: this.myAddress,
        dna: Math.random().toString(36) // ランダムな文字列を生成
      })
    },
    sell(sushi, price) {
      sushi.status = 'sell'
      sushi.price = price
    },
    buy(sushi) {
      this.myGari -= sushi.price
      sushi.status = 'normal'
      sushi.price = 0
      sushi.owner = this.myAddress
    },
    async fetchMyGari() {
      const response = await this.client.get('/api/gari', { params: { address: this.myAddress } })
      const { balance } = response.data
      this.myGari = balance
    },
  },
  data() {
    return {
      client: new EasyClientForBrowser('http://localhost:8080'),
      myAddress: '',
      myGari: 0,
      price: [],
      sushiList: []
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
.sushi-image-box {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto;
}
.sushi-image-box img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
}
</style>