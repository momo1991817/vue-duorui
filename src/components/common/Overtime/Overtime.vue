<template>
  <div class="overTime">
    <div>
      <img
        class="wifi-img"
        src="../../../../static/HM-search/wifi.png"
        alt=""
      />
      <div class="font-one">网络加载失败</div>
      <div class="font-two">再次刷新或检查网络</div>
      <div class="reload">
        <span @click="reload">刷&nbsp;&nbsp;新</span>
      </div>
    </div>
  </div>
</template>

<script>
import bridge from "@/js/bridge.js";

export default {
  props: ["images"],
  data: () => ({ token: "" }),
  created() {
    var token = this.$route.query.token;
    if (token) {
      localStorage.setItem("token", token);
    } else {
      token = localStorage.getItem("token", token);
      if (!token) {
        token = this.$token;
        localStorage.setItem("token", token);
      }
    }
    this.token = token;

    if (localStorage.getItem("Browser")) {
      this.$header = true;
    }
  },
  methods: {
    reload() {
      window.location.reload();
    }
  }
};
</script>

<style lang="less"  scoped>
// 清除浮动
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
.overTime {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  z-index: 999999999999;
  background: #ffffff;
  > div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    > .wifi-img {
      width: 1.085rem;
      height: 1.305rem;
    }
    > .font-one {
      font-size: 0.14rem;
      color: #888888;
      margin-top: 0.14rem;
    }
    > .font-two {
      font-size: 0.11rem;
      color: #b4b4b4;
      margin-top: 0.09rem;
    }
    > .reload {
      margin: 0.26rem auto 0 auto;
      width: 0.925rem;
      height: 0.285rem;
      border-radius: 0.143rem;
      border: solid 0.01rem #7abbfc;
      > span {
        font-size: 0.14rem;
        color: #87c1fc;
        line-height: 0.285rem;
      }
    }
    > .reload:hover {
      opacity: 0.5;
    }
  }
}
</style>
