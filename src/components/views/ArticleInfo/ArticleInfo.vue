<template>
  <div class="articleInfo">
    <!-- <headers title="多锐"></headers> -->
    <!-- 作者信息 -->
    <div class="follow-message clearfix">
      <div class="authorTitle">{{ article.title }}</div>
      <van-sticky>
        <div class="follow-box clearfix">
          <div @click="AuthorDetails">
            <img v-if="article.headImgUrl == null" src="../../../../static/personal/header.png" alt />
            <img v-else :src="article.headImgUrl" alt />
            <div class="author">
              <span class="authorName">{{ article.authorName }}</span>
              <span class="authorFans">{{ article.createTime }}</span>
            </div>
          </div>
          <div
            class="follow-click"
            @click="follow"
            :style="isFollow?'background-color: #fff;color: #2290ff;':'background-color: #2290ff;color: #fff;'"
          >{{isFollow?'不再关注':'关注'}}</div>
        </div>
      </van-sticky>
    </div>
    <!-- 文章内容 -->
    <div class="article-html" v-html="article.content"></div>
    <!-- 投票 -->
    <van-divider
      :style="{ color: '#999999', borderColor: '#999999', padding: '0 100px' }"
    >已投 {{voteNumber}} 票</van-divider>

    <div class="mood-box clearfix">
      <div class="long-box" v-for="(item,index) in vote" :key="index">
        <div class="long-bgc-box">
          <div class="long-bottom">
            <div class="long-font">{{item.voteNumber}}</div>
            <div
              :class="item.voteStatus==1?'long-bgc-status':'long-bgc'"
              :id="'long'+index"
              :style="'height:'+(item.voteNumber==0?'0.15rem':(item.voteNumber*0.05+0.15)+'rem')"
            ></div>
          </div>
        </div>
        <img class="long-img" @click="moodLike(item,index)" :src="item.image" alt />
        <div class="long-title">{{item.name}}</div>
      </div>
    </div>

    <!-- 搜索 -->
    <van-divider :style="{ color: '#999999', borderColor: '#999999', padding: '0 110px' }">搜索</van-divider>

    <div class="articleInfo-search clearfix">
      <div
        class="search-label"
        v-for="(item2, index2) in hostValse"
        :key="index2"
        @click="goSearch(item2)"
      >{{item2}}</div>
    </div>
    <!-- 图片广告 -->
    <!-- <div class="authorArticle" @click="Jump()" v-if="number">
      <div style="width:100%" id="ss"></div>
    </div>-->
    <div class="authorArticle" @click="Jump()">
      <div id="sogou_wap_1043179"></div>
    </div>
    <!-- 领金币 -->
    <van-circle
      v-if="currentFlag"
      v-model="currentRate"
      :rate="30"
      :speed="100"
      style="height:0.5rem;width:0.5rem;"
    >
      <img src="../../../../static/video-info/relays.jpg" alt />
    </van-circle>
    <!-- 更多推荐 -->
    <div class="article-recommend">
      <div
        class="authorBox clearfix"
        v-for="(item, index) in reoList"
        :key="index"
        @click="articles(item)"
      >
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
    <!-- 分享、点赞、转发 -->
    <div class="statBox clearfix">
      <div class="video-share">
        <img :src="isClick" alt @click="like" />
        <img :src="isStar" @click="star" alt />
        <img id="share-btn" src="../../../../static/video-info/relays.jpg" @click="share" alt />
      </div>
    </div>
    <!--  新手引导点赞  -->
    <div class="shade-box" v-show="ifInfoFirst==1">
      <div class="star-box">
        <img class="star-icon" src="../../../../static/video-info/click-active-l.png" />
        <div class="star-explain">
          <img src="../../../../static/video-info/star-exp.png" />
          <div class="star-btn" @click="showNextExplain">我知道了</div>
        </div>
      </div>
      <div class="click-box" style="display: none">
        <img class="click-icon" src="../../../../static/video/star-active-l.png" />
        <div class="click-explain">
          <img src="../../../../static/video-info/collection-exp.png" />
          <div class="click-btn" @click="endExplain">我知道了</div>
        </div>
      </div>
    </div>
    <Overtime v-if="isRefresh"></Overtime>
  </div>
</template>

<script>
import headers from "@/components/common/Header.vue";
import store from "@/store";
import bridge from "../../../js/bridge.js";
import { Toast } from "vant";
import Overtime from "../../common/Overtime/Overtime";

export default {
  components: {
    Overtime,
    headers
  },
  store,
  data: () => ({
    token: "",
    article: [], // 文章类容
    isFollow: "", // 关注作者
    isStar: "", // 收藏
    isClick: "", // 喜欢
    reoList: [], // 文章详情推荐
    id: "", // 文章id
    flag: true, // 节流阀
    number: true, // 判断奇数偶数
    top: 0, // 作者信息距离顶部的距离
    vote: [], // 心情投票
    voteNumber: 0, // 心情总投票数
    authorId: "",
    fixedTop: 0,
    ifInfoFirst: 0,
    hostValse: ["减肥指南", "健身食谱", "臀腿塑形", "增肌减脂"], // 热门搜索
    currentRate: 0, // 领金币百分比
    currentFlag: false, // 显示领金币
    isRefresh: false //是否刷新
  }),
  watch: {
    // 监听文章ID发生改变重新调用获取文章接口
    id: function() {
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
  // 销毁完成状态
  destroyed() {
    window.removeEventListener("scroll", this.onScroll);
  },
  created() {
    localStorage.setItem("pageName", 0);
    localStorage.setItem("id", this.$route.query.id);
    this.token = this.$route.query.token;
    if (!this.token) {
      this.token = this.$token;
    }
    if (localStorage.getItem("Browser")) {
      this.$header = true;
    }
    if (localStorage.getItem("ifInfoFirst") == null) {
      localStorage.setItem("ifInfoFirst", 1);
    } else {
      localStorage.setItem("ifInfoFirst", 0);
    }
    this.ifInfoFirst = localStorage.getItem("ifInfoFirst");
    // 判断奇数偶数
    this.number = this.$route.query.id % 2 == 0;

    // 获取文章
    this.getArticle();
    // 获取初始化数据
    this.getInitialization();
    setTimeout(() => {
      // 获取心情投票
      this.getVote();
    }, 200);
    setTimeout(() => {
      // 如果心情投票超过最高高度，高度变成0.9rem;
      for (let i = 0; i <= 3; i++) {
        var element = document.querySelector("#long" + i).style.height;
        if (parseFloat(element) >= 0.9) {
          document.querySelector("#long" + i).style =
            "height: 0.9rem;transition: height 1s ease;";
        }
      }

      this.top = document.querySelector(".follow-box").offsetTop;
      this.fixedTop = document.querySelector(".article-html").offsetTop;
      // if (this.number) {
      //   (window.slotbydup = window.slotbydup || []).push({
      //     id: "u4081654",
      //     container: ss
      //   });
      // } else {
      var sogou_div = document.getElementById("sogou_wap_1043179");
      window.sogou_un = window.sogou_un || [];
      window.sogou_un.push({ id: "1043179", ele: sogou_div });
      // }
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
            if (that.$header) {
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
      document.execCommand("Copy");
      if (document.execCommand("Copy")) {
        Toast("内容已复制到粘贴板");
      }
    },
    onScroll() {
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      var windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      var scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;

      this.currentRate = Math.round(
        (((scrollTop + windowHeight) / scrollHeight) * 10000) / 100
      );

      // this.currentFlag = true;

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
      // if (scrollTop >= this.top) {
      //   document
      //     .querySelector(".follow-box")
      //     .setAttribute("class", "follow-box follow-box-top clearfix");
      //   document.querySelector(".follow-box div").style = this.isFollow
      //     ? "background-color: #fff;color: #2290ff;margin-left:5%"
      //     : "background-color: #2290ff;color: #fff;margin-left:5%";
      //   document.querySelector(".follow-click").style = this.isFollow
      //     ? "background-color: #fff;color: #2290ff;margin-right:5%"
      //     : "background-color: #2290ff;color: #fff;margin-right:5%";
      //   scrollTop = 0;
      //   document.querySelector(".article-html").style.marginTop =
      //     document.querySelector(".follow-box").clientHeight + "px";
      // } else {
      //   document.querySelector(".article-html").style.marginTop = "0";
      //   document
      //     .querySelector(".follow-box")
      //     .setAttribute("class", "follow-box clearfix");
      //   document.querySelector(".follow-box div").style = this.isFollow
      //     ? "background-color: #fff;color: #2290ff;"
      //     : "background-color: #2290ff;color: #fff;";
      //   document.querySelector(".follow-click").style = this.isFollow
      //     ? "background-color: #fff;color: #2290ff;"
      //     : "background-color: #2290ff;color: #fff;";
      // }
    },
    // 获取初始化数据
    getInitialization() {
      // 是否收藏
      this.$http
        .get("token/isCollection", {
          params: { artid: this.$route.query.id, state: 0, token: this.token }
        })
        .then(res => {
          var b = res.data.extend.isCollection;
          if (b == 1) {
            this.isStar = "../../../../static/video/xStart-active.jpg";
            localStorage.setItem("isStar", 1);
          } else {
            this.isStar = "../../../../static/video/xStart.jpg";
            localStorage.setItem("isStar", 0);
          }
        });
      // 是否点赞
      this.$http
        .get("token/isDick", {
          params: { token: this.token, id: this.$route.query.id, state: 0 }
        })
        .then(res => {
          var c = res.data.extend.isDick;
          if (c == 1) {
            this.isClick = "../../../../static/video-info/click-active.jpg";
          } else {
            this.isClick = "../../../../static/video-info/click.jpg";
          }
        });

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
          this.authorId = res.data.extend.article.authorId;
          this.follows(this.authorId, this.token);
          this.article = res.data.extend.article;
        })
        .catch(err => {
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
          if (res.data.extend.isCollection == 1) {
            that.isStar = "../../../../static/video/xStart-active.gif";
          } else {
            that.isStar = "../../../../static/video/xStart.jpg";
          }
          Toast(res.data.msg);
        });
    },
    // 文章点赞
    like() {
      var _this = this;
      this.$http
        .get("token/dickorno", {
          params: { token: this.token, id: this.article.id, state: 0 }
        })
        .then(res => {
          if (res.data.extend.isDick == 1) {
            _this.isClick = "../../../../static/video-info/click-active.gif";
          } else {
            _this.isClick = "../../../../static/video-info/click.jpg";
          }
          Toast(res.data.msg);
        });
    },
    // 转发
    share() {
      document.getElementById("share-btn").style.transform = "scale(0.8)";
      setTimeout(() => {
        document.getElementById("share-btn").style.transform = "scale(1)";
      }, 200);
      // 统计分享
      this.$http
        .get("statistics/shareStatistics", {
          params: { id: this.$route.query.id, type: 1 }
        })
        .then(res => {});

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
      this.id = item.id;
      // 详情统计
      this.$http
        .get("statistics/clicksStatistics", {
          params: { type: 2, id: this.$route.query.id }
        })
        .then(res => {});
      if (this.$header) {
        this.$router.push({
          path: "/articleInfo",
          query: { id: item.id, token: this.token }
        });
      } else {
        var name = "duoruiapp_openInAppUrl";
        var data = {
          title: "多锐",
          url:
            this.$httpUrl + "articleInfo?id=" + item.id + "&token=" + this.token
        };
        bridge.callhandler(name, data, function(response) {});
      }
    },
    // 跳转作者详情
    AuthorDetails() {
      if (this.$header) {
        this.$router.push({
          path: "/authorDetails",
          query: {
            id: this.article.authorId,
            name: this.article.authorName,
            img:
              this.article.headImgUrl == null
                ? "https://articleimage.oss-cn-beijing.aliyuncs.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20190723144514.png"
                : this.article.headImgUrl,
            token: this.token
          }
        });
      } else {
        var headImgUrl = this.article.headImgUrl;
        if (headImgUrl == null) {
          headImgUrl =
            "https://articleimage.oss-cn-beijing.aliyuncs.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20190723144514.png";
        }
        var name = "duoruiapp_openInAppUrl";
        var data = {
          title: "作者文章",
          url:
            this.$httpUrl +
            "authorDetails?id=" +
            this.article.authorId +
            "&name=" +
            this.article.authorName +
            "&img=" +
            headImgUrl +
            "&token=" +
            this.token
        };
        bridge.callhandler(name, data, function(response) {});
      }
    },
    // 获取心情投票
    async getVote() {
      var res = await this.$http.get("/vote/getVoteOption", {
        params: {
          type: 1,
          voteId: 1,
          typeId: this.$route.query.id,
          token: this.token
        }
      });
      if (res.status == 200) {
        this.vote = res.data.extend.vote;
        this.voteNumber = 0;
        this.vote.forEach(item => {
          this.voteNumber += item.voteNumber;
        });
      }
    },
    // 心情投票
    moodLike(item, index) {
      var element = document.querySelector("#long" + index);
      this.$http
        .get("/vote/voteContent", {
          params: {
            type: 1,
            voteId: item.id,
            typeId: this.article.id,
            token: this.token
          }
        })
        .then(res => {
          if (res.data.code == 100) {
            Toast(res.data.msg);
          } else {
            if (element.offsetHeight >= 90) {
              element.style =
                "height: 0.9rem;transition: .5s ease;background-color: #f69242;";
            } else {
              element.style =
                "transition: height .5s ease;background-color: #f69242;height: " +
                (element.offsetHeight / 100 + 0.05) +
                "rem";
            }
            // 获取投票
            this.getVote();
          }
        });
    },
    showNextExplain() {
      document.querySelector(".star-box").style.display = "none";
      document.querySelector(".click-box").style.display = "block";
    },
    endExplain() {
      document.querySelector(".shade-box").style.display = "none";
    },
    goSearch(item) {
      if (this.$header) {
        this.$router.push({
          path: "/search",
          query: {
            value: item,
            token: this.token
          }
        });
      } else {
        var name = "duoruiapp_openInAppUrl";
        var data = {
          title: "多锐",
          url: this.$httpUrl + "search?value=" + item + "&token=" + this.token
        };
        bridge.callhandler(name, data, function(response) {});
      }
    },
    Jump() {}
  },
  mounted() {
    //
    if (this.$route.path == "/articleInfo") {
      var that = this;
      //监听窗口变化
      document.addEventListener("visibilitychange", function() {
        var hidden = document.visibilityState == "hidden";
        if (!hidden) {
          that.follows(that.authorId, that.token);
        }
      });
    }
  },
  beforeDestroy() {
    localStorage.setItem("ifInfoFirst", 0);
  }
};
</script>

<style lang="less">
.van-tabbar-item--active {
  color: #7d7e80;
}

img {
  // object-fit: fill;
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

.articleInfo {
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
        margin-top: 0.07rem;
        width: 0.82rem;
        float: right;
        text-align: center;
        line-height: 0.26rem;
        font-size: 0.12rem;
        color: #2290ff;
        height: 0.26rem;
        background-color: #ffffff;
        box-shadow: 0rem 0.01rem 0.03rem 0rem rgba(153, 153, 153, 0.22);
        border-radius: 0.13rem;

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
    overflow: hidden;

    img {
      max-width: 100%;
      object-fit: contain;
    }

    p {
      word-break: break-all;
      word-wrap: break-word;
      white-space: pre-wrap;
    }

    span {
      word-break: break-all;
      word-wrap: break-word;
      white-space: pre-wrap;
    }
  }

  > .authorArticle {
    margin: 0.3rem 0 0 0;
    padding: 0 5% 0.1rem 5%;
    border-bottom: 3px solid #eeeeee;
  }

  // 投票
  > .no-follow {
    width: 100%;
    color: #67737f;
    text-align: center;
    padding: 0.3rem 0;
    position: relative;

    span {
      position: absolute;
      top: 50%;
      margin-top: -11px;
      width: 70px;
      left: 50%;
      margin-left: -35px;
      background: #ffffff;
      z-index: 3;
      font-size: 0.15rem;
    }

    .bottom-line {
      width: 40%;
      height: 1px;
      background: #67737f;
      position: absolute;
      top: 50%;
      z-index: 2;
      left: 30%;
    }
  }

  // 心情投票
  > .mood-box {
    box-sizing: border-box;
    padding: 0 0.3rem;
    display: flex;
    margin-bottom: 0.5rem;
    > .long-box {
      flex: 1;
      float: left;
      text-align: center;

      > .long-bgc-box {
        height: 1rem;
        position: relative;

        > .long-bottom {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 0);

          > .long-font {
            font-size: 0.11rem;
            color: #666666;
            margin-bottom: 0.05rem;
          }

          > .long-bgc {
            border-radius: 0.075rem;
            width: 0.15rem;
            height: 0.15rem;
            max-height: 0.9rem;
            background-color: #d8d8d8;
            margin: 0 auto;
          }

          > .long-bgc-status {
            border-radius: 0.075rem;
            width: 0.15rem;
            height: 0.15rem;
            max-height: 0.9rem;
            background-color: #f69242;
            margin: 0 auto;
          }
        }
      }

      > .long-img {
        margin-top: 0.1rem;
        width: 0.33rem;
        height: 0.33rem;
        background-color: #f6f6f6;
        border-radius: 0.162rem;
      }

      > .long-title {
        font-size: 0.12rem;
        color: #666666;
      }
    }
  }

  // 搜索
  > .articleInfo-search {
    padding: 0 5%;
    margin-top: 0.1rem;

    > .search-label {
      width: 0.73rem;
      height: 0.19rem;
      text-align: center;
      line-height: 0.19rem;
      border-radius: 0.5rem;
      border: solid 1px #dddddd;
      font-size: 0.11rem;
      color: #666666;
      float: left;
      margin: 0.05rem;
    }

    > .search-label:first-child {
      margin-left: 0;
    }

    > .search-label:nth-child(4) {
      margin-right: 0;
    }
  }

  // 更多推荐
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

  // 领金币
  > .van-circle {
    position: fixed;
    top: 60%;
    right: 4%;
    height: 0.5rem;
    overflow: hidden;
    border-radius: 50%;
    > img {
      width: 100%;
      height: 100%;
    }
  }

  // 底部
  > .statBox {
    position: fixed;
    left: 50%;
    transform: translate(-50%, 0%);
    bottom: 0;
    width: 100%;
    height: 0.49rem;
    background-color: #ffffff;

    > .video-author-name {
      font-size: 0.13rem;
      float: left;
      margin-left: 0.1rem;
    }

    > .video-share {
      float: right;

      > img {
        width: 0.6rem;
        height: 0.49rem;
      }

      > img[src=""],
      img:not([src]) {
        opacity: 0;
      }
    }
  }
}

/*新手点赞收藏指引*/
.shade-box {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;

  .star-box {
    position: fixed;
    left: 0.585rem;
    bottom: 0.08rem;

    .star-icon {
      width: 0.36rem;
      height: 0.36rem;
      background: #ffffff;
      border-radius: 50%;
      overflow: hidden;
      position: absolute;
      left: 1.425rem;
      bottom: 0;
      z-index: 20;

      img {
        width: 0.6rem;
        position: absolute;
        top: -0.14rem;
        left: -0.125rem;
        z-index: 21;
      }
    }

    .star-explain {
      position: absolute;
      left: 0;
      bottom: 0.205rem;

      > img {
        width: 2.55rem;
      }

      .star-btn {
        width: 0.97rem;
        height: 0.245rem;
        background-color: #ffd74e;
        border-radius: 0.123rem;
        font-size: 0.13rem;
        color: #9f6411;
        text-align: center;
        line-height: 0.265rem;
        position: absolute;
        right: 0.13rem;
        top: 0.26rem;
      }
    }
  }

  .click-box {
    position: fixed;
    left: 0.735rem;
    bottom: 0.08rem;

    .click-icon {
      width: 0.36rem;
      height: 0.36rem;
      background: #ffffff;
      border-radius: 50%;
      overflow: hidden;
      position: absolute;
      left: 1.895rem;
      bottom: 0;
      z-index: 20;

      img {
        width: 0.6rem;
        position: absolute;
        top: -0.14rem;
        left: -0.12rem;
        z-index: 21;
      }
    }

    .click-explain {
      position: absolute;
      left: 0;
      bottom: 0.25rem;

      > img {
        width: 2.55rem;
      }

      .author {
        background: #ffffff;
        width: 0.745rem;
        height: 0.29rem;
        position: absolute;
        top: 0.18rem;
        right: 0.18rem;

        > img {
          width: 0.2rem;
          height: 0.2rem;
          border-radius: 50%;
          overflow: hidden;
          float: left;
          margin: 0.045rem;
        }
      }

      .click-btn {
        width: 0.97rem;
        height: 0.245rem;
        background-color: #ffd74e;
        border-radius: 0.123rem;
        font-size: 0.13rem;
        color: #9f6411;
        text-align: center;
        line-height: 0.265rem;
        position: absolute;
        right: 0.13rem;
        top: 0.52rem;
      }
    }
  }
}
</style>
