<template>
  <!-- 精选-->
  <div class="featured-box clearfix" v-if="hot" @click="Jump">
    <div class="left">精选 • </div>
    <div class="right">
      <van-swipe :autoplay="3000" vertical :show-indicators="false" class="featured-swipe">
        <van-swipe-item v-for="(item, index) in hotArticleList" :key="index">{{item.title}}</van-swipe-item>
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
    hotArticleList: []
  }),
  created() {
    this.token = this.$token;
    if (localStorage.getItem("Browser")) {
      this.$header = true;
    };
    this.getHotArticle();
  },
  methods:{
    getHotArticle(){
      this.$http.get("article/getHotArticle/" + 1, {
        params: {
          pageSize: 2,
          token: this.token
        }
      }).then(res => {
        if (res.data.extend.articles == 0) {
          this.hot = false;
          return;
        }
         this.hotArticleList = res.data.extend.articles;
      });
    },
    Jump(){
      if (this.$header) {
        this.$router.push({
          path: "/hot-article",
          query:{
            token: this.token
          }
        });
      } else {
        var name = "duoruiapp_openInAppUrl";
        var data = {
          title: "多锐",
          url: this.$httpUrl + "hot-article?token=" + this.token
        };
        bridge.callhandler(name, data, function(response) {});
      }
    }
  }
}
</script>

<style scoped lang="less">
  /*精选*/
  .featured-box{
    padding: 0.04rem 4% 0.11rem 4%;
    border-bottom: 0.03rem solid #eeeeee;
    >.left{
      float: left;
      background-color: #ffca27;
      border-radius: 0rem 0.2rem 0.2rem 0;
      line-height:0.24rem;
      height:0.22rem;
      color:#ffffff;
      font-size: 0.13rem;
      padding: 0 0.06rem;
      margin-right: 0.125rem;
    }
    .right{
      height:0.22rem;
      .featured-swipe{
        height:0.22rem;
        .van-swipe-item{
          font-size:0.14rem;
          line-height:0.24rem;
          color:#000000;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          padding-right: 4%;
        }
      }
    }
  }
</style>
