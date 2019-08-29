<template>
  <div class="recommend-author-box">
    <h3>推荐作者</h3>
    <div class="scroll-box"
         @touchstart.stop="$touchstart($event, 'scroll-box')"
         @touchmove.stop="$touchmove($event, 'scroll-box')"
         @touchend.stop="$touchend($event, 'scroll-box')"
    >
      <div class="recommend-author clearfix">
        <div
          class="author-card"
          v-for="(item, index) in authorList"
          :key="item.id"
          @click="AuthorDetails(item)"
        >
          <img
            class="delete"
            src="../../../../static/recommend/delete.png"
            @click.stop="deleteAuthor(index)"
          />
          <img class="author-img clearfix" :src="item.headImgUrl" />
          <h2>{{item.name}}</h2>
          <div
            class="click-btn clearfix"
            v-if="item.isFollow == 0"
            @click.stop="addFollow(item,index)"
          >
            <img src="../../../../static/personal/recommend-star.png" />
            <span>关注</span>
          </div>
          <div class="unclick-btn clearfix" @click.stop="addFollow(item,index)" v-else>取消关注</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bridge from "../../../js/bridge.js";
export default {
  name: "RecommendAuthor",
  data: () => ({
    token: "",
    authorList: [],
    startTop: false,
  }),
  created() {
    this.token = this.$token;
    if (localStorage.getItem("Browser")) {
      this.$header = true;
    }
    this.getRecommendAuthor();
  },
  methods: {
    getRecommendAuthor() {
      this.$http
        .get("author/getRecommendAuthor", {
          params: { token: this.token, size: 4 }
        })
        .then(res => {
          this.authorList = res.data.extend.authorVO;
          this.authorList.forEach(function(item2, index2) {
            item2.isFollow = 0;
          });
        });
    },
    deleteAuthor(index) {
      this.authorList.splice(index, 1);
      if (this.authorList.length == 0) {
        this.getRecommendAuthor();
      }
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
    },
    // 关注作者
    addFollow(item, index) {
      this.$http
        .get("token/addOrRelease", {
          params: { token: this.token, fellowId: item.id }
        })
        .then(res => {
          item.isFollow = res.data.extend.isFollow;
          this.authorList.splice(index, 1, item);
        });
    }
  },
  mounted() {
    if (this.$route.path == "/") {
      var that = this;
      //监听窗口变化
      document.addEventListener("visibilitychange", function() {
        var hidden = document.visibilityState == "hidden";
        if (!hidden) {
          that.authorList.forEach(function (item,index) {
            that.$http
              .get("token/isFollow", {
                params: { authorId: item.id, state: 0, token: that.token }
              })
              .then(res => {
                item.isFollow = res.data.extend.follow;
                that.authorList.splice(index, 1, item);
              });
          })
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
// 清除浮动
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
.recommend-author-box {
  padding-bottom: 0.155rem;
  > h3 {
    font-size: 0.16rem;
    color: #000000;
    font-weight: bold;
  }
  > .scroll-box {
    position: relative;
    width: 100%;
    height: 1.14rem;
    overflow: hidden;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch; /* 解决ios滑动不流畅问题 */
  }
  > .scroll-box::-webkit-scrollbar {
    display: none;
  }
}
.recommend-author {
  width: max-content;
  height: 1.14rem;
  > .author-card {
    width: 0.965rem;
    height: 1.11rem;
    border-radius: 0.05rem;
    border: solid 1px #dddddd;
    text-align: center;
    float: left;
    position: relative;
    margin-right: 0.15rem;
    > .delete {
      width: 0.07rem;
      height: 0.07rem;
      position: absolute;
      margin: 0.05rem 0.05rem 0.18rem 0.18rem;
      right: 0;
    }
    > .author-img {
      width: 0.4rem;
      height: 0.4rem;
      border-radius: 0.2rem;
      display: inline-block;
      margin: 0.1rem 0.1rem 0.045rem 0.1rem;
    }
    > h2 {
      font-size: 0.12rem;
      color: #000000;
      margin: 0;
      font-weight: normal;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
    .click-btn {
      width: 0.565rem;
      height: 0.18rem;
      line-height: 0.18rem;
      background-color: #2290ff;
      box-shadow: 0rem 0.01rem 0.03rem 0rem rgba(153, 153, 153, 0.22);
      border-radius: 0.09rem;
      margin: 0.1rem auto;
      > img {
        float: left;
        width: 0.1rem;
        height: 0.09rem;
        margin: 0.05rem 0.03rem 0.04rem 0.08rem;
      }
      > span {
        float: left;
        font-size: 0.11rem;
        color: #ffffff;
      }
    }
    .unclick-btn {
      margin: 0.1rem auto;
      width: 0.565rem;
      height: 0.18rem;
      line-height: 0.18rem;
      text-align: center;
      font-size: 0.11rem;
      background-color: #ffffff;
      -webkit-box-shadow: 0rem 0.01rem 0.03rem 0rem rgba(153, 153, 153, 0.22);
      box-shadow: 0rem 0.01rem 0.03rem 0rem rgba(153, 153, 153, 0.22);
      border-radius: 0.13rem;
      color: #2290ff;
    }
  }
}
</style>
