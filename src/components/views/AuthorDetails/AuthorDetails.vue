<template>
  <div class="authorDetails">
    <!-- 头部 -->
    <!-- <headers title="作者文章"></headers> -->
    <!-- 头像 -->
    <div class="head-portrait clearfix" ref="head">
      <img
        src="../../../../static/android/author-img.png?x-oss-process=image/resize,m_fill,w_528,h_230"
      />
      <div class="head-img">
        <img :src="$route.query.img" alt />
        <div class="head-font">
          <span>{{ $route.query.name }}</span>
        </div>
      </div>
      <div class="follow" @click="addFollow" v-if="isFollow == 0">
        <img src="../../../../static/personal/recommend-star.png" />
        <span>关注</span>
      </div>
      <div class="follow-click clearfix" @click="addFollow"  v-else="isFollow == 1">
        不再关注
      </div>
      <div class="radius-box"></div>
    </div>
    <!-- 作者文章 -->
    <dietcommon
      class="aDietcommon clearfix"
      :bottomColumn="false"
      ref="dietcommon"
      v-on:isloading="changeFlag"
    ></dietcommon>
  </div>
</template>
<script>
import headers from "@/components/common/Header.vue";
import dietcommon from "@/components/common/Dietcommon.vue";
import { Toast } from "vant";

export default {
  components: { headers, dietcommon },
  data: () => ({
    token: "",
    userInfo: [], //用户信息
    flag: true,
    isFollow: 0
  }),
  // 销毁完成状态
  destroyed() {
    window.removeEventListener("scroll", this.onScroll);
  },
  created() {
    this.token = this.$route.query.token;
    this.follows();
    setTimeout(() => {
      this.$refs.dietcommon.getAuthorDetails(this.$route.query.id);
    }, 100);
    localStorage.setItem("pageName", 4);
    localStorage.setItem("authorId", this.$route.query.id);

    // var h = document.documentElement.clientHeight || document.body.clientHeight;
    // setTimeout(() => {
    //   this.$refs.dietcommon.$el.style.height =
    //     h - this.$refs.head.offsetHeight - 46 + "px";
    // }, 100);
    window.addEventListener("scroll", this.onScroll);
  },
  methods: {
    changeFlag: function(flag) {
      this.flag = flag;
    },
    follows() {
      this.$http
        .get("token/isFollow", {
          params: {
            authorId: this.$route.query.id,
            state: 0,
            token: this.token
          }
        })
        .then(res => {
          var a = res.data.extend.follow;
          if (a == 1) {
            this.isFollow = 1;
          } else {
            this.isFollow = 0;
          }
        });
    },
    // 关注作者
    addFollow() {
      var _this = this;
      this.$http
        .get("token/addOrRelease", {
          params: { token: this.token, fellowId: this.$route.query.id }
        })
        .then(res => {
          if (res.data.extend.isFollow == 1) {
            this.isFollow = 1;
            Toast(res.data.msg);
          } else {
            this.isFollow = 0;
            Toast(res.data.msg);
          }
        });
    },
    onScroll() {
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      var windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      var scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      if (scrollTop + windowHeight >= scrollHeight - 100) {
        if (this.$route.query.id) {
          if (this.flag) {
            this.$refs.dietcommon.getAuthorDetails(this.$route.query.id);
          }
        }
      }
    }
  },
  mounted() {
    //
    if (this.$route.path == "/authorDetails") {
      var that = this;
      //监听窗口变化
      document.addEventListener("visibilitychange", function() {
        var hidden = document.visibilityState == "hidden";
        if (!hidden) {
          that.follows();
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
// 清除浮动
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
.container {
  top: 111px !important;
}
.aDietcommon {
  /*margin-top: 0.2rem;*/
  width: 100%;
}
.authorDetails {
  max-width: 750px;
  min-width: 300px;
  margin: 0 auto;
  background-color: #fff;
  position: absolute;
  width: 100%;
  position: absolute;
  top: 0;
  // 头像
  > .head-portrait {
    height: 1.2rem;
    position: relative;
    > img {
      width: 100%;
      height: 100%;
    }
    .radius-box {
      width: 100%;
      height: 0.3rem;
      overflow: hidden;
      border-radius: 0.4rem 0.4rem 0 0;
      background: #ffffff;
      position: absolute;
      bottom: 0;
      left: 0;
    }
    > .head-img {
      position: absolute;
      top: 0.155rem;
      left: 0.12rem;
      > img {
        width: 0.575rem;
        height: 0.575rem;
        border-radius: 50%;
        overflow: hidden;
        float: left;
      }
      .head-font {
        float: left;
        margin-left: 0.165rem;
        > span {
          text-align: center;
          color: #2290ff;
          line-height: 0.575rem;
          font-size: 0.15rem;
        }
      }
    }
    > .head-font {
      margin-top: 0.05rem;
      text-align: center;
    }
    .follow {
      margin: 0.1rem;
      position: absolute;
      top: 0.2rem;
      right: 0;
      height: 0.26rem;
      text-align: center;
      line-height: 0.28rem;
      background-color: #2290ff;
      color: #ffffff;
      -webkit-box-shadow: 0rem 0.01rem 0.03rem 0rem rgba(153, 153, 153, 0.22);
      box-shadow: 0rem 0.01rem 0.03rem 0rem rgba(153, 153, 153, 0.22);
      border-radius: 0.13rem;
      img {
        width: 0.13rem;
        height: 0.11rem;
        float: left;
        margin-top: 0.075rem;
        margin-left: 0.19rem;
      }
      span {
        font-size: 0.11rem;
        color: #ffffff;
        float: left;
        margin-left: 0.045rem;
        margin-right: 0.19rem;
      }
    }
    >.follow-click{
      margin: 0.1rem;
      position: absolute;
      top: 0.2rem;
      right: 0;
      width: 0.82rem;
      height: 0.26rem;
      text-align: center;
      line-height: 0.28rem;
      color: #2290ff;
      background-color: #ffffff;
      box-shadow: 0rem 0.01rem 0.03rem 0rem rgba(153, 153, 153, 0.22);
      border-radius: 0.13rem;
      font-size: 0.11rem;
    }
  }
  //   我的信息
  > .message {
    position: relative;
    margin-top: 0.2rem;
    > div {
      background-color: #ffffff;
      > div {
        box-sizing: border-box;
        border: 0.05rem solid #f5f5f5;
        border-right: none;
        border-left: none;
        border-top: none;
        background-color: #ffffff;
        height: 0.49rem;
        width: 100%;
        line-height: 0.49rem;
        > img {
          width: 0.2rem;
          height: 0.2rem;
          display: block;
          margin: 0.14rem 0 0 0.2rem;
          float: left;
          vertical-align: middle;
        }
        > span {
          display: block;
          float: left;
          font-size: 0.15rem;
          color: #333333;
          margin-left: 0.135rem;
        }
        > .van-icon {
          position: relative;
          right: 0.2rem;
          top: -0.02rem;
          font-size: 0.16rem;
          margin-top: 0.185rem;
          float: right;
          width: 0.07rem;
          height: 0.12rem;
          color: #666666;
        }
      }
      > div:nth-last-child(1) {
        // border-top: none;
        // border-bottom: 0.05rem solid #f5f5f5;
      }
    }
  }
  > .message-bottpm {
    margin-top: 0.2rem;
  }
}
</style>
