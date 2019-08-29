<template>
  <div class="Myintegral">
    <div class="Receive">
      <div class="Gold-coin">
        <span>￥</span>100
      </div>
      <img class="Sign-in-img" src="../../../../static/Myintegral/Sign-in.png" alt />
      <div class="Receive-box">
        <div class="Receive-list">
          <div class="Receive-element">
            <div class="Receive-title">+100</div>
            <div class="Receive-img">
              <img src="../../../../static/Myintegral/Gold-coin.png" alt />
            </div>
            <div class="Receive-week">星期一</div>
          </div>
          <div class="Receive-element">
            <div class="Receive-title">+100</div>
            <div class="Receive-img"></div>
            <div class="Receive-week">星期一</div>
          </div>
          <div class="Receive-element">
            <div class="Receive-title">+100</div>
            <div class="Receive-img"></div>
            <div class="Receive-week">星期一</div>
          </div>
          <div class="Receive-element">
            <div class="Receive-title">+100</div>
            <div class="Receive-img"></div>
            <div class="Receive-week">星期一</div>
          </div>
          <div class="Receive-element">
            <div class="Receive-title">+100</div>
            <div class="Receive-img"></div>
            <div class="Receive-week">星期一</div>
          </div>
          <div class="Receive-element">
            <div class="Receive-title">+100</div>
            <div class="Receive-img"></div>
            <div class="Receive-week">星期一</div>
          </div>
          <div class="Receive-element Receive-element-img">
            <div class="Receive-title clearfix">
              <img src="../../../../static/Myintegral/Gift-box.png" alt />
            </div>
            <div class="Receive-img"></div>
            <div class="Receive-week">星期一</div>
          </div>
        </div>
        <div class="Receive-Line"></div>
      </div>
      <div class="Receive-bottom">
        <div @click="goProfit(1)">签到规则</div>
        <div class="Receive-button">连续签到一天</div>
        <div @click="goProfit(2)">收益记录</div>
      </div>
    </div>
    <div class="task clearfix">
      <div class="Sign-in-box">
        <img src="../../../../static/Myintegral/Sign-in-img.png" alt />
        <div class="font-box">
          <div class="font-top">连续签到7天</div>
          <div class="font-bottom">连续签到7天后额外获得100金币</div>
        </div>
      </div>
      <div class="Read-box">
        <img src="../../../../static/Myintegral/Article.png" alt />
        <div class="font-box">
          <div class="font-top">阅读10篇文章</div>
          <div class="font-bottom">每日加奖，每两篇获得额外50金币</div>
          <div class="Progress">
            <span>5/10</span>
            <div></div>
          </div>
        </div>
        <div class="button" @click="goHome">去阅读</div>
      </div>
      <div class="Read-box">
        <img src="../../../../static/Myintegral/Give.png" alt />
        <div class="font-box">
          <div class="font-top">点赞10篇文章</div>
          <div class="font-bottom">每日加奖，每两篇获得额外7金币</div>
          <div class="Progress">
            <span>5/10</span>
            <div></div>
          </div>
        </div>
        <div class="button" @click="goHome">去点赞</div>
      </div>
    </div>
  </div>
</template>

<script>
import bridge from "@/js/bridge.js";
export default {
  name: "Myintegral",
  data() {
    return {};
  },
  created() {
    this.token = this.$token;
    if (localStorage.getItem("Browser")) {
      this.$header = true;
    }
  },
  methods: {
    // 跳转签到规则,跳转收益记录页面
    goProfit(flag) {
      var url = this;
      if (flag == 1) {
        url = "/CheckInRule";
      } else if (flag == 2) {
        url = "/IncomeRecord";
      }
      if (this.$header) {
        this.$router.push({
          path: url
        });
      } else {
        var name = "duoruiapp_openInAppUrl";
        var data = {
          title: "收益记录",
          url: this.$httpUrl + url
        };
        bridge.callhandler(name, data, function(response) {});
      }
    },
    // 跳转首页
    goHome() {
      if (this.$header) {
        this.$router.push({
          path: "/",
          query: {
            token: this.token
          }
        });
      } else {
        var name = "duoruiapp_openFindPageHome";
        var data = {};
        bridge.callhandler(name, data, function(response) {});
      }
    }
  }
};
</script>

<style scoped lang="less">
.Myintegral {
  width: 3.75rem;
  position: absolute;
  top: 0;
  > .Receive {
    width: 100%;
    height: 2.645rem;
    background: url("../../../../static/Myintegral/bgc.png") no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    > .Gold-coin {
      font-family: SourceHanSansCN-Regular;
      font-size: 0.3rem;
      font-weight: bold;
      letter-spacing: 0rem;
      color: #ffffff;
      text-align: center;
      margin-top: 0.41rem;
      > span {
        font-size: 0.15rem;
        font-weight: bold;
        font-stretch: normal;
      }
    }
    > .Sign-in-img {
      width: 1.31rem;
      height: 0.4rem;
      border-radius: 0.125rem;
      display: block;
      margin: 0 auto;
    }
    > .Receive-box {
      margin-top: 0.225rem;
      > .Receive-list {
        display: flex;
        padding: 0 0.1rem;
        > .Receive-element {
          flex: 1;
          text-align: center;
          z-index: 99;
          > .Receive-title {
            font-size: 0.12rem;
            color: #ffffff;
            margin-bottom: 0.06rem;
          }
          > .Receive-img {
            width: 0.165rem;
            height: 0.165rem;
            background-color: #ff8f47;
            border-radius: 0.083rem;
            margin: 0 auto;
            position: relative;
            > img {
              position: absolute;
              top: 50%;
              left: 42%;
              transform: translate(-50%, -50%);
              width: 0.195rem;
              height: 0.195rem;
              box-shadow: inset 0.001rem -0.015rem 0.035rem 0rem rgba(248, 103, 77, 0.93);
            }
          }
          > .Receive-week {
            font-size: 0.11rem;
            color: #ffffff;
          }
        }
        > .Receive-element-img {
          > .Receive-title {
            position: relative;
            > img {
              width: 0.17rem;
              height: 0.2rem;
              display: block;
              position: absolute;
              top: -0.05rem;
              left: 50%;
              transform: translate(-50%, 0);
            }
          }
          > .Receive-img {
            position: relative;
            top: 0.15rem;
          }
          > .Receive-week {
            position: relative;
            top: 0.16rem;
          }
        }
      }
      > .Receive-Line {
        width: 3.75rem;
        height: 0.03rem;
        background-color: #ff8f47;
        position: relative;
        bottom: 0.24rem;
      }
    }
    > .Receive-bottom {
      margin: 0.12rem auto auto auto;
      display: flex;
      > div {
        float: left;
        flex: 1;
        margin: 0 auto;
        text-align: center;
        font-size: 0.12rem;
        font-weight: normal;
        font-stretch: normal;
        color: #bd2005;
        line-height: 0.285rem;
      }
      > div:nth-child(1) {
        text-align: right;
        padding-right: 0.1rem;
      }
      > div:nth-child(3) {
        text-align: left;
        padding-left: 0.1rem;
      }
      > .Receive-button {
        width: 1.015rem;
        height: 0.285rem;
        background-color: #ffffff;
        box-shadow: inset 0.001rem -0.015rem 0.035rem 0rem rgba(248, 103, 77, 0.93);
        border-radius: 0.13rem;
        font-size: 0.12rem;
        line-height: 0.285rem;
        text-align: center;
      }
    }
  }
  // 任务列表
  > .task {
    padding: 0 0.125rem;
    > .Sign-in-box,
    .Read-box {
      float: left;
      margin-top: 0.275rem;
      > img {
        width: 0.52rem;
        height: 0.52rem;
        background-color: #faddd9;
        border-radius: 50%;
        display: block;
        float: left;
      }
      > .font-box {
        float: left;
        margin-left: 0.155rem;
        > .font-top {
          font-size: 0.15rem;
          font-weight: bold;
          font-stretch: normal;
          color: #333333;
          margin-top: 0.05rem;
        }
        > .font-bottom {
          font-size: 0.12rem;
          font-weight: normal;
          font-stretch: normal;
          color: #cb6d6f;
          margin-top: 0.03rem;
        }
      }
    }
    > .Read-box {
      position: relative;
      width: 100%;
      > .font-box {
        > .font-top {
          position: relative;
          top: -0.08rem;
        }
        > .font-bottom {
          position: relative;
          top: -0.07rem;
        }
        > .Progress {
          position: relative;
          width: 1.15rem;
          height: 0.11rem;
          background-color: #f1f1f1;
          border-radius: 0.05rem;
          overflow: hidden;
          text-align: center;
          > span {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 0.11rem;
            font-weight: bold;
            font-stretch: normal;
            line-height: 0.11rem;
            color: #d69e33;
          }
          > div {
            width: 50%;
            height: 100%;
            background-color: #ffe094;
            z-index: 9;
          }
        }
      }
      > .button {
        position: absolute;
        top: 50%;
        right: 0%;
        transform: translate(0%, -50%);
        float: left;
        width: 0.8rem;
        height: 0.29rem;
        background-image: linear-gradient(90deg, #f96946 0%, #f75455 100%),
          linear-gradient(#ffa900, #ffa900);
        background-blend-mode: normal, normal;
        box-shadow: 0rem 0.025rem 0.045rem 0.001rem rgba(248, 91, 80, 0.34);
        border-radius: 0.145rem;
        text-align: center;
        font-size: 0.12rem;
        font-weight: normal;
        font-stretch: normal;
        line-height: 0.29rem;
        color: #ffffff;
      }
    }
  }
}
</style>
