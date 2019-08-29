<template>
  <div class="follow">
    <!-- 头部 -->
    <headers title="我的关注"></headers>
    <!-- 关注的作者 -->
    <div class="my-follow">
      <div
        class="follow-box clearfix"
        v-for="(item,index) in follow"
        :key="index"
        @click="goAuthorDetails(item)"
      >
        <img src="../../../../static/android/mall_food.png" alt>
        <div class="follow-font">
          <span>{{item.name}}</span>
          <span>粉丝数：99.99万</span>
        </div>
      </div>
    </div>
    <!-- 没有关注的显示 -->
    <div class="no-follow" v-show="follow==undefined">暂无更多数据</div>
  </div>
</template>
<script>
import headers from "@/components/common/Header.vue";
export default {
  components: { headers },
  data: () => ({
    token: "",
    follow: [] //关注列表
  }),
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

    // 获取关注
    this.getFollow();

    localStorage.setItem("pageName", 0);
  },
  methods: {
    // 获取关注
    getFollow() {
      this.$http.get("token/getFollow?token=" + this.$token).then(res => {
        this.follow = res.data.extend.list;
      });
    },
    // 跳转作者详情
    goAuthorDetails(item) {
      this.$router.push({
        path: "/authorDetails",
        query: { id: item.id, name: item.name }
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
.follow {
  max-width: 750px;
  min-width: 300px;
  margin: 0 auto;
  background-color: #fff;
  // position: absolute;
  // top: -46px;
  // margin-top: 46px;
  box-sizing: border-box;
  width: 100%;
  min-height: 100%;
  position: relative;
  > .my-follow {
    // 关注的作者
    > .follow-box {
      padding: 2% 3%;
      border-bottom: 0.5px solid #d1d1d1;
      > img {
        width: 0.55rem;
        height: 0.55rem;
        border-radius: 50%;
        overflow: hidden;
        display: block;
        float: left;
      }
      > .follow-font {
        padding-top: 0.05rem;
        margin-left: 0.2rem;
        float: left;
        > span {
          display: block;
        }
        > span:nth-child(2) {
          color: #929292;
          font-size: 0.14rem;
        }
      }
    }
  }
  // 没有关注的显示
  > .no-follow {
    // width: 100%;
    color: #67737f;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
