<template>
  <div class="me">
    <div class="header-tab">
      <img src="../../../../static/personal/flower.jpg" />
      <div class="contact-box" @click="contactFlag=true">成为作者</div>
      <div class="contact-box-show" v-if="contactFlag">
        <div class="contact-img">
          <div class="contact-title">申请成为多锐作者</div>
          <div class="contact-message">请联系微信 XXN1552642</div>
          <div class="contact-bottom" @click="contactFlag = false">我知道了</div>
        </div>
      </div>
      <div class="version">v1.7</div>
      <!-- tab栏 -->
      <van-tabs v-model="active" @click="goto" class="person-tab">
        <van-tab>
          <div slot="title">
            <img v-if="active == 0" src="../../../../static/personal/start-active.png" alt />
            <img v-else src="../../../../static/personal/start.png" alt />
            收藏
          </div>
        </van-tab>
        <van-tab>
          <div slot="title">
            <img v-if="active == 1" src="../../../../static/video/face-active.png" alt />
            <img v-else src="../../../../static/personal/face.png" alt />
            关注
          </div>
        </van-tab>
      </van-tabs>
      <div class="tab-center-line"></div>
    </div>

    <div v-show="active == 1">
      <!-- 关注列表 -->
      <div class="followList" v-for="(item, index) in follow">
        <div class="follow-box" @click="AuthorDetails(item)" :key="index" :id="'follow'+item.id">
          <img v-if="item.headImgUrl == null" src="../../../../static/personal/header.png" alt />
          <img v-else :src="item.headImgUrl" alt />
          <div class="author">
            <span class="authorName">{{ item.name }}</span>
            <!--            <span class="authorFans">粉丝：{{ item.fansNumber }}</span>-->
          </div>
          <div class="follow-click" @click.stop="abrogateFollow(item,index,1)">不再关注</div>
        </div>
      </div>
      <div
        class="no-follow-recommend"
        style="text-align: center;margin-top: 0.3rem;"
        v-if="noFollow"
      >
        <img src="../../../../static/personal/no-follow.png" />
        <p>暂无关注作者，为您推荐以下作者</p>
      </div>
      <!-- 推荐列表 -->
      <div class="recommend-box" v-if="followFlag">
        <div class="no-followList clearfix" v-for="(item, index) in recommendation">
          <div class="follow-box clearfix" @click="AuthorDetails(item)">
            <img v-if="item.headImgUrl == null" src="../../../../static/personal/header.png" alt />
            <img v-else :src="item.headImgUrl" alt />
            <div class="author">
              <span class="authorName">{{ item.name }}</span>
              <!--            <span class="authorFans">粉丝：{{ item.fansNumber }}</span>-->
            </div>
            <div class="follow-click-recommend clearfix" @click.stop="addFollow(item,index)">
              <img :src="item.imgSrc" />
            </div>
          </div>
        </div>
      </div>
      <div class="Recommendation" v-if="showFlag">
        为你推荐
        <span style="color: #ff4527">!!</span>
      </div>
      <!-- 推荐列表 -->
      <div class="followList" v-for="(item, index) in recommendation" v-if="showFlag">
        <div class="follow-box" :id="'follow'+item.id" @click="AuthorDetails(item)">
          <img v-if="item.headImgUrl == null" src="../../../../static/personal/header.png" alt />
          <img v-else :src="item.headImgUrl" alt />
          <div class="author">
            <span class="authorName">{{ item.name }}</span>
            <!--            <span class="authorFans">粉丝：{{ item.fansNumber }}</span>-->
          </div>
          <div class="follow-click-recommend clearfix" @click.stop="abrogateFollow(item,index,2)">
            <img src="../../../../static/personal/recommend-star.png" />
            <span>关注</span>
          </div>
        </div>
      </div>
    </div>
    <Collection
      class="dietcommons"
      ref="collection"
      v-show="active == 0"
      v-on:isloading="changeFlag"
    ></Collection>
  </div>
</template>
<script>
import headers from "@/components/common/Header.vue";
import Collection from "@/components/common/Collection.vue";
import bridge from "../../../js/bridge.js";

export default {
  components: { headers, Collection },
  data: () => ({
    token: "",
    userInfo: [], //用户信息
    active: 0, // tab默认选中
    follow: [], // 关注列表
    recommendation: [], //推荐列表
    flag: true,
    followFlag: false, //无关注作者时推荐作者显示
    showFlag: false, //有关注作者时推荐作者显示
    noFollow: false,
    originHeight: 0,
    tabIndex: 0,
    play: true,
    contactFlag: false // 联系作者显示
  }),
  // 销毁完成状态
  destroyed() {
    window.removeEventListener("scroll", this.onScroll);
  },
  created() {
    this.token = this.$route.query.token;
    if (localStorage.getItem("Browser")) {
      this.$header = true;
    }

    sessionStorage.removeItem("collecionList");

    // 获取用户信息
    // this.getUserInfo();

    // 获取关注
    // this.getFollow();

    setTimeout(() => {
      this.originHeight = document.querySelector(".header-tab").clientHeight;
      this.$refs.collection.getCollection(false);
    }, 100);

    window.addEventListener("scroll", this.onScroll);
  },
  methods: {
    changeFlag: function(flag) {
      this.flag = flag;
      if (flag) {
        setTimeout(() => {
          document.querySelectorAll(".indexcontent").forEach(function(item) {
            // console.log(item.clientHeight)
            item.setAttribute("style", "height:" + item.clientHeight + "px");
          });
        }, 500);
      }
    },
    onScroll() {
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      var windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      var scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      if (
        scrollTop >=
        this.originHeight - document.querySelector(".person-tab").clientHeight
      ) {
        document
          .querySelector(".person-tab")
          .setAttribute(
            "class",
            "person-tab header-tab-fixed van-tabs van-tabs--line"
          );
        document.querySelector(".tab-center-line").style.position = "fixed";
        document.querySelector(".tab-center-line").style.bottom = "auto";
        document.querySelector(".tab-center-line").style.top = "0.12rem";
      } else {
        document
          .querySelector(".person-tab")
          .setAttribute("class", "person-tab van-tabs van-tabs--line");
        document.querySelector(".tab-center-line").style.position = "absolute";
        document.querySelector(".tab-center-line").style.bottom = "0.12rem";
        document.querySelector(".tab-center-line").style.top = "auto";
      }
      if (
        scrollTop + windowHeight >= scrollHeight - 100 &&
        this.tabIndex == 0
      ) {
        if (this.flag) {
          this.$refs.collection.getCollection(false);
        }
      }
    },
    // 获取用户信息
    getUserInfo() {
      this.$http
        .get("token/getUserInfo", { params: { token: this.token } })
        .then(res => {
          this.userInfo = res.data.extend;
          localStorage.setItem("userInfo", this.userInfo);
        });
    },
    // 获取关注
    getFollow() {
      this.$http.get("token/getFollow?token=" + this.token).then(res => {
        if (res.data.extend.code == 201) {
          this.noFollow = true;
          this.followFlag = true;
          this.showFlag = false;
          this.follow = [];
        } else {
          this.followFlag = false;
          this.showFlag = true;
          this.noFollow = false;
          this.follow = res.data.extend.list;
        }
      });
    },
    goto(index, title) {
      this.tabIndex = index;
      if (index == 1) {
        this.getFollow();
        // 获取推荐作者
        this.getRecommendation();
      } else {
        sessionStorage.removeItem("collecionList");
        this.$refs.collection.getCollection(true);
      }
      // 统计点击量
      this.$http.get("statistics/clicksStatistics", {
        params: { type: 10, id: index + 1 }
      });
    },

    // 获取推荐作者
    getRecommendation() {
      this.$http
        .get("author/getRecommendAuthor", {
          params: { token: this.token, size: 2 }
        })
        .then(res => {
          if (res.data.extend.authorVO.length > 0) {
            this.recommendation = res.data.extend.authorVO;
            res.data.extend.authorVO[0].imgSrc =
              "../../../../static/personal/update.png";
            res.data.extend.authorVO[1].imgSrc =
              "../../../../static/personal/update.png";
          }
        });
    },
    // 取消关注作者
    abrogateFollow(item, index, flag) {
      var _this = this;
      if (this.play) {
        this.play = false;
        this.$http
          .get("token/addOrRelease", {
            params: { token: this.token, fellowId: item.id }
          })
          .then(res => {
            if (flag == 1) {
              var element = document.getElementById("follow" + item.id);
              element.setAttribute("class", "followTrantion follow-box");
              setTimeout(() => {
                element.setAttribute("class", "follow-box");
                _this.follow.splice(index, 1);
                if (_this.follow.length == 0) {
                  this.followFlag = true;
                  this.showFlag = false;
                  this.noFollow = true;
                  this.getRecommendation();
                }
              }, 500);
            } else {
              var element = document.getElementById("follow" + item.id);
              if (index == 0) {
                element.setAttribute("class", "followTrantionTop follow-box");
              } else {
                element.setAttribute("class", "followTrantionTops follow-box");
              }
              setTimeout(() => {
                element.setAttribute("class", "follow-box");
                _this.recommendation.splice(index, 1);
                if (_this.recommendation.length == 0) {
                  // this.followFlag = true;
                  // this.showFlag = false;
                  this.getRecommendation();
                }
              }, 500);
              setTimeout(() => {
                // 获取关注
                this.noFollow = false;
                _this.follow.push(item);
              }, 500);
              if (_this.recommendation.length == 0) {
              }
            }
            setTimeout(() => {
              this.play = true;
            }, 500);
          });
      }
    },
    // 关注作者
    addFollow(item, index) {
      var _this = this;
      this.$http
        .get("token/addOrRelease", {
          params: { token: this.token, fellowId: item.id }
        })
        .then(res => {
          if (res.data.extend.isFollow == 1) {
            item.imgSrc = "../../../../static/personal/dui.png";
            // 获取关注
            this.noFollow = false;
            _this.follow.push(item);
            this.getRecommendation();
            this.followFlag = false;
            this.showFlag = true;
          }
        });
    },
    // 跳转作者详情
    AuthorDetails(item) {
      // 统计作者点击
      this.$http.get("statistics/clicksStatistics", {
        params: { type: 6, id: item.id }
      });
      if (this.$header) {
        this.$router.push({
          path: "/authorDetails",
          query: {
            id: item.id,
            name: item.name,
            img:
              item.headImgUrl == null
                ? "https://articleimage.oss-cn-beijing.aliyuncs.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20190723144514.png"
                : item.headImgUrl,
            token: this.token
          }
        });
      } else {
        var headImgUrl = item.headImgUrl;
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
            item.id +
            "&name=" +
            item.name +
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
    if (this.$route.path == "/personal") {
      var that = this;
      var collection = that.$refs.collection;
      //监听窗口变化
      document.addEventListener("visibilitychange", function() {
        var hidden = document.visibilityState == "hidden";
        if (!hidden) {
          if (that.tabIndex == 1) {
            that.getFollow();
            // 获取推荐作者
            that.getRecommendation();
          } else {
            sessionStorage.removeItem("collecionList");
            collection.getCollection(true);
          }
        }
      });
    }
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

.divClass {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: -11px;
  width: 110px;
  z-index: 10;
  font-size: 0.15rem;
  color: #67737f;
  text-align: center;
  padding: 30px 0;
}
.dietcommons {
  position: absolute;
  width: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #ffffff;
}

.followTrantion {
  position: absolute;
  transform: translateX(3.75rem);
  transition: all 500ms ease;
  opacity: 0.3;
}
.followTrantionTop {
  width: 100%;
  box-sizing: border-box;
  position: absolute;
  transform: translateY(-0.54rem);
  transition: all 500ms ease;
}
.followTrantionTops {
  width: 100%;
  box-sizing: border-box;
  position: absolute;
  transform: translateY(-1.2rem);
  transition: all 500ms ease;
}

.me {
  max-width: 750px;
  min-width: 300px;
  margin: 0 auto;
  position: absolute;
  top: -0;
  width: 100%;
  padding-bottom: 0.5rem;
  box-sizing: border-box;
  .header-tab {
    width: 100%;
    height: 2.245rem;
    position: relative;
    .tab-center-line {
      width: 1px;
      height: 0.22rem;
      background-color: #dddddd;
      position: absolute;
      bottom: 0.12rem;
      left: 50%;
      z-index: 10;
    }
    .person-tab {
      position: absolute;
      bottom: -4px;
      left: 0;
      z-index: 4;
      width: 100%;
      border-top-left-radius: 0.48rem;
      border-top-right-radius: 0.48rem;
      overflow: hidden;
      height: 0.48rem;
    }
    .header-tab-fixed {
      height: 0.48rem;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 3;
      overflow: hidden;
      border-radius: 0;
    }
    > img {
      width: 100%;
      height: 100%;
    }
    // 联系作者
    .contact-box {
      position: absolute;
      left: 3%;
      top: 0.06rem;
      width: 0.57rem;
      height: 0.18rem;
      background-color: #ffffff;
      border-radius: 0.09rem;
      opacity: 0.5;
      font-size: 0.11rem;
      color: #666666;
      text-align: center;
      line-height: 0.18rem;
    }
    // 联系作责盒子
    .contact-box-show {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5) no-repeat;
      z-index: 999;
      > .contact-img {
        background: url("../../../../static/personal/contact.png") no-repeat;
        background-size: 100% 100%;
        width: 2.785rem;
        height: 2.065rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        > .contact-title {
          font-weight: bold;
          font-size: 0.14rem;
          color: #333333;
          margin-top: 0.505rem;
        }
        > .contact-message {
          font-size: 0.14rem;
          color: #666666;
          margin-top: 0.235rem;
        }
        > .contact-bottom {
          width: 1.17rem;
          height: 0.275rem;
          border-radius: 0.138rem;
          border: solid 0.005rem #000000;
          margin: 0.24rem auto auto auto;
          font-size: 0.12rem;
          line-height: 0.275rem;
          color: #4685c5;
        }
      }
    }
    // 版本
    .version {
      position: absolute;
      right: 3%;
      top: 0.06rem;
      font-size: 0.11rem;
      color: #9c9c9c;
      background: rgba(255, 255, 255, 0.6);
      padding: 0 0.08rem;
      border-radius: 0.2rem;
    }
  }
  // 头像
  > .head-portrait {
    > .head-img {
      width: 0.9rem;
      height: 0.9rem;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, 0%);

      > img {
        width: 100%;
        height: 100%;
      }
    }

    > .head-font {
      text-align: center;

      > img {
        width: 0.2rem;
        height: 0.2rem;
        vertical-align: middle;
      }
    }
  }

  //关注列表
  .followList {
    width: 100%;
    box-sizing: border-box;
    height: 0.66rem;
    border-bottom: 0.005rem solid #d5dee1;
    > .follow-box {
      margin: 0 auto;
      height: 0.45rem;
      padding: 0.1rem 5% 0 5%;
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
          /*margin-top: 0.04rem;*/
        }

        > .authorName {
          font-size: 0.13rem;
          color: #333333;
        }

        > .authorFans {
          font-size: 0.12rem;
          color: #999999;
        }
      }

      > .follow-click {
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
      > .follow-click-recommend {
        margin: 0.1rem 0 0.1rem 0.1rem;
        float: right;
        width: 0.82rem;
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
        }
      }
    }
  }
  // 为你推荐
  .Recommendation {
    font-size: 0.13rem;
    color: #333333;
    padding: 0 5%;
    margin: 0.1rem auto;
  }

  // tab栏
  .van-tabs {
    > .van-tabs__wrap {
      margin: 0 auto;

      > .van-tabs__nav {
        > .van-tabs__line {
          width: 0.34rem;
          height: 0;
          margin: 0 auto !important;
          /*background-image: linear-gradient(to left, #9bcdff 100%, #2290ff 100%, #9bcdff 100%);*/
          background-color: transparent;
        }

        > .van-tab {
          color: #9ba5af;
          font-size: 0.13rem;
          padding: 0;
        }

        .van-tab--active {
          font-weight: 550;
          color: #409efc;
          -webkit-background-clip: text;
          /*-webkit-text-fill-color: transparent;*/
          font-size: 0.15rem;
          background: url("../../../../static/personal/tab-active-line.png")
            no-repeat center bottom;
        }
      }
    }

    img {
      margin-right: 0.03rem;
      position: relative;
      top: 0.05rem;
      width: 0.2rem;
      height: 0.2rem;
    }
  }
  .van-tabs--line {
    padding-top: 0;
  }
  .van-tabs--line .van-tabs__wrap {
    height: 0.48rem;
    background: #ffffff;
  }
  .no-follow-recommend {
    color: #67737f;
    text-align: center;
    margin-top: 50px;
    > img {
      width: 1.175rem;
    }
    > p {
      width: 100%;
      text-align: center;
      font-size: 0.131rem;
      color: #888888;
    }
  }
  .recommend-box {
    margin-top: 0.34rem;
  }
  .no-followList {
    margin-bottom: 0.22rem;
    margin-left: 0.545rem;
    > .follow-box {
      float: left;
      height: 0.426rem;
      background-color: #ffffff;
      box-shadow: 0.01rem 0.001rem 0.16rem 0rem rgba(91, 159, 227, 0.16);
      border-radius: 0.213rem;
      border: solid 0.005rem #83c1ff;
      > img {
        display: block;
        float: left;
        width: 0.36rem;
        height: 0.36rem;
        border-radius: 50%;
        overflow: hidden;
        position: relative;
        top: 0.033rem;
        margin-left: 0.022rem;
      }

      > .author {
        float: left;
        margin-left: 0.1rem;
        height: 0.4rem;
        line-height: 0.426rem;
        > span {
          display: block;
          line-height: 0.426rem;
          /*margin-top: 0.04rem;*/
        }

        > .authorName {
          margin-right: 0.25rem;
          font-size: 0.13rem;
          color: #333333;
        }

        > .authorFans {
          font-size: 0.12rem;
          color: #999999;
        }
      }

      > .follow-click {
        margin-top: 0.08rem;
        float: right;
        width: 0.82rem;
        height: 0.26rem;
        text-align: center;
        line-height: 0.28rem;
        color: #2290ff;
        background-color: #ffffff;
        box-shadow: 0rem 0.01rem 0.03rem 0rem rgba(153, 153, 153, 0.22);
        border-radius: 0.13rem;

        > span {
          font-size: 0.11rem;
          color: #2290ff;
        }
      }
      > .follow-click-recommend {
        margin-top: 0.11rem;
        margin-right: 0.15rem;
        float: right;
        width: 0.22rem;
        height: 0.22rem;
        > img {
          width: 0.22rem;
          height: 0.22rem;
        }
      }
    }
  }
  .no-followList:nth-last-child(1) {
    float: right;
    margin-right: 0.545rem;
    margin-left: 0;
  }
  .van-hairline--top-bottom::after {
    border-width: 0;
  }
}
</style>
