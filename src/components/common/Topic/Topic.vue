<template>
  <div class="topic-box">
    <div class="topic-title" @click.stop="toInvestigation">
      健身大调查
      <img src="../../../../static/topic-votes/arrow-right.png">
    </div>
    <div
      class="topic-scroll-box"
      @touchstart.stop="$touchstart($event, 'topic-scroll-box')"
      @touchmove.stop="$touchmove($event, 'topic-scroll-box')"
      @touchend.stop="$touchend($event, 'topic-scroll-box')"
    >
      <div class="topic-list">
        <div
          class="topic-item"
          @click.stop="Jump(item)"
          v-for="(item,index) in topicLists"
        >
          <img :src="item.image">
          <div class="topic-number">
            {{item.enterVoteTotal}}人<br>
            参与
          </div>
          <h2>{{item.explain}}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import bridge from "@/js/bridge.js";

  export default {
    name: "Topic",
    data() {
      return {
        topicLists: [],
        token: "",
        startTop: false,
      }
    },
    created() {
      if (localStorage.getItem("Browser")) {
        this.$header = true;
      }
      this.token = this.$token;
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
      toInvestigation() {
        if (this.$header) {
          this.$router.push({
            path: "/Investigation",
            query: {
              token: this.token
            }
          });
        } else {
          var name = "duoruiapp_openInAppUrl";
          var data = {
            title: "多锐",
            url: this.$httpUrl + "Investigation?token=" + this.token
          };
          bridge.callhandler(name, data, function (response) {
          });
        }
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
          if(that.$route.path == '/'){
            that.getVote();
          }
        }
      });
    }
  }
</script>

<style scoped lang="less">
  .topic-title {
    margin: 0.12rem 0;
    line-height: 0.315rem;
    font-weight: bold;
    > img {
      width: 0.09rem;
      height: 0.165rem;
      float: right;
      margin-top: 0.075rem;
    }
  }

  .topic-scroll-box {
    width: 100%;
    overflow: hidden;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .topic-scroll-box::-webkit-scrollbar {
    display: none;
  }

  .topic-list {
    width: max-content;

    .topic-item {
      position: relative;
      float: left;
      margin-right: 0.245rem;
      width: 2.25rem;
      > img {
        width: 100%;
        height: 1.1rem;
        background-color: #333333;
        border-radius: 0.05rem;
        overflow: hidden;
      }

      .topic-number {
        position: absolute;
        text-align: center;
        top: 0;
        left: 0.1rem;
        font-size: 0.12rem;
        color: #ffffff;
        background: rgba(0, 0, 0, 0.7);
        padding: 0.04rem 0.145rem;
        border-radius: 0rem 0rem 0.05rem 0.05rem;
      }

      h2 {
        width: 100%;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        font-weight: bold;
        font-size: 0.12rem;
        color: #333333;
        margin: 0.06rem 0 0.15rem 0;
      }
    }
  }
</style>
