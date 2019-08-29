<template>
  <div class="CheckInRule">
    <div class="box-font">
      <div>1、登录用户每天可签到1次，并领取奖励。</div>
      <div>2、连续签到天数越长，获得的奖励越多。若连续签到中断，则重新计算天数。</div>
      <div>3、连续签到7天，将额外获得奖励</div>
    </div>
  </div>
</template>

<script>
import bridge from "@/js/bridge.js";
export default {
  name: "CheckInRule",
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>

<style scoped lang="less">
.CheckInRule {
  position: absolute;
  top: 0;
  min-height: 100%;
  width: 3.75rem;
  background-color: #faebe8;
  box-sizing: border-box;

  > .box-font {
    width: 3rem;
    height: 1.995rem;
    background-color: #ffffff;
    border-radius: 0.05rem;
    margin: 0.24rem auto auto auto;
    overflow: hidden;
    padding: 0.2rem 0.2rem 0 0.2rem;
    box-sizing: border-box;

    font-size: 0.15rem;
    font-weight: normal;
    font-stretch: normal;
    color: #000000;
  }
}
</style>
