<template>
  <div class="centent-one clearfix">
    <!-- 头部 -->
    <img src="../../../static/android/back_button.png" @click="onClickLeft" class="go-back">
    <van-nav-bar
      :title="title"
      left-text
      :fixed="true"
    >
    </van-nav-bar>

    <!--    <van-nav-bar-->
    <!--      :title="title"-->
    <!--      left-text-->
    <!--      @click-left="onClickLeft"-->
    <!--      style="font-weight=700;"-->
    <!--      :border="false"-->
    <!--      :fixed="true"-->
    <!--    />-->
  </div>
</template>

<script>
export default {
  props: ["title"],
  data: () => ({}),
  created() {},
  methods: {
    // 返回上一页
    onClickLeft() {
      history.go(-1);
    }
  }
};
</script>

<style lang="less">
// 清除浮动
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
.centent-one {
  // 返回按钮
  > .go-back{
    position: fixed;
    left: 10px;
    top: 12px;
    width: 22px;
    height: 22px;
    z-index: 999;
  }
  > .go {
    font-size: 0.25rem;
    color: #409efc;
    position: fixed;
    top: 0.1rem;
    left: 0.1rem;
    z-index: 1;
  }
  // 头部
  > .van-nav-bar {
    background-color: #fff;
    .van-nav-bar__title {
      color: #409efc;
    }
    .van-nav-bar__left {
      .van-icon {
        color: #409efc;
        // font-weight: 700;
        position: relative;
        // left: -0.2rem;
        font-size: 0.2rem;
      }
    }
    > .van-nav-bar__title {
      font-weight: 700;
    }
  }
}
</style>
