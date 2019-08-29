<template>
  <div class="collection">
    <!-- 头部 -->
    <headers title="我的收藏"></headers>
    <!-- tab栏 -->
    <van-tabs v-model="active" @click="getTitle" ref="head">
      <van-tab title="文章"></van-tab>
      <van-tab title="视频"></van-tab>
    </van-tabs>
    <dietcommon class="dietcommons" ref="dietcommon"></dietcommon>
  </div>
</template>
<script>
import headers from "@/components/common/Header.vue";
import dietcommon from "@/components/common/Dietcommon.vue";

export default {
  components: { headers, dietcommon },
  data: () => ({
    active: 0,
    token: "",
    follow: [], //关注列表
    none: true,
    flag: true
  }),
  // 销毁完成状态
  destroyed() {
    window.removeEventListener("scroll", this.onScroll);
  },
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

    // 设置scroll高度
    var h = document.documentElement.clientHeight || document.body.clientHeight;
    setTimeout(() => {
      this.$refs.dietcommon.$el.style.height = h - 50 - 50 + "px";
    }, 100);

    // 获取我的收藏文章
    setTimeout(() => {
      if (JSON.parse(localStorage.getItem("CollectionArticle")) == false) {
        this.none = false;
      } else {
        this.none = true;
      }
    }, 10);

    setTimeout(() => {
      this.$refs.dietcommon.getCollectionWen();
    }, 100);
    localStorage.setItem("myActive", this.active);
    window.addEventListener("scroll", this.onScroll);
  },
  methods: {
    onScroll() {
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      var windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      var scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      if (scrollTop + windowHeight >= scrollHeight - 100) {
        if (this.flag) {
          this.$refs.dietcommon.getCollectionWen();
          this.flag = false;
        }
        setTimeout(() => {
          this.flag = true;
        }, 200);
      }
    },
    getTitle(index, title) {
      if (index == 0) {
        this.$refs.dietcommon.getCollectionWen();
      } else if (index == 1) {
        this.$refs.dietcommon.getCollectionWen();
      }
      this.active = index;
      localStorage.setItem("myActive", this.active);
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
.dietcommons {
  position: absolute;
  width: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #ffffff;
  min-height: 100%;
}
.collection {
  max-width: 750px;
  min-width: 300px;
  margin: 0 auto;
  background-color: #fff;
  position: absolute;
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;

  // tab栏
  > .van-tabs {
    > .van-tabs__wrap {
      width: 3.75rem;
      position: fixed;
      left: 50%;
      top: 42px;
      transform: translate(-50%, 0%);
      > .van-tabs__nav {
        > .van-tabs__line {
          height: 0.04rem;
          background: linear-gradient(90deg, #409efc 0%, #409efc 100%);
          margin: 0 auto !important;
          transition-duration: 0.3s;
          border-radius: 0.3rem;
        }
        > .van-tab {
          color: #67737f;
          font-size: 0.12rem;
        }
        .van-tab--active {
          font-size: 0.14rem;
          font-weight: 550;
          color: #409efc;
          background: linear-gradient(90deg, #409efc 0%, #409efc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }
  }
}
</style>