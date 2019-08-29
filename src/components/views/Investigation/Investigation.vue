<template>
  <div class="Investigation">
    <div class="Investigation-title">健身大调查</div>
    <div class="Investigation-list clearfix">
      <div
        class="Investigation-box"
        v-for="(item,index) in topicLists"
        @click.stop="Jump(item)"
      >
        <img
          class="Investigation-box-img"
          :src="item.image"
          alt
        />
        <div class="Investigation-position-box">
          <div>{{item.enterVoteTotal}}人</div>
          <div>参与</div>
        </div>
        <div class="Investigation-box-title">{{item.explain}}</div>
        <div class="Investigation-box-author">来自“{{item.authorName}}”提供</div>
      </div>
    </div>
    <!-- 底部 -->
    <van-divider :style="{ color: '#999999', borderColor: '#999999', padding: '0 60px' }">还有更多话题敬请期待</van-divider>
  </div>
</template>

<script>
  import bridge from "@/js/bridge.js";
export default {
  name: "Investigation",
  data() {
    return {
      token: "",
      topicLists: []
    };
  },
  created() {
    this.token = this.$route.query.token;
    if (localStorage.getItem("Browser")) {
      this.$header = true;
    }
    this.getVote();
  },
  methods: {
    //获取话题
    getVote(){
      this.$http.get("/vote/getVote", {
        params: { type: 2 }
      }).then((res)=>{
        this.topicLists = res.data.extend.vote;
      })
    },
    Jump(item) {
      if (this.$header) {
        this.$router.push({
          path: "/TopicInfo",
          query: {
            id: item.id,
            token: this.token
          }
        });
      } else {
        var name = "duoruiapp_openInAppUrl";
        var data = {
          title: "多锐",
          url: this.$httpUrl + "TopicInfo?id=" + item.id + "&token=" + this.token
        };
        bridge.callhandler(name, data, function (response) {
        });
      }
    }
  },
  mounted() {
    //监听窗口变化
    var that = this;
    document.addEventListener("visibilitychange", function() {
      var hidden = document.visibilityState == "hidden";
      if (!hidden) {
        if(that.$route.path == '/Investigation'){
          that.getVote();
        }
      }
    });
  }
};
</script>

<style scoped lang="less">
.Investigation {
  position: absolute;
  top: 0;
  width: 3.75rem;
  > .Investigation-title {
    font-weight: bold;
    font-size: 0.25rem;
    color: #333333;
    margin: 0.1rem 0 0 0.12rem;
  }
  > .Investigation-list {
    width: 100%;
    > .Investigation-box {
      position: relative;
      width: 3.19rem;
      box-shadow: 0rem 0.01rem 0.19rem 0rem rgba(82, 82, 82, 0.22);
      border-radius: 0.15rem;
      margin: 0.405rem auto auto auto;
      overflow: hidden;
      > .Investigation-box-img {
        width: 100%;
        height: 2.55rem;
        background-color: #e4ceb5;
      }
      > .Investigation-position-box {
        position: absolute;
        top: 0;
        left: 0.2rem;
        background: rgba(0,0,0,0.7);
        border-radius: 0rem 0rem 0.05rem 0.05rem;
        color: #fff;
        padding: 0.045rem 0.19rem;
        font-size: 0.13rem;
        text-align: center;
      }
      > .Investigation-box-title {
        font-size: 0.17rem;
        font-weight: bold;
        color: #333333;
        margin: 0.05rem 0.1rem 0 0.1rem;
      }
      > .Investigation-box-author {
        font-size: 0.12rem;
        color: #666666;
        float: right;
        margin: 0.1rem 0.15rem 0.145rem 0;
      }
    }
  }
  // 底部
  > .no-follow {
    width: 100%;
    color: #67737f;
    text-align: center;
    margin-top: 0.2rem;
    padding: 0.3rem 0;
    position: relative;
    span {
      position: absolute;
      top: 50%;
      /*width: 150px;*/
      left: 50%;
      padding: 0 0.16rem;
      box-sizing: border-box;
      background: #ffffff;
      z-index: 3;
      font-size: 0.15rem;
      transform: translate(-50%,-50%);
    }
    .bottom-line {
      width: 70%;
      height: 1px;
      background: #67737f;
      position: absolute;
      top: 50%;
      z-index: 2;
      left: 16%;
    }
  }
}
</style>
