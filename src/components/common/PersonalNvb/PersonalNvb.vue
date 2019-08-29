<template>
  <!-- 精选-->
  <div class="featured-box clearfix" v-if="hot">
    <div class="right">
      <van-swipe
        :autoplay="3000"
        vertical
        :touchable="false"
        :show-indicators="false"
        class="featured-swipe"
      >
        <van-swipe-item v-for="(item, index) in hotArticleList" :key="index">{{item}}</van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<script>
import bridge from "@/js/bridge.js";

export default {
  name: "featured",
  data: () => ({
    token: "",
    hot: true,
    hotArticleList: [
      "万丈高楼平地起，成功还得靠自己",
      "如果所有人都理解你，那你得普通成什么样",
      "在错误的道路上后退就是前进",
      "朋友就是看清了你，还能喜欢你的人",
      "爱充满遗憾，可是拒绝去爱才是最大的遗憾",
      "过分的在意羽毛，就会失去整个翅膀"
    ]
  }),
  created() {
    this.token = this.$token;
    if (localStorage.getItem("Browser")) {
      this.$header = true;
    }
  },
  methods: {}
};
</script>

<style scoped lang="less">
/*精选*/
.featured-box {
  .right {
    height: 0.22rem;
    .featured-swipe {
      height: 0.22rem;
      .van-swipe-item {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        padding-right: 4%;
        font-family: SourceHanSansCN-Regular;
        font-size: 0.11rem;
        color: #666666;
      }
    }
  }
}
</style>
