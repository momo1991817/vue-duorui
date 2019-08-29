<template>
  <div class="Bodybuilding">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <dietcommon ref="dietcommon"></dietcommon>
    </van-pull-refresh>
  </div>
</template>
<script>
import dietcommon from "@/components/common/Dietcommon.vue";
export default {
  name: "ThousandChat",
  components: { dietcommon },
  data: () => ({
    isLoading: false,
    token: "",
    page: 1,
    flag: true
  }),
  watch: {
    $route(to, from) {
      window.removeEventListener("scroll", this.onScroll);
      if (to.path == "/thousandChat") {
        window.addEventListener("scroll", this.onScroll);
        if(localStorage.getItem('scrollTop6')){
          document.documentElement.scrollTop = localStorage.getItem('scrollTop6');
        }
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

    localStorage.setItem("componentsName", 3);

    setTimeout(() => {
      // 获取文章列表
      this.$refs.dietcommon.getList(7);
      // 获取轮播图
      this.$refs.dietcommon.getBanner(7);
    }, 100);
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
          this.$refs.dietcommon.getMoresList(7);
          this.flag = false;
        }
        setTimeout(() => {
          this.flag = true;
        }, 200);
      }
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.$refs.dietcommon.getList(7);
        this.isLoading = false;
      }, 1000);
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
.Bodybuilding {
  max-width: 750px;
  min-width: 300px;
  margin: 0 auto;
  background-color: #fff;
  position: absolute;
  width: 100%;
}
</style>
