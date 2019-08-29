<template>
  <div class="videoInfo-f">
    <!-- <headers title="多锐"></headers> -->
    <!-- 视频信息 -->
    <div class="video-list clearfix">
      <div class="video-move">
        <video
          webkit-playsinline
          playsinline
          x5-playsinline
          x-webkit-airplay="allow"
          controls
          controlslist="nodownload nofullscreen"
          autoplay
          loop
          :src="videoList.url"
          :poster="videoList.cover"
          @timeupdate="timeupdate($event)"
          @play="startPlay"
          @ended="videoEnded"
        ></video>
        <div class="video-title">{{ videoList.title }}</div>
        <div class="video-message clearfix">
          <div class="video-author-name">作者: {{ videoList.authorName }}</div>
          <!-- <div class="video-share" @click="follow">
            <div v-if="isFollow == 0">+ 关注作者</div>
            <div v-else-if="isFollow == 1">已关注</div>
          </div>-->
        </div>
      </div>
    </div>
    <!-- 分享、点赞、转发 -->
    <!-- <div class="stat-box">
      <div @click="like">
        <img
          :src="isClick==0?'../../../../static/android/dianz1.png':'../../../../static/android/dianz2.png'"
          alt
        >
        <span>{{videoList.clickNum}}</span>
      </div>
      <div @click="star">
        <img
          :src="isStar==0?'../../../../static/android/shouc.png':'../../../../static/android/shouc2.png'"
          alt
        >
        <span>收藏</span>
      </div>
      <div @click="share">
        <img src="../../../../static/android/zfa.png" alt>
        <span>转发</span>
      </div>
    </div>-->
  </div>
</template>

<script>
import headers from "@/components/common/Header.vue";
import bridge from "@/js/bridge.js";
export default {
  components: {
    headers
  },
  data: () => ({
    videoList: [], // 视频列表
    isFollow: "", // 关注作者
    isStar: "", // 收藏
    isClick: "", // 点赞
    timestamp: "", //视频开始播放时间
    videoFlag: true, //是否播完100%
    videoMax: 0, // 播放最大进度
    videoEnede: true // 视频播放完毕
  }),
  // 销毁完成状态
  destroyed() {
    // 视频播放完整度统计
    if (this.videoEnded) {
      this.$http
        .get("statistics/videoStatistics", {
          params: {
            videoId: this.$route.query.id,
            token: this.$token,
            percent: this.videoMax,
            playDate: this.timestamp,
            videoType: this.videoList.type
          }
        })
        .then(res => {});
    }
  },
  created() {
    var token = this.$route.query.token;
    this.token = token;
    if(!this.token){
      this.token = this.$token
    }

    // 是否收藏
    this.$http
      .get("token/isCollection", {
        params: { artid: this.$route.query.id, state: 1, token: this.$token }
      })
      .then(res => {
        var b = res.data.extend.isCollection;
        if (b == 1) {
          this.isStar = 1;
        } else {
          this.isStar = 0;
        }
      });
    // 是否点赞
    this.$http
      .get("token/isDick", {
        params: { token: this.$token, id: this.$route.query.id, state: 1 }
      })
      .then(res => {
        var c = res.data.extend.isDick;
        if (c == 1) {
          this.isClick = 1;
        } else {
          this.isClick = 0;
        }
      });

    // 获取视频
    this.getVideo();
  },
  methods: {
    // 获取视频
    getVideo() {
      this.$http
        .get("video/getVideoById", {
          params: { id: this.$route.query.id, token: this.token }
        })
        .then(res => {
          this.videoList = res.data.extend.video;
          console.log(this.videoList);
          // 是否关注作者
          this.follows(this.videoList.authorId);
        });
    },
    // 是否关注作者
    follows(authorId) {
      this.$http
        .get("token/isFollow", {
          params: { authorId: authorId, stata: 0, token: this.$token }
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
    // 关注作者
    follow() {
      this.$http
        .get("token/addOrRelease", {
          params: { token: this.token, fellowId: this.videoList.authorId }
        })
        .then(res => {
          this.isFollow = res.data.extend.isFollow;
        });
    },
    // 收藏
    star() {
      this.$http
        .get("token/collection", {
          params: { token: this.$token, artid: this.$route.query.id, state: 1 }
        })
        .then(res => {
          this.isStar = res.data.extend.isCollection;
        });
    },
    // 文章点赞
    like() {
      this.$http
        .get("token/dickorno", {
          params: { token: this.$token, id: this.$route.query.id, state: 1 }
        })
        .then(res => {
          this.isClick = res.data.extend.isDick;
          if (this.isClick == 1) {
            this.videoList.clickNum = this.videoList.clickNum + 1;
          } else {
            this.videoList.clickNum = this.videoList.clickNum - 1;
          }
        });
    },
    // 转发
    share() {
      var name = "duoruiapp_shareAction";
      var data = {
        title: this.videoList.title,
        image: this.videoList.cover,
        url:
          this.$httpUrl +
          "pages/video-info-f/video-info-f?id=" +
          this.$route.query.id
      };
      bridge.callhandler(name, data, function(response) {});
    },
    // 开始播放
    startPlay() {
      this.timestamp = Date.parse(new Date());
    },
    // 持续触发
    timeupdate: function() {
      var currentTime = event.target.currentTime;
      var duration = event.target.duration;
      var completeness = Math.round(
        ((currentTime / 60 / (duration / 60)) * 10000) / 100
      );
      if (completeness > this.videoMax) {
        this.videoMax = completeness;
      }
    },
    // 播放完毕
    videoEnded() {
      if (this.videoEnded) {
        // 视频播放完整度统计
        this.$http
          .get("statistics/videoStatistics", {
            params: {
              videoId: this.$route.query.id,
              token: this.$token,
              percent: 100,
              playDate: this.timestamp,
              videoType: this.videoList.type
            }
          })
          .then(res => {});
        this.videoEnded = false; // 播放完毕，页面销毁的时候不再调用视频播放完整度统计
      }
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
.videoInfo-f {
  max-width: 750px;
  min-width: 300px;
  margin: 0 auto;
  background-color: #fff;
  width: 100%;
  position: absolute;
  top: 0;
  // 视频详情
  .video-list {
    width: 100%;
    box-sizing: border-box;
    > .video-move {
      width: 100%;
      > video {
        height: 2rem;
        width: 100%;
        object-fit: fill;
      }
      > .video-title {
        padding: 0 3%;
        color: #000;
        font-weight: 700;
      }
      > .video-message {
        padding: 0 3%;
        margin-top: 0.05rem;
        > .video-author-name {
          font-size: 0.13rem;
          float: left;
        }
        > .video-share {
          float: right;
          > div {
            float: right;
            height: 0.25rem;
            font-size: 0.13rem;
            line-height: 0.25rem;
            border-radius: 0.06rem;
            padding: 0 0.05rem;
            background: white;
            color: #2090fe;
            border: 1px solid #2090fe;
          }
        }
      }
    }
  }
  .stat-box {
    box-sizing: border-box;
    display: flex;
    margin-top: 0.1rem;
    > div {
      font-size: 0.14rem;
      flex: 1;
      padding: 0 5%;
      height: 0.35rem;
      line-height: 0.35rem;
      text-align: center;
      display: inline-block;
      border-radius: 0.18rem;
      border: 1px solid #d9d9d9;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      margin: 2%;
      > img {
        position: relative;
        top: 0.01rem;
        width: 0.17rem;
        height: 0.17rem;
      }
    }
  }
}
</style>
