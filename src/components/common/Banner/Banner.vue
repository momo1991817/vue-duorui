<template>
  <div class="banner">
    <!-- 轮播图 -->
    <van-swipe :autoplay="5000" class="swipe-img" @change="onChange">
      <van-swipe-item v-for="(image, index) in images" :key="index" @click="Jump(image)">
        <img :src="image.image+'?x-oss-process=image/resize,m_fill,w_690,h_260'" class="swipe-img ims" v-lazy="image.image"/>
      </van-swipe-item>
      <div class="custom-indicator clearfix" slot="indicator">
        <div
          :class="current !== index2?'indicator-item':['indicator-item','indicator-active']"
          v-for="(item, index2) in images"
          :key="index2"
          v-if="images.length>1"
        >
          <div class="indicator-item-show"></div>
        </div>
      </div>
    </van-swipe>
  </div>
</template>

<script>
import bridge from "@/js/bridge.js";

export default {
  props: ["images"],
  data: () => ({
    token: "" ,
    current: ""
  }),
  created() {
    this.token = this.$route.query.token
    if (localStorage.getItem("Browser")) {
      this.$header = true;
    }
    setTimeout(()=>{
      this.onChange(0)
    },100)
  },
  methods: {
    onChange(index) {
      this.current = index;
    },
    Jump(item) {
      // 广告点击统计
      this.$http
        .get("statistics/clicksStatistics", {
          params: { type: 4, id: item.id, token: this.token }
        })
        .then(res => {});
      if (item.url == "###") {
        return;
      } else {
        if (this.$header) {
          var url = {
            url: item.url + '&token=' + this.token
          };
          localStorage.setItem("goUrl", JSON.stringify(url));
          this.$router.push({
            path: "/iframe",
            query:{
              token: this.token
            }
          });
        } else {
          var name = "duoruiapp_openInAppUrl";
          var data = {
            title: "多锐",
            url: item.url + "&token=" + this.token
          };
          bridge.callhandler(name, data, function(response) {});
        }
      }
    }
  },
  watch: {
    $route(to, from) {
      this.current = "";
      setTimeout(()=>{
        this.onChange(0)
      },100)
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
.banner {
  min-height: 100%;
  margin-top: 0.1rem;
  position: relative;
  padding: 0 4%;
  // 轮播图
  .swipe-img {
    height: 1.35rem;
    width: 100%;
    box-sizing: border-box;
    margin: 0 auto;
    margin-bottom: 0.1rem;
    border-radius: 0.05rem;
    .van-swipe-item {
      .swipe-img {
        margin: 0 auto;
        display: block;
        height: 100%;
      }
    }
  }
  .custom-indicator{
    padding: 0.08rem 0.1rem;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index:3;
    .indicator-item{
      width: 0.35rem;
      height: 2px;
      background-color: rgba(255,255,255,0.5);
      float: left;
      margin: 1px;
      .indicator-item-show{
        width: 0;
        height: 2px;
        background-color: #ffffff;
      }
    }
    .indicator-active{
      .indicator-item-show{
        width: 0.35rem;
        transition: width 5s ease;
      }
    }
  }
}
</style>
