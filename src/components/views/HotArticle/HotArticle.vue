<template>
    <div class="hot-article-box">
      <img src="../../../../static/images/hot-banner.jpg" class="hot-banner">
      <div class="article-list"
           v-for="(item, index) in hotArticleList"
           :key="index"
           @click="goArticleInfo(item)"
      >
        <div class="new"> • 新上榜</div>
        <img
          :src="item.images[0] + '?x-oss-process=image/resize,m_fill,w_528,h_230'"
          v-lazy="
                  item.images[0] + '?x-oss-process=image/resize,m_fill,w_528,h_230'
                "
        >
        <div class="article-content">
          <h3>{{item.title}}</h3>
<!--          <p>不要因为传宗接代、养儿防老这样荒谬的理由去生孩子。最近因为生孩子而上热搜的女星很多，在这个问题上，并没有因为她们是明星而...</p>-->
          <div class="follow-box" @click.stop="AuthorDetails(item)">
            <img v-if="item.authorPic == null" src="../../../../static/personal/header.png" alt />
            <img v-else :src="item.authorPic" alt />
            <div class="author">
              <span class="authorName">{{item.authorName}}</span>
              <!--            <span class="authorFans">粉丝：{{ item.fansNumber }}</span>-->
            </div>
            <div class="follow-click-recommend clearfix" @click.stop="Follow(item)" v-if="item.isFollow == 0">
              <img src="../../../../static/personal/recommend-star.png"/>
              <span>关注</span>
            </div>
            <div class="follow-click clearfix" @click.stop="Follow(item)" v-else="item.isFollow == 1">
              不再关注
            </div>
          </div>
        </div>
      </div>
      <!-- 没有更多的数据显示 -->
      <div class="no-follow" v-if="articleFlag">
        <span>{{ noDataShow }}</span>
        <div class="bottom-line"></div>
      </div>
    </div>
</template>

<script>
import bridge from "../../../js/bridge.js";
import {Toast} from "vant"
export default {
  name: "HotArticle",
  data: () => ({
    token: "",
    flag: true,
    hotArticleList: [],
    noDataShow: '我是有底线的',
    scroller:{
      page: 1
    },
    hotPageList: [],
    pageFlag: false,
    articleFlag: false,
  }),
  created() {
    sessionStorage.removeItem("hotPage");
    this.token = this.$route.query.token;
    this.getHotArticle();
    window.addEventListener("scroll", this.onScroll);
    // setTimeout(()=>{
    //   document.querySelector(".article-list").style.margin = '0.260rem auto 0.310rem auto';
    //   document.querySelector(".article-list").style.transform = 'scale(1.1)';
    // },500)
  },
  methods:{
    onScroll() {
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      var windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      var scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      // setTimeout(()=>{
      //   document.querySelectorAll(".article-list").forEach(function (item,index) {
      //     if(item.getBoundingClientRect().top > 0 && item.getBoundingClientRect().top < windowHeight/2){
      //       if(index==0){
      //         item.style.margin = '0.260rem auto 0.310rem auto';
      //         item.style.transform = 'scale(1.1)';
      //         item.nextSibling.style.transform = 'scale(1)';
      //         item.nextSibling.style.margin = '0.155rem auto 0 auto';
      //       }else if(index == document.querySelectorAll(".article-list").length-1){
      //         item.style.margin = '0.310rem auto';
      //         item.style.transform = 'scale(1.1)';
      //         item.previousSibling.style.transform = 'scale(1)';
      //         item.previousSibling.style.margin = '0.155rem auto 0 auto';
      //       } else{
      //         item.style.margin = '0.310rem auto';
      //         item.style.transform = 'scale(1.1)';
      //         item.nextSibling.style.transform = 'scale(1)';
      //         item.nextSibling.style.margin = '0.155rem auto 0 auto';
      //         item.previousSibling.style.transform = 'scale(1)';
      //         item.previousSibling.style.margin = '0.155rem auto 0 auto';
      //       }
      //     }else {
      //       item.style.margin = '0.155rem auto 0 auto';
      //       item.style.transform = 'scale(1)';
      //     }
      //   });
      // },500)
      if (scrollTop + windowHeight >= scrollHeight - 100) {
        if (this.flag) {
          this.getHotArticle();
        }
      }
    },
    getHotArticle(){
      this.flag = false;
      if (sessionStorage.getItem("hotPage")) {
        JSON.parse(sessionStorage.getItem("hotPage")).forEach(item => {
          if (item == this.scroller.page) {
            this.pageFlag = true
          }
        });
      }
      if(this.pageFlag || this.articleFlag){
        return;
      }
      this.$http.get("article/getHotArticle/" + this.scroller.page, {
        params: {
          pageSize: 3,
          token: this.token
        }
      }).then(res => {
        this.flag = true;
        this.hotPageList.push(this.scroller.page);
        sessionStorage.setItem(
          "hotPage",
          JSON.stringify(this.hotPageList)
        );
        if (res.data.extend.articles == 0) {
          this.articleFlag = true;
          return;
        }else{
          this.articleFlag = false;
          this.hotArticleList = this.hotArticleList.concat(res.data.extend.articles);
          this.scroller.page++;
        }
      });
    },
    // 跳转文章详情页
    goArticleInfo(item) {
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
    // 关注
    Follow(item) {
      var _this = this;
      this.$http
        .get("token/addOrRelease", {
          params: { token: this.token, fellowId: item.authorId }
        })
        .then(res => {
          if (res.data.extend.isFollow == 1) {
            item.isFollow = 1;

          } else if (res.data.extend.isFollow == 0){
            item.isFollow = 0;
          }
          this.hotArticleList.forEach(function (list) {
            if(list.authorId == item.authorId){
              list.isFollow = item.isFollow
            }
          });
          Toast(res.data.msg)
        });
    },
    // 跳转作者详情
    AuthorDetails(item) {
      if (this.$header) {
        this.$router.push({
          path: "/authorDetails",
          query: {
            id: item.authorId,
            name: item.authorName,
            img:
              item.authorPic == null
                ? "https://articleimage.oss-cn-beijing.aliyuncs.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20190723144514.png"
                : item.authorPic,
            token: this.token
          }
        });
      } else {
        var headImgUrl = item.authorPic;
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
            item.authorId +
            "&name=" +
            item.authorName +
            "&img=" +
            headImgUrl +
            "&token=" +
            this.token
        };
        bridge.callhandler(name, data, function(response) {});
      }
    }
  },
  mounted() {
    //
    if (this.$route.path == "/hot-article") {
      var that = this;
      //监听窗口变化
      document.addEventListener("visibilitychange", function() {
        var hidden = document.visibilityState == "hidden";
        if (!hidden) {
          sessionStorage.removeItem("hotPage");
          that.scroller.page = 1;
          that.hotArticleList = [];
          that.hotPageList = [];
          that.articleFlag = false;
          that.pageFlag = false;
          that.getHotArticle()
        }
      });
    }
  }
}
</script>

<style scoped lang="less">
.hot-article-box{
  position: absolute;
  top: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  >img{
    width: 100%;
  }
  >.article-list{
    position: relative;
    width: 86%;
    margin: 0.155rem auto 0 auto;
    background-color: #ffffff;
    box-shadow: 0rem 0.01rem 0.045rem 0rem
    rgba(153, 153, 153, 0.43);
    border-radius: 0.05rem;
    transition: transform 500ms ease,margin 500ms ease;
    -webkit-transition: transform 500ms ease,margin 500ms ease;
    >.new{
      position: absolute;
      top:0.105rem;
      right:-0.055rem;
      background-color: #ffca27;
      border-radius: 0.08rem 0rem 0rem 0.08rem;
      line-height:0.21rem;
      height: 0.21rem;
      color:#ffffff;
      font-size: 0.11rem;
      padding: 0 0.06rem;
      z-index: 10;
    }
    >img{
      width: 100%;
      height:1.415rem;
      border-radius: 0.05rem 0.05rem 0 0;
      overflow: hidden;
    }
    .article-content{
      padding: 0.15rem 0.165rem;
      >h3{
        font-size:0.15rem;
        /*line-height:0.295rem;*/
        font-weight: bold;
        margin: 0;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-align: justify;
      }
      >p{
        font-size:0.14rem;
        text-indent: 0.28rem;
        line-height:0.295rem;
        margin: 0.05rem 0 0.195rem 0;
      }
      > .follow-box {
        margin: 0.195rem auto 0 auto;
        height: 0.45rem;

        > img {
          display: block;
          float: left;
          width: 0.4rem;
          height: 0.4rem;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          top: 0.02rem;
        }

        > .author {
          float: left;
          margin-left: 0.1rem;
          height: 0.4rem;
          line-height: 0.4rem;

          > span {
            display: block;
            line-height: 0.4rem;
            font-size:0.13rem;
            /*margin-top: 0.04rem;*/
          }
        }
        > .follow-click-recommend {
          margin: 0.1rem 0 0.1rem 0.1rem;
          float: right;
          height: 0.26rem;
          text-align: center;
          line-height: 0.28rem;
          background-color: #2290ff;
          color: #ffffff;
          box-shadow: 0rem 0.01rem 0.03rem 0rem rgba(153, 153, 153, 0.22);
          border-radius: 0.13rem;
          > img {
            width: 0.13rem;
            height: 0.11rem;
            float: left;
            margin-top: 0.075rem;
            margin-left: 0.19rem;
          }
          > span {
            font-size: 0.11rem;
            color: #ffffff;
            float: left;
            margin-left: 0.045rem;
            margin-right: 0.19rem;
          }
        }
        >.follow-click{
          margin: 0.1rem 0 0.1rem 0.1rem;
          float: right;
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
    }
  }
  // 没有更多的数据显示
  .no-follow {
    width: 100%;
    color: #67737f;
    text-align: center;
    padding: 30px 0;
    position: relative;
    span {
      position: absolute;
      top: 50%;
      margin-top: -11px;
      width: 110px;
      left: 50%;
      margin-left: -55px;
      background: #ffffff;
      z-index: 3;
      font-size: 0.15rem;
      color: #dddddd;
    }
    .bottom-line {
      width: 60%;
      height: 1px;
      background: #dddddd;
      position: absolute;
      top: 50%;
      z-index: 2;
      left: 20%;
    }
  }
}
</style>
