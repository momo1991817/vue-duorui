<template>
  <div class="Receivingpage">
    <div class="Receivingpage-box">
      <div class="box">
        <img src="../../../../static/Receivingpage/receiving-img.png" alt />
        <div class="box-title">签到成功</div>
        <div class="box-font">
          今日收益
          <span>+100</span> 金币
        </div>
        <div class="box-button" @click="Receivingpage">朕知道了</div>
      </div>
    </div>
  </div>
</template>

<script>
import bridge from "@/js/bridge.js";
export default {
  name: "Receivingpage",
  props: ["list"],
  data() {
    return {};
  },
  created() {},
  methods: {
    Receivingpage() {
      this.$emit("Receivingpage", false);
    }
  }
};
</script>

<style scoped lang="less">
.Receivingpage {
  > .Receivingpage-box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5) no-repeat;
    > .box {
      width: 2.1rem;
      height: 2.5rem;
      background-color: #ffffff;
      box-shadow: 0rem 0.025rem 0.089rem 0.001rem rgba(247, 86, 83, 0.63);
      border-radius: 0.1rem;
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      overflow: hidden;
      > img {
        width: 1.26rem;
        height: 1.04rem;
        margin: 0.175rem auto auto auto;
        display: block;
      }
      > .box-title {
        font-size: 0.15rem;
        font-weight: bold;
        color: #fd5758;
        margin-top: 0.21rem;
      }
      > .box-font {
        font-size: 0.13rem;
        font-weight: normal;
        color: #666666;
        margin-top: 0.095rem;
        > span {
          color: #fd5758;
        }
      }
      > .box-button {
        margin: 0.125rem auto auto auto;
        width: 1.09rem;
        height: 0.32rem;
        background-image: linear-gradient(90deg, #f96946 0%, #f75455 100%),
          linear-gradient(#ffa900, #ffa900);
        background-blend-mode: normal, normal;
        box-shadow: 0rem 0.025rem 0.089rem 0.001rem rgba(248, 91, 80, 0.63);
        border-radius: 0.16rem;
        font-size: 0.13rem;
        font-weight: normal;
        line-height: 0.32rem;
        color: #ffffff;
      }
    }
  }
}
</style>
