<template>
  <div class="articleInfo-f">
    <!-- <headers title="多锐"></headers> -->
    <!-- 作者信息 -->
    <div class="follow-message clearfix">
      <div class="authorTitle">{{ article.title }}</div>
      <van-sticky>
        <div class="follow-box clearfix">
          <div>
            <img v-if="article.headImgUrl == null" src="../../../../static/personal/header.png" alt />
            <img v-else :src="article.headImgUrl" alt />
            <div class="author">
              <span class="authorName">{{ article.authorName }}</span>
              <span class="authorFans">{{ article.createTime }}</span>
            </div>
          </div>
          <!-- <div class="follow-click" @click="follow">
            <span v-if="isFollow == 0">+ 关注作者</span>
            <span v-else-if="isFollow == 1">已关注</span>
          </div>-->
        </div>
      </van-sticky>
    </div>
    <!-- 文章内容 -->
    <div class="article-html" v-html="article.content"></div>
    <!-- 图片广告 -->
    <div class="authorArticle" @click="Jump(item)">
      <div style="width:100%" id="s"></div>
    </div>
    <!-- 更多推荐 -->
    <div class="article-recommend">
      <div class="authorBox clearfix" v-for="(item, index) in reoList" :key="index" @click="articles(item)">
        <div class="authorFont">{{ item.title }}</div>
        <img
          :src="
            item.images !== null?item.images[0]:'' + '?x-oss-process=image/resize,m_fill,w_100,h_60'
          "
          alt
        />
        <h2 class="clearfix">{{item.authorName}}</h2>
      </div>
    </div>
    <!-- 底部 -->
    <!-- <van-tabbar>
      <van-tabbar-item>
        <img
          @click="star"
          style="width:0.25rem;height:0.25rem;"
          :src="isStar==0?'../../../../static/android/shouc.png':'../../../../static/android/shouc2.png'"
          alt
        >
      </van-tabbar-item>
      <van-tabbar-item>
        <img
          @click="like"
          style="width:0.25rem;height:0.25rem;"
          :src="isClick==0?'../../../../static/android/dianz1.png':'../../../../static/android/dianz2.png'"
          alt
        >
      </van-tabbar-item>
      <van-tabbar-item>
        <img
          @click="share"
          style="width:0.25rem;height:0.25rem;"
          src="../../../../static/android/zfa.png"
          alt
        >
      </van-tabbar-item>
    </van-tabbar>-->
    <Overtime v-if="isRefresh"></Overtime>
  </div>
</template>

<script>
import headers from "@/components/common/Header.vue";
import bridge from "../../../js/bridge.js";
import { Toast } from "vant";
import Overtime from "../../common/Overtime/Overtime";
export default {
  components: {
    Overtime,
    headers
  },
  data: () => ({
    token: "",
    article: [], // 文章类容
    isFollow: "", // 关注作者
    isStar: "", // 收藏
    isClick: 0, // 喜欢
    reoList: [], // 文章详情推荐
    id: "", // 文章id
    flag: true, // 节流阀
    isRefresh: false, //是否刷新
    top: 0 // 作者信息距离顶部的距离
  }),
  watch: {
    // 监听文章ID发生改变重新调用获取文章接口
    id: function(val) {
      // 获取文章
      this.getArticle();
      // 获取初始化数据
      this.getInitialization();
      // window.scrollTo(0, 0);
    }
    // //监听参数发生改变时重加载
    // $route(to, from) {
    //   // 获取文章
    //   this.getArticle();
    //   // 获取初始化数据
    //   this.getInitialization();
    //   // window.scrollTo(0, 0);
    // }
  },
  created() {
    this.token = this.$route.query.token;
    if (!this.token) {
      this.token = this.$token;
    }
    // 获取文章
    this.getArticle();
    // 获取初始化数据
    this.getInitialization();

    setTimeout(() => {
      this.top = document.querySelector(".follow-box").offsetTop;
      (window.slotbydup = window.slotbydup || []).push({
        id: "u4081654",
        container: s
      });
    }, 500);
    setTimeout(() => {
      window.addEventListener("scroll", this.onScroll);
      // 调用多锐打开外部路径接口
      var that = this;
      var linkArr = [].slice.call(
        document.querySelector(".article-html").getElementsByTagName("a")
      );
      if (linkArr) {
        linkArr.forEach(function(item) {
          var url = item.href;
          if (url.search("http://weixin://") != -1) {
            url = url.split("http://weixin://").join("weixin://");
          } else if (url.search("https://weixin://") != -1) {
            url = url.split("https://weixin://").join("weixin://");
          } else if (url.search("http://weixin//") != -1) {
            url = url.split("http://weixin//").join("weixin://");
          } else if (url.search("https://weixin//") != -1) {
            url = url.split("https://weixin//").join("weixin://");
          }
          item.href = "javascript:void(0)";
          item.addEventListener("click", function() {
            if (url.search("weixin://") != -1) {
              that.copyArticle(item);
            }
            if (this.$header) {
              window.open(url);
            } else {
              var name = "duoruiapp_openOutAppUrl";
              var data = {
                url: url
              };
              bridge.callhandler(name, data, function(response) {});
            }
          });
        });
      }
    }, 1000);
  },
  methods: {
    // 复制文字方法
    copyArticle(element) {
      const range = document.createRange();
      range.selectNode(element);

      const selection = window.getSelection();
      if (selection.rangeCount > 0) selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('Copy');
      if(document.execCommand('Copy')) {
        Toast('内容已复制到粘贴板');
      }
    },
    onScroll() {
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      var windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      var scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      if (scrollTop + windowHeight >= scrollHeight) {
        if (this.flag) {
          // 触底统计
          this.$http
            .get("statistics/articleStatistics", {
              params: { id: this.$route.query.id }
            })
            .then(res => {
              console.log("到达底部");
            });
          this.flag = false;
        }
      }
      // if (scrollTop > this.top) {
      //   document
      //     .querySelector(".follow-box")
      //     .setAttribute("class", "follow-box follow-box-top clearfix");
      //   document.querySelector(".follow-box div").style = this.isFollow
      //     ? "background-color: #fff;color: #2290ff;margin-left:5%"
      //     : "background-color: #2290ff;color: #fff;margin-left:5%";
      // } else {
      //   document
      //     .querySelector(".follow-box")
      //     .setAttribute("class", "follow-box clearfix");
      //   document.querySelector(".follow-box div").style = this.isFollow
      //     ? "background-color: #fff;color: #2290ff;"
      //     : "background-color: #2290ff;color: #fff;";
      // }
    },
    // 获取初始化数据
    getInitialization() {
      // 文章详情推荐
      this.$http
        .get("recommend/getAList", {
          params: { id: this.$route.query.id, state: 0 }
        })
        .then(res => {
          this.reoList = res.data.extend.list;
        });
    },
    // 获取文章
    getArticle() {
      this.$http
        .get("article/getArticleById", {
          params: { id: this.$route.query.id, token: this.token }
        })
        .then(res => {
          var article = res.data.extend.article;
          var authorId = res.data.extend.article.authorId;
          this.follows(authorId, this.token);
          this.article = res.data.extend.article;
        }).catch((err)=>{
        // this.isRefresh = true;
      });
    },
    // 关注作者
    follow(authorId, token) {
      this.$http
        .get("token/addOrRelease", {
          params: { token: this.token, fellowId: this.article.authorId }
        })
        .then(res => {
          this.isFollow = res.data.extend.isFollow;
          Toast(res.data.msg);
        });
    },
    // 收藏
    star() {
      var that = this;
      var token = that.token;
      var id = that.article.id;
      this.$http
        .get("token/collection", {
          params: { token: this.token, artid: id, state: 0 }
        })
        .then(res => {
          that.isStar = res.data.extend.isCollection;
          Toast(res.data.msg);
        });
    },
    // 文章点赞
    like() {
      var _this = this;
      console.log(_this.isClick);
      this.$http
        .get("token/dickorno", {
          params: { token: this.token, id: this.article.id, state: 0 }
        })
        .then(res => {
          _this.isClick = res.data.extend.isDick;
          Toast(res.data.msg);
        });
    },
    // 转发
    share() {
      var name = "duoruiapp_shareAction";
      var data = {
        title: this.article.title,
        image:
          this.article.adPic + "?x-oss-process=image/resize,m_fill,h_40,w_40",
        url:
          this.$httpUrl +
          "article-info-f?id=" +
          this.article.id +
          "&token=" +
          this.token
      };
      bridge.callhandler(name, data, function(response) {});
    },
    follows(authorId, token) {
      this.$http
        .get("token/isFollow", {
          params: { authorId: authorId, state: 0, token: this.token }
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
    // 更多详情
    articles(item) {
      this.$router.push({
        path: "/article-info-f",
        query: { id: item.id }
      });
      this.id = item.id;
    }
  }
};
</script>

<style lang="less">
.van-tabbar-item--active {
  color: #7d7e80;
}
// 清除浮动
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
.follow-box-top {
  position: fixed;
  top: 0;
  left: 0;
  padding: 0.1rem 0;
  z-index: 9999;
}
.articleInfo-f {
  position: absolute;
  top: 0;
  padding: 5% 0 0 0;
  box-sizing: border-box;
  width: 100%;
  // 作者信息
  > .follow-message {
    > .authorTitle {
      font-size: 0.22rem;
      font-weight: 400;
      text-align: justify;
      padding: 0 5%;
    }
    .follow-box {
      margin: auto auto;
      padding: 0.1rem 5%;
      background-color: #fff;
      > div {
        > img {
          display: block;
          float: left;
          width: 0.4rem;
          height: 0.4rem;
          border-radius: 50%;
          overflow: hidden;
        }
        > .author {
          float: left;
          margin-left: 0.1rem;
          > span {
            display: block;
            margin-top: 0.02rem;
          }
          > .authorName {
            font-size: 0.13rem;
            color: #000;
          }
          > .authorFans {
            font-size: 0.12rem;
            color: #707070;
          }
        }
      }
      > .follow-click {
        margin-top: 0.09rem;
        padding: 0 0.1rem;
        float: right;
        height: 0.205rem;
        border-radius: 0.05rem;
        border-radius: 0.05rem;
        border: solid 0.01rem #ddeeff;
        text-align: center;
        line-height: 0.165rem;
        font-size: 0.12rem;
        color: #2290ff;
        > span {
        }
      }
    }
  }
  // 文章内容
  > .article-html {
    padding: 0 5%;
    width: 90%;
    line-height: 1.5em;
    img {
      max-width: 100%;
      object-fit: contain;
    }
    p{
      word-break: break-all;
      word-wrap: break-word;
      white-space: pre-wrap;
    }
    span{
      word-break: break-all;
      word-wrap: break-word;
      white-space: pre-wrap;
    }
  }
  >.authorArticle{
    margin: 0.1rem 0 0 0;
    padding: 0 5% 0.1rem 5%;
    border-bottom: 3px solid #eeeeee;
  }
  > .article-recommend {
    padding: 0 5%;
    margin-bottom: 50px;
    font-size: 0.16rem;
    > .authorBox {
      padding: 0.1rem 0;
      border-bottom: 1px solid #eeeeee;
      width: 100%;

      > .authorFont {
        float: left;
        width: 70%;
        min-height: 0.4rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }

      > img {
        display: block;
        box-sizing: border-box;
        float: right;
        padding: 0 0.01rem;
        width: 0.9rem;
        height: 0.6rem;
        border-radius: 0.05rem;
      }

      > h2 {
        float: left;
        width: 70%;
        color: #999;
        font-size: 0.11rem;
        line-height: 0.15rem;
        font-weight: normal;
        margin: 0.1rem 0 0 0;
      }
    }
  }
  // 底部
  > .van-tabbar {
  }
}
</style>
