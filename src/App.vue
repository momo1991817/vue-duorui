<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" ref="rout"></router-view>
    </keep-alive>
    <div class="content-box clearfix" v-if="$route.meta.showFooter">
      <!-- 个人信息 -->
      <div class="personal-box">
        <img
          class="personal-img"
          @click="personal"
          :src="userInfo.headImgUrl?userInfo.headImgUrl:'../static/recommend/userHeadImg.jpg'"
          alt
        />
        <div class="personal-name">{{userInfo.nickname?userInfo.nickname:'nickname'}}</div>
        <personal-nvb class="personal-nvb"></personal-nvb>
        <!-- 领金币 -->
        <div class="gold-coin" @click="goldcoin">
          <img src="../static/recommend/gold-coin.png" alt />
        </div>

        <Receivingpage v-if="ReceivingpageFlag" list="imper" @Receivingpage="getReceivingpage"></Receivingpage>

        <img
          class="weather-img"
          id="wea_img"
          v-if="tianList.wea_img== 'xue'"
          src="../static/recommend/xue.png"
          alt
        />
        <img
          class="weather-img"
          id="wea_img"
          v-else-if="tianList.wea_img== 'lei'"
          src="../static/recommend/lei.png"
          alt
        />
        <img
          class="weather-img"
          id="wea_img"
          v-else-if="tianList.wea_img== 'shachen'"
          src="../static/recommend/shachen.png"
          alt
        />
        <img
          class="weather-img"
          id="wea_img"
          v-else-if="tianList.wea_img== 'wu'"
          src="../static/recommend/wu.png"
          alt
        />
        <img
          class="weather-img"
          id="wea_img"
          v-else-if="tianList.wea_img== 'bingbao'"
          src="../static/recommend/bingbao.png"
          alt
        />
        <img
          class="weather-img"
          id="wea_img"
          v-else-if="tianList.wea_img== 'yun'"
          src="../static/recommend/yun.png"
          alt
        />
        <img
          class="weather-img"
          id="wea_img"
          v-else-if="tianList.wea_img== 'yu'"
          src="../static/recommend/yu.png"
          alt
        />
        <img
          class="weather-img"
          id="wea_img"
          v-else-if="tianList.wea_img== 'yin'"
          src="../static/recommend/yin.png"
          alt
        />
        <img
          class="weather-img"
          id="wea_img"
          v-else-if="tianList.wea_img== 'qing'"
          src="../static/recommend/qing.png"
          alt
        />
      </div>
      <!-- 导航栏 -->
      <div class="bottom-box">
        <div class="tab-box">
          <van-tabs v-model="active" @click="goto">
            <van-tab v-for="(item, index) in columns" :key="index" :title="item.columnName"></van-tab>
          </van-tabs>
          <div class="liner-box">
            <img src="../static/android/linear.png" />
          </div>
        </div>
        <div class="box-right">
          <img
            style="height:0.17rem;position: relative;top: -0.02rem;"
            src="../static/recommend/search.png"
            alt
            @click.stop="search"
          />
          <img src="../static/recommend/column.png" alt @click.stop="columnSort" />
        </div>
        <!-- <div class="box-left">
          <img  src alt @click="personal" />
        </div>-->
      </div>
    </div>
    <router-view v-if="!$route.meta.keepAlive" ref="rout"></router-view>

    <!--      新手指引-->
    <div class="guide-box" v-if="isFindFirst==1">
      <div class="author">
        <img
          class="author-img"
          :src="userInfo.headImgUrl?userInfo.headImgUrl:'../static/recommend/userHeadImg.jpg'"
        />
        <img class="author-guide" src="../static/android/author-guide.png" />
        <div class="author-btn" @click="nextGuide">我知道了</div>
      </div>
      <div class="search-box">
        <div class="search-img">
          <img src="../static/recommend/search.png" />
        </div>
        <img class="search-guide clearfix" src="../static/android/search-guide.png" />
        <div class="search-btn" @click="endGuide">我知道了</div>
      </div>
    </div>
    <!--    超时刷新-->
    <Overtime v-if="timeoutFlag"></Overtime>
  </div>
</template>

<script>
import bridges from "@/js/bridge.js";
import Overtime from "./components/common/Overtime/Overtime";
import PersonalNvb from "./components/common/PersonalNvb/PersonalNvb";
import Receivingpage from "./components/common/Receivingpage/Receivingpage";

import { Toast } from "vant";

export default {
  name: "App",
  components: { Overtime, PersonalNvb, Receivingpage },
  data() {
    return {
      active: 0,
      columns: [], //栏目
      cateid: [], //栏目ID
      flag: false,
      timeoutFlag: false,
      token: "",
      tabFlag: false,
      userInfo: [], // 获取用户信息
      isFindFirst: 0,
      tianList: [], // 天气
      wea_img: "", // 天气图片
      isRefresh: true,
      path: [], // tab栏跳转地址
      ReceivingpageFlag: false // 领取页面显示
    };
  },
  created() {
    var that = this;
    this.token = this.$token;
    localStorage.setItem("start", true);
    if (localStorage.getItem("active")) {
      this.active = localStorage.getItem("active");
    }
    // 栏目信息
    this.getColumns();

    if (this.$route.query.browser) {
      this.$header = true;
    }
    if (localStorage.getItem("Browser")) {
      this.$header = true;
    }
    var that = this;
    var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    window.onload = function() {
      if (isiOS) {
        function setupWebViewJavascriptBridge(callback) {
          if (window.WebViewJavascriptBridge) {
            return callback(WebViewJavascriptBridge);
          }
          if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback);
          }
          window.WVJBCallbacks = [callback];
          var WVJBIframe = document.createElement("iframe");
          WVJBIframe.style.display = "none";
          WVJBIframe.src = "https://__bridge_loaded__";
          document.documentElement.appendChild(WVJBIframe);
          setTimeout(function() {
            document.documentElement.removeChild(WVJBIframe);
          }, 0);
        }

        setupWebViewJavascriptBridge(function(bridge) {
          bridge.callHandler("duoruiapp_userInfo", { foo: "bar" }, function(
            response
          ) {
            that.userInfo = response;
          });
        });
      } else {
        function connectWebViewJavascriptBridge(callback) {
          if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge);
          } else {
            document.addEventListener(
              "WebViewJavascriptBridgeReady",
              function() {
                callback(WebViewJavascriptBridge);
              },
              false
            );
          }
        }

        connectWebViewJavascriptBridge(function(bridge) {
          window.WebViewJavascriptBridge.callHandler(
            "duoruiapp_userInfo",
            {},
            function(response) {
              that.userInfo = JSON.parse(response);
            }
          );
          bridge.init(function(message, responseCallback) {
            console.log("JS got a message", message);
            var data = {
              "Javascript Responds": "测试中文!"
            };
            if (responseCallback) {
              console.log("JS responding with", data);
              responseCallback(data);
            }
          });
          bridge.registerHandler("functionInJs", function(
            data,
            responseCallback
          ) {
            if (responseCallback) {
              var responseData = "Javascript Says Right back aka!";
              responseCallback(responseData);
            }
          });
        });
      }

      // 天气
      that.$http
        .get(
          "https://www.tianqiapi.com/api/?version=v6&appid=44832887&appsecret=LoQey2ZV"
        )
        .then(res => {
          that.tianList = res.data;
          console.log(that.tianList);
        })
        .catch(() => {});
    };
  },
  methods: {
    //获取栏目
    getColumns() {
      this.path = [];
      this.$http
        .get("/columns/getColumnsByUser", {
          params: {
            token: this.token
          }
        })
        .then(res => {
          var that = this;
          this.columns = res.data.extend.list;
          this.columns.forEach(function(item, index) {
            item.active = index;
            if (item.columnName == "推荐") {
              item.path = "/";
            } else if (item.columnName == "健身") {
              item.path = "/emotion";
            } else if (item.columnName == "情感") {
              item.path = "/diet";
            } else if (item.columnName == "生活") {
              item.path = "/yoga";
            } else if (item.columnName == "育儿") {
              item.path = "/bodybuilding";
            } else if (item.columnName == "健康") {
              item.path = "/healthy";
            }
            that.cateid.push(item.id);
            that.path.push(item.path);
          });
          localStorage.setItem("columns", JSON.stringify(this.path));
          this.path.forEach(function(item, index) {
            if (item == that.$route.path) {
              that.active = index;
              localStorage.setItem("active", index);
            }
          });
          // this.columns.splice(1, 0, { columnName: "女人" });
          // this.columns.splice(2, 0, { columnName: "生活" });
        })
        .catch(err => {
          // this.timeoutFlag = true;
          console.log(err);
        });
    },
    // 个人信息页面
    personal() {
      if (this.$header) {
        this.$router.push({
          path: "/personal",
          query: { token: this.token }
        });
      } else {
        var name = "duoruiapp_openInAppUrl";
        var data = {
          title: "个人信息",
          url: this.$httpUrl + "personal?token=" + this.token
        };
        bridges.callhandler(name, data, function(response) {});
      }
    },
    // 搜索页面
    search() {
      this.$router.push({
        path: "/search",
        query: { token: this.token }
      });
    },
    // 栏目排序页面
    columnSort() {
      if (this.$header) {
        this.$router.push({
          path: "/columns-sort",
          query: {
            token: this.token,
            active: this.active
          }
        });
      } else {
        var name = "duoruiapp_openInAppUrl";
        var data = {
          title: "所有栏目",
          url:
            this.$httpUrl +
            "columns-sort?token=" +
            this.token +
            "&active=" +
            this.active
        };
        bridges.callhandler(name, data, function(response) {});
      }
    },
    // 领取金币
    goldcoin() {
      this.ReceivingpageFlag = true;
    },
    getReceivingpage(flag) {
      this.ReceivingpageFlag = flag;
    },
    goto(index, title) {
      this.active = index;
      if (this.$route.name !== title) {
        this.flag = false;
        this.tabFlag = false;
      } else {
        this.flag = true;
      }
      if (this.tabFlag) {
        return;
      }
      if (document.querySelector(".recommends")) {
        document.querySelector(".recommends").style.transform =
          "translateY(0px)";
      } else if (document.querySelector(".emotions")) {
        document.querySelector(".emotions").style.transform = "translateY(0px)";
      } else if (document.querySelector(".diets")) {
        document.querySelector(".diets").style.transform = "translateY(0px)";
      } else if (document.querySelector(".yogas")) {
        document.querySelector(".yogas").style.transform = "translateY(0px)";
      } else if (document.querySelector(".bodybuildings")) {
        document.querySelector(".bodybuildings").style.transform =
          "translateY(0px)";
      } else if (document.querySelector(".healthys")) {
        document.querySelector(".healthys").style.transform = "translateY(0px)";
      }
      if (title == "推荐") {
        this.$router.push({
          path: "/",
          query: {
            token: this.token
          }
        });
        if (this.flag) {
          this.$refs.rout.pageOne("recommends");
        }
      } else if (title == "健身") {
        this.$router.push({
          path: "/emotion",
          query: {
            token: this.token
          }
        });
        if (this.flag) {
          this.$refs.rout.pageOne("emotions");
        }
      } else if (title == "情感") {
        this.$router.push({
          path: "/diet",
          query: {
            token: this.token
          }
        });
        if (this.flag) {
          this.$refs.rout.pageOne("diets");
        }
      } else if (title == "生活") {
        this.$router.push({
          path: "/yoga",
          query: {
            token: this.token
          }
        });
        if (this.flag) {
          this.$refs.rout.pageOne("yogas");
        }
      } else if (title == "育儿") {
        this.$router.push({
          path: "/bodybuilding",
          query: {
            token: this.token
          }
        });
        if (this.flag) {
          this.$refs.rout.pageOne("bodybuildings");
        }
      } else if (title == "健康") {
        this.$router.push({
          path: "/healthy",
          query: {
            token: this.token
          }
        });
        if (this.flag) {
          this.$refs.rout.pageOne("healthys");
        }
      } else if (title == "商城") {
        this.$router.push({
          path: "/shopping",
          query: {
            token: this.token
          }
        });
      }
      // 统计点击量
      this.$http.get("statistics/clicksStatistics", {
        params: { type: 1, id: this.cateid[index] }
      });
      if (this.tabFlag) {
        return;
      }
      if (this.flag) {
        this.tabFlag = true;
        setTimeout(() => {
          this.tabFlag = false;
        }, 2010);
      }
    },
    nextGuide() {
      document.querySelector(".author").style.display = "none";
      document.querySelector(".search-box").style.display = "block";
    },
    endGuide() {
      document.querySelector(".guide-box").style.display = "none";
    }
  },
  watch: {
    $route(to, from) {
      if (to.path == "/") {
        if (localStorage.getItem("isFindFirst") == null) {
          localStorage.setItem("isFindFirst", 1);
        } else {
          localStorage.setItem("isFindFirst", 0);
        }
        this.isFindFirst = localStorage.getItem("isFindFirst");
        this.active = 0;
      }
      var that = this;
      // tabbar默认选中
      this.columns.forEach(function(item) {
        if (to.path == item.path) {
          that.flag = false;
          that.active = item.active;
          localStorage.setItem("active", that.active);
        }
      });
    }
  },
  mounted() {
    var that = this;
    //监听窗口变化
    document.addEventListener("visibilitychange", function() {
      var hidden = document.visibilityState == "hidden";
      if (!hidden) {
        that.getColumns();
      }
    });
    this.$http.interceptors.response.use(response => {
      const res = response;
      if (res.status == 200) {
        if (res.data.code == 100) {
          setTimeout(() => {
            var name = "duoruiapp_refreshToken";
            var data = {
              client_id: "drb2cd5d6a03da03c5"
            };
            bridges.callhandler(name, data, function(response) {});
          }, 3000);
        }
        return res;
      }
    });
  },
  beforeDestroy() {
    localStorage.setItem("isFindFirst", 0);
    this.isRefresh = true;
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

img {
  object-fit: cover;
}

img[src=""],
img:not([src]) {
  opacity: 0;
}

#app {
  padding-top: 0.905rem;
  box-sizing: border-box;
  max-width: 750px;
  margin: 0 auto;

  > .content-box {
    z-index: 999;
    width: 100%;
    margin: 0 auto;
    position: fixed;
    height: 0.905rem;
    top: 0;
    background-color: #fff;

    > .personal-box {
      width: 3.75rem;
      height: 0.47rem;
      padding: 0 4%;
      box-sizing: border-box;

      > .personal-img {
        margin-top: 0.05rem;
        width: 0.42rem;
        height: 0.42rem;
        border-radius: 50%;
        float: left;
      }

      > .personal-name {
        float: left;
        font-size: 0.12rem;
        color: #333333;
        margin: 0.07rem 0 0 0.1rem;
        min-width: 2.3rem;
      }
      // 个性签名
      > .personal-nvb {
        float: left;
        width: 2.3rem;
        margin: 0.05rem 0 0 0.1rem;
      }
      // 领金币
      > .gold-coin {
        width: 0.59rem;
        height: 0.265rem;
        position: absolute;
        right: 0.4rem;
        top: 0.15rem;
        > img {
          width: 100%;
          height: 100%;
        }
      }

      // 领取页面
      > .Receivingpage {
        z-index: 99999999;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5) no-repeat;
      }

      > .weather-img {
        width: 0.2rem;
        height: 0.18rem;
        float: right;
        position: relative;
        top: -0.05rem;
        object-fit: contain;
      }

      > img[src=""],
      img:not([src]) {
        opacity: 0;
      }
    }

    > .bottom-box {
      display: flex;
      width: 3.75rem;

      .tab-box {
        flex: 8;
        position: relative;
        // top: 0.45rem;
        height: 0.44rem;

        .liner-box {
          position: absolute;
          right: 0;
          top: 0.13rem;
          width: 8px;
          height: 0.24rem;
          border-right: 1px solid #dddddd;
          background: transparent;
          z-index: 99;

          > img {
            height: 0.24rem;
            float: right;
          }
        }

        > .van-tabs {
          /*flex: 8;*/
          /*float: left;*/

          [class*="van-hairline"]::after {
            border-color: #fff;
          }

          > .van-tabs__wrap {
            margin: 0 auto;
            height: 0.44rem;

            > .van-tabs__nav {
              > .van-tabs__line {
                height: 0.02rem;
                transition-duration: 0.8s !important;
                margin: 0 auto !important;
                background-color: transparent;
                border-radius: 0.008rem;
              }

              > .van-tab {
                font-size: 0.16rem;
                color: #333333;
                line-height: 0.5rem;
              }

              .van-tab--active {
                width: 0.395rem;
                height: 0.19rem;
                font-size: 0.2rem;
                color: #2290ff;
                font-weight: 550;
                line-height: 0.49rem;
              }
            }
          }
        }
      }

      > .box-right,
      .box-left {
        float: right;
        margin: 0.16rem 0 0 0;
        z-index: 99;
        background-color: #fff;
      }

      > .box-right {
        flex: 2.1;

        > img {
          display: block;
          height: 0.14rem;
          float: left;
        }

        > img:nth-child(1) {
          margin: 0.02rem 0.05rem 0.02rem 0.15rem;
        }

        > img:nth-child(2) {
          margin: 0.02rem 0 0.02rem 0.1rem;
        }
      }

      > .box-left {
        flex: 1;

        > img {
          width: 0.18rem;
          height: 0.18rem;
        }
      }

      > .box-right::after {
        /*content: "";*/
        /*width: 0.12rem;*/
        /*height: 0.235rem;*/
        /*background-color: #fff;*/
        /*opacity: 0.8;*/
        /*display: block;*/
        /*position: absolute;*/
        /*top: -1px;*/
        /*left: -29px;*/
        /*z-index: 9999;*/
        /*border-radius: 0.2rem;*/
        /*background-image: linear-gradient(90deg, #ffffff 0%, #ffffff 100%),*/
        /*  linear-gradient(#ffffff, #ffffff);*/
      }
    }
  }

  /*  新手指引*/

  .guide-box {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10001;

    .author {
      position: fixed;
      top: 0.05rem;
      left: 0.1rem;
      z-index: 10002;

      > .author-img {
        width: 0.42rem;
        height: 0.42rem;
        border-radius: 50%;
        border: 4px solid #ffffff;
        overflow: hidden;
        display: block;
      }

      > .author-guide {
        width: 2.6rem;
        margin-left: 0.425rem;
      }

      > .author-btn {
        width: 0.97rem;
        height: 0.245rem;
        background-color: #ffd74e;
        border-radius: 0.123rem;
        font-size: 0.13rem;
        color: #9f6411;
        text-align: center;
        line-height: 0.265rem;
        position: absolute;
        right: 0.165rem;
        bottom: 0.265rem;
      }
    }
  }

  .search-box {
    position: fixed;
    top: 0.63rem;
    right: 0.4rem;
    display: none;

    .search-img {
      width: 0.3rem;
      height: 0.3rem;
      border-radius: 50%;
      overflow: hidden;
      float: right;
      display: block;
      background: #ffffff;
      text-align: center;

      > img {
        height: 0.15rem;
        margin: 0.075rem auto;
      }
    }

    .search-guide {
      clear: right;
      float: right;
      width: 2.79rem;
      margin-right: 0.15rem;
    }

    .search-btn {
      width: 0.97rem;
      height: 0.245rem;
      background-color: #ffd74e;
      border-radius: 0.123rem;
      font-size: 0.13rem;
      color: #9f6411;
      text-align: center;
      line-height: 0.265rem;
      position: absolute;
      left: 0.1rem;
      bottom: 0.265rem;
    }
  }
}
</style>
