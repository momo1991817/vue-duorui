<template>
  <div class="videoInfo">
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
          ref="video"
          @timeupdate="timeupdate($event)"
          @play="startPlay"
          @ended="videoEnded"
        ></video>
        <div class="video-title">{{ videoList.title }}</div>
        <!-- 作者信息 -->
        <div class="follow-message clearfix">
          <div class="follow-box">
            <div @click="AuthorDetails">
              <img
                v-if="videoList.headImgUrl == null"
                src="../../../../static/personal/header.png"
                alt
              />
              <img v-else :src="videoList.headImgUrl" alt />
              <div class="author">
                <span class="authorName">{{ videoList.authorName }}</span>
                <span class="authorFans">{{ videoList.createTime }}</span>
              </div>
            </div>
            <div class="follow-click" @click="follow">
              <span v-if="isFollow == 0">+ 关注作者</span>
              <span v-else-if="isFollow == 1">已关注</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 图片广告 -->
    <div class="authorArticle" @click="Jump()" v-if="number">
      <div style="width:100%" id="ss"></div>
    </div>
    <div class="authorArticle" @click="Jump()" v-else>
      <div id="sogou_wap_1043179"></div>
    </div>
    <!-- 更多推荐 -->
    <div class="video-recommend">
      <div class="authorBox" v-for="(item, index) in vList" :key="index" @click="articles(item)">
        <div class="authorFont">{{ item.title }}</div>
        <img class="cover" :src="item.cover + '?x-oss-process=image/resize,m_fill,w_100,h_60'" alt />
        <img class="img-play" src="../../../../static/video-info/playing.png" alt />
      </div>
    </div>
    <!-- 分享、点赞、转发 -->
    <div class="statBox clearfix">
      <div class="video-share">
        <img
          :src="
            isClick == 0
              ? '../../../../static/video-info/click.png'
              : '../../../../static/video-info/click-active.png'
          "
          alt
          @click="like"
        />
        <img
          :src="
            isStar == 0
              ? '../../../../static/video-info/starts.png'
              : '../../../../static/video-info/starts-active.png'
          "
          @click="star"
          alt
        />
        <img src="../../../../static/video-info/relays.png" @click="share" alt />
      </div>
    </div>
  </div>
</template>

<script>
import headers from "@/components/common/Header.vue";
import bridge from "@/js/bridge.js";
import { Toast } from "vant";
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
    videoEnede: true, // 视频播放完毕
    number: true, // 判断奇数偶数
    vList: [], // 视频详情列表
    id: "", // 视频id
    token: ""
  }),
  // 销毁完成状态
  destroyed() {
    // 视频播放完整度统计
    if (this.videoEnded) {
      this.$http
        .get("statistics/videoStatistics", {
          params: {
            videoId: this.$route.query.id,
            token: this.token,
            percent: this.videoMax,
            playDate: this.timestamp,
            videoType: this.videoList.type
          }
        })
        .then(res => {});
    }
  },
  watch: {
    // 监听视频ID发生改变重新调用获取文章接口
    id: function() {
      // 获取视频
      this.getVideo();
      // 获取初始化数据
      this.getInitialization();
      window.scrollTo(0, 0);
    }
  },
  created() {
    this.token = this.$route.query.token;
    this.id = this.$route.query.id;

    // 获取视频
    this.getVideo();

    // 判断奇数偶数
    this.number = this.$route.query.id % 2 == 0;

    setTimeout(() => {
      if (this.number) {
        (window.slotbydup = window.slotbydup || []).push({
          id: "u4081654",
          container: ss
        });
      } else {
        var sogou_div = document.getElementById("sogou_wap_1043179");
        window.sogou_un = window.sogou_un || [];
        window.sogou_un.push({ id: "1043179", ele: sogou_div });
      }
    }, 500);
    // 视频从播放的时间继续播放
    setTimeout(() => {
      this.$refs.video.currentTime = JSON.parse(
        sessionStorage.getItem("videoCurrentTime")
      );
    }, 10);
  },
  methods: {
    // 初始化数据
    getInitialization() {
      // 是否收藏
      this.$http
        .get("token/isCollection", {
          params: { artid: this.$route.query.id, state: 1, token: this.token }
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
          params: { token: this.token, id: this.$route.query.id, state: 1 }
        })
        .then(res => {
          var c = res.data.extend.isDick;
          if (c == 1) {
            this.isClick = 1;
          } else {
            this.isClick = 0;
          }
        });

      // 文章详情推荐
      this.$http
        .get("recommend/getAList", {
          params: { id: this.$route.query.id, state: 1 }
        })
        .then(res => {
          this.vList = res.data.extend.list;
        });
    },
    // 获取视频
    getVideo() {
      this.$http
        .get("video/getVideoById", {
          params: { id: this.$route.query.id, token: this.token }
        })
        .then(res => {
          this.videoList = res.data.extend.video;
          // 是否关注作者
          this.follows(this.videoList.authorId);
        });
    },
    // 是否关注作者
    follows(authorId) {
      this.$http
        .get("token/isFollow", {
          params: { authorId: authorId, stata: 0, token: this.token }
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
          Toast(res.data.msg);
        });
    },
    // 收藏
    star() {
      this.$http
        .get("token/collection", {
          params: { token: this.token, artid: this.$route.query.id, state: 1 }
        })
        .then(res => {
          this.isStar = res.data.extend.isCollection;
          Toast(res.data.msg);
        });
    },
    // 文章点赞
    like() {
      this.$http
        .get("token/dickorno", {
          params: { token: this.token, id: this.$route.query.id, state: 1 }
        })
        .then(res => {
          this.isClick = res.data.extend.isDick;
          if (this.isClick == 1) {
            this.videoList.clickNum = this.videoList.clickNum + 1;
          } else {
            this.videoList.clickNum = this.videoList.clickNum - 1;
          }
          Toast(res.data.msg);
        });
    },
    // 更多详情
    articles(item) {
      this.id = item.id;
      // 详情统计
      this.$http
        .get("statistics/clicksStatistics", {
          params: { type: 3, id: this.$route.query.id }
        })
        .then(res => {});
      if (this.$header) {
        this.$router.push({
          path: "/videoInfo",
          query: { id: item.id, token: this.token }
        });
      } else {
        var name = "duoruiapp_openInAppUrl";
        var data = {
          title: "多锐",
          url:
            this.$httpUrl + "videoInfo?id=" + item.id + "&token=" + this.token
        };
        bridge.callhandler(name, data, function(response) {});
      }
    },
    // 转发
    share() {
      // 统计分享
      this.$http
        .get("statistics/shareStatistics", {
          params: { id: this.$route.query.id, type: 2 }
        })
        .then(res => {});

      var name = "duoruiapp_shareAction";
      var data = {
        title: this.videoList.title,
        image: this.videoList.cover,
        url:
          this.$httpUrl +
          "video-info-f/?id=" +
          this.$route.query.id +
          +"&token=" +
          this.token
      };
      bridge.callhandler(name, data, function(response) {});
    },
    // 跳转作者详情
    AuthorDetails() {
      if (this.$header) {
        this.$router.push({
          path: "/authorDetails",
          query: {
            id: this.videoList.authorId,
            name: this.videoList.authorName,
            img:
              this.videoList.headImgUrl == null
                ? "https://articleimage.oss-cn-beijing.aliyuncs.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20190723144514.png"
                : this.videoList.headImgUrl,
            token: this.token
          }
        });
      } else {
        var headImgUrl = this.videoList.headImgUrl;
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
            this.videoList.authorId +
            "&name=" +
            this.videoList.authorName +
            "&img=" +
            headImgUrl +
            "&token=" +
            this.token
        };
        bridge.callhandler(name, data, function(response) {});
      }
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
              token: this.token,
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
.videoInfo {
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
      // 作者信息
      > .follow-message {
        margin: 0.2rem 0;
        > .follow-box {
          margin: 0 auto;
          width: 3.46rem;
          height: 0.45rem;
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
            margin-top: 0.12rem;
            padding: 0 0.1rem;
            float: right;
            height: 0.205rem;
            border-radius: 0.05rem;
            border-radius: 0.05rem;
            border: solid 0.01rem #ddeeff;
            text-align: center;
            line-height: 0.165rem;
            > span {
              font-size: 0.12rem;
              color: #2290ff;
            }
          }
        }
      }
    }
  }
  > .authorArticle {
    margin: 0.1rem 0 0.3rem 0;
  }
  // 更多详情
  > .video-recommend {
    margin-bottom: 50px;
    > .authorBox {
      padding: 0.1rem 0;
      border-bottom: 1px solid #eeeeee;
      width: 100%;
      display: flex;
      position: relative;
      > .authorFont {
        flex: 2;
        margin-right: 0.1rem;
      }
      > .cover {
        display: block;
        box-sizing: border-box;
        float: right;
        padding: 0 0.01rem;
        width: 0.9rem;
        height: 0.6rem;
      }
      > .img-play {
        width: 0.2rem;
        height: 0.2rem;
        position: absolute;
        right: 0.3rem;
        top: 0.2rem;
      }
    }
  }
  // 底部
  > .statBox {
    position: fixed;
    bottom: 0;
    width: 3.75rem;
    height: 0.49rem;
    background-color: #ffffff;
    > .video-author-name {
      font-size: 0.13rem;
      float: left;
      margin-left: 0.1rem;
    }
    > .video-share {
      margin-top: 0.125rem;
      float: right;
      > img {
        width: 0.255rem;
        height: 0.24rem;
        margin-right: 0.3rem;
      }
    }
  }
}
</style>
