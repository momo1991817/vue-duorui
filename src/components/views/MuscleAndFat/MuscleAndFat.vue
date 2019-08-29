<template>
  <div class="muscle">
    <!--      保存滚动条位置-->
    <input v-model="scrollTop" style="display: none" />
    <img src alt class="refreshImg" />
    <div
      class="muscles"
      @touchstart="$touchstart($event,'muscles')"
      @touchmove="$touchmove($event,'muscles')"
      @touchend="$touchend($event,'muscles')"
    >
      <Subcommon
        ref="musclecommon"
        :bottomColumn="true"
        v-on:isloading="changeFlag"
      ></Subcommon>
    </div>
    <!-- 刷新按钮 -->
    <div class="refresh-bottom" v-if="refreshBottomFlag" @click.stop="pageOne">
      <img src="../../../../static/recommend/refresh.png" alt />
    </div>
  </div>
</template>
<script>
  import Subcommon from "../../common/Subcommon";
  export default {
    name: "MuscleAndFat",
    components: {Subcommon },
    data: () => ({
      isLoading: false,
      token: "",
      page: 1,
      flag: false,
      scrollTop: 0,
      refreshImg: "",
      startPos: 0,
      startXPos: 0,
      transitionHeight: 0,
      transitionWidth: 0,
      startTop: false,
      refreshBottomFlag: false // 刷新按钮显示
    }),
    watch: {
      $route(to, from) {
        window.removeEventListener("scroll", this.onScroll);
        if (to.path == "/muscleShaping") {
          window.addEventListener("scroll", this.onScroll);
          document.documentElement.scrollTop = this.scrollTop;
          document.body.scrollTop = this.scrollTop;
        }
      }
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

      setTimeout(() => {
        // 获取文章列表
        this.$refs.musclecommon.getList(11);
      }, 100);
      window.addEventListener("scroll", this.onScroll);
    },
    methods: {
      changeFlag: function(flag) {
        this.flag = flag;
      },
      onScroll() {
        var scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        var windowHeight =
          document.documentElement.clientHeight || document.body.clientHeight;
        var scrollHeight =
          document.querySelector(".muscle").scrollHeight +
          document.querySelector("#app").scrollHeight;
        this.scrollTop = scrollTop;
        if (scrollTop + windowHeight >= scrollHeight - 100) {
          if (this.flag) {
            this.$refs.musclecommon.getMoresList(11);
          }
        }
        // 显示刷新按钮
        if (scrollTop > windowHeight) {
          this.refreshBottomFlag = true;
        } else {
          this.refreshBottomFlag = false;
        }
      },
      // 获取初始化数据
      getList() {
        this.$refs.musclecommon.getList(11);
      },
      // 下拉刷新
      pageOne() {
        this.$pageOne("muscles");
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
  .refreshImg {
    position: absolute;
    width: 0.5rem;
    left: 50%;
    margin-top: 0.3rem;
    transform: translate(-50%, -50%);
  }
  .muscle {
    max-width: 750px;
    margin: 0 auto;
    background-color: #fff;
    position: absolute;
    width: 100%;
    top:0;
  }
  // 刷新按钮
  .refresh-bottom {
    position: fixed;
    bottom: 1.27rem;
    right: 0.145rem;
    width: 0.4rem;
    height: 0.4rem;
    background-color: #e3f1ff;
    border-radius: 50%;
    overflow: hidden;
    > img {
      width: 100%;
      height: 100%;
    }
  }
</style>
