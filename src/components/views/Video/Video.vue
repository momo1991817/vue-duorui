<template>
  <div class="video">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 轮播图 -->
      <banner :images="images" v-if="banner" ref="banner"></banner>
      <div class="video-list">
        <div class="video-move" v-for="(item, index) in videoList" :key="index">
          <div class="video-ao" v-if="item.cover">
            <video
              webkit-playsinline
              playsinline
              x5-playsinline
              x-webkit-airplay="allow"
              controlslist="nodownload nofullscreen"
              :src="item.url"
              :poster="
                item.cover + '?x-oss-process=image/resize,m_fill,w_528,h_300'
              "
              :id="'videoId' + index"
              @play="starPlay(index, item)"
              @timeupdate="timeupdate($event, item)"
            ></video>
            <div class="video-title" :id="'title' + index">
              {{ item.title }}
            </div>
            <div class="cover-box">
              <img
                :id="'img' + index"
                src="../../../../static/video-info/playing.png"
                class="cover"
                @click.stop="playVideo(index, item)"
                alt=""
              />
            </div>
            <div
              class="video-message clearfix"
              @click="goVideoInfo(index, item)"
            >
              <div class="video-author-name">{{ item.authorName }}</div>
              <div class="video-share">
                <img
                  @click.stop="like(item.id, index)"
                  :src="
                    item.likeType == 0
                      ? '../../../../static/video/click.png'
                      : '../../../../static/video/onclick.png'
                  "
                  alt
                />
                <img
                  @click.stop="collection(item.id, index)"
                  :src="
                    item.enshrineType == 0
                      ? '../../../../static/video/collection.png'
                      : '../../../../static/video/collection-active.png'
                  "
                  alt
                />
                <img
                  @click.stop="share(item.id, index)"
                  src="../../../../static/video/share.png"
                  alt
                />
              </div>
            </div>
          </div>

          <!-- 图片广告 -->
          <div class="authorArticle" @click="Jump(item)" v-if="item.Aid">
            <div class="aclass" :id="item.Aid"></div>
          </div>
          <div class="authorArticle" @click="Jump(item)" v-if="item.Sid">
            <div class="aclass" :id="item.Sid"></div>
          </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import banner from "@/components/common/Banner/Banner.vue";
import bridge from "@/js/bridge.js";

export default {
  components: {
    banner
  },
  data: () => ({
    isLoading: false,
    images: [], //轮播图
    banner: true, // 轮播图显示
    scorller: {
      page: 1,
      noDataText: ""
    },
    page: 1, // 页码
    videoList: [], // 视频列表
    videoMax: 0, //视频播放最大完成度
    videoMaxNumber: 0,
    token: "",
    timestamp: "", //当前视频的时间戳
    videoElementId: "", //元素ID
    videoTopId: "", //上一个视频的id
    flag: true,
    aSogou: 40816123454, //搜狗广告
    aBaidu: 1232112343232, //百度广告
    currentTime: "" //视频播放时间
  }),
  watch: {
    $route(to, from) {
      window.removeEventListener("scroll", this.onScroll);
      if (to.path == "/video") {
        window.addEventListener("scroll", this.onScroll);
      }
    }
  },
  created() {
    this.token = this.$route.query.token;

    window.addEventListener("scroll", this.onScroll);
    // 获取视频
    this.getVideoList(1);
    // 获取轮播图
    this.getBanner();
  },
  methods: {
    //收藏
    collection(id, index) {
      var that = this;
      var token = that.token;
      this.$http
        .get("token/collection", {
          params: { token: this.token, artid: id, state: 1 }
        })
        .then(res => {
          this.videoList[index].enshrineType = res.data.extend.isCollection;
        });
    },
    // 转发
    share(id, index) {
      // 统计分享
      this.$http
        .get("statistics/shareStatistics", {
          params: { id: id, type: 2 }
        })
        .then(res => {});

      var name = "duoruiapp_shareAction";
      var data = {
        title: this.videoList[index].title,
        image: this.videoList[index].cover,
        url: this.$httpUrl + "video-info-f/?id=" + id
      };
      bridge.callhandler(name, data, function(response) {});
    },
    // 视频点赞
    like(id, index) {
      var _this = this;
      this.$http
        .get("token/dickorno", {
          params: { token: this.token, id: id, state: 1 }
        })
        .then(res => {
          this.videoList[index].likeType = res.data.extend.isDick;
        });
    },
    onScroll() {
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      var windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      var scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      if (scrollTop + windowHeight >= scrollHeight - 100) {
        if (this.flag) {
          this.flag = false;

          this.getVideoList(this.scorller.page++);
        }
      }
    },
    // 点击播放按钮开始播放
    playVideo(index) {
      document.getElementById("videoId" + index).play();
      document.getElementById("img" + index).style.display = "none";
      document.getElementById("title" + index).style.display = "none";
      document
        .getElementById("videoId" + index)
        .setAttribute("controls", "controls");
    },
    // 阻止播放
    stopVideo() {
      document.getElementById(this.videoElementId).pause();
    },
    // 开始播放
    starPlay(index, item) {
      // sessionStorage.setItem("videoElementId", id);
      this.timestamp = Date.parse(new Date());

      // 统计上一个播放视频的完成度
      var videoId = item.id;
      // 判断是不是播放新的视频，是新视频就统计上个视频播放的完成度
      if (this.videoTopId !== videoId) {
        // 第一次看视频不执行
        if (this.videoTopId !== "") {
          // 视频播放完整度统计
          this.$http
            .get("statistics/videoStatistics", {
              params: {
                videoId: this.videoTopId,
                token: this.token,
                percent: this.videoMaxNumber,
                playDate: this.timestamp,
                videoType: item.type
              }
            })
            .then(res => {});
          // console.log('上一个id', this.videoTopId);
          // 暫停播放上一個視頻
          this.stopVideo();
        }
        this.videoTopId = item.id;
        // console.log('下一个id', this.videoTopId);
        this.videoMaxNumber = 0;
      } else {
        // console.log('等于');
      }
      // 获取元素ID
      this.videoElementId = "videoId" + index;
    },
    // 持续触发
    timeupdate: function(event, item) {
      var currentTime = event.target.currentTime;
      var duration = event.target.duration;
      this.currentTime = currentTime;
      var completeness = Math.round(
        ((currentTime / 60 / (duration / 60)) * 10000) / 100
      );
      // 判断是不是播放新的视频，是新视频就统计上个视频播放的完成度
      var id = item.id;
      if (this.videoTopId !== id) {
        this.videoTopId = id;
        // console.log('下一个id', this.videoTopId);
      } else {
        // console.log('等于');
        this.videoMax = completeness;
        if (this.videoMax > this.videoMaxNumber) {
          this.videoMaxNumber = this.videoMax;
        }
      }
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.scorller.page++;
        this.videoList = [];
        this.scorller.page = 1;
        this.getVideoList(this.scorller.page++);
        this.isLoading = false;
      }, 1000);
    },
    // 获取视频列表
    getVideoList(id) {
      localStorage.setItem("start", false);
      this.$http
        .get("video/getAllVideo/" + id, {
          params: {
            token: this.token
          }
        })
        .then(res => {
          var video = res.data.extend.videos;
          if (video.length == 0) {
            return;
          }
          if (video.length < 5) {
            this.aSogou++;
            var list = { Aid: "a" + this.aSogou };
            video.splice(1, 0, list);
            this.videoList = this.videoList.concat(video);
            setTimeout(() => {
              (window.slotbydup = window.slotbydup || []).push({
                id: "u4081654",
                container: "a" + this.aSogou,
                isAsync: true
              });
            }, 10);
          } else {
            this.aSogou++;
            var list = { Aid: "a" + this.aSogou };
            video.splice(4, 0, list);
            this.aBaidu++;
            var lists = { Sid: "s" + this.aBaidu };
            video.splice(10, 0, lists);
            this.videoList = this.videoList.concat(video);
            setTimeout(() => {
              (window.slotbydup = window.slotbydup || []).push({
                id: "u4081654",
                container: "a" + this.aSogou,
                isAsync: true
              });
              var sogou_div = document.getElementById("s" + this.aBaidu);
              window.sogou_un = window.sogou_un || [];
              window.sogou_un.push({ id: "1043179", ele: sogou_div });
            }, 10);
          }
          this.flag = true;
          localStorage.setItem("start", true);
        });
    },
    // 跳转视频详情页
    goVideoInfo(index, item) {
      if (this.$header) {
        this.$router.push({
          path: "/videoInfo",
          query: { id: item.id, token: this.token }
        });
      } else {
        var name = "duoruiapp_openInAppUrl";
        var data = {
          title: "多锐",
          url: this.$httpUrl + "videoInfo?id=" + item.id + "&token=" + this.token
        };
        bridge.callhandler(name, data, function(response) {});
      }
      // 获取视频播放时间
      sessionStorage.setItem(
        "videoCurrentTime",
        JSON.stringify(document.getElementById("videoId" + index).currentTime)
      );
    },
    // 获取轮播图
    getBanner() {
      this.$http.get("werbungImage/getImage/" + 2).then(res => {
        if (res.data.extend.image.length == 0) {
          this.banner = false;
          return;
        }
        this.images = res.data.extend.image;
      });
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
.scroller {
  padding-top: 46px;
  box-sizing: border-box;
}
video::-webkit-media-controls-start-playback-button {
  display: none;
}
.video {
  .video-list {
    width: 100%;
    box-sizing: border-box;
    > .video-move {
      width: 100%;
      position: relative;
      margin-top: 0.1rem;
      > .video-ao {
        > video {
          height: 2rem;
          width: 100%;
          height: 100%;
          object-fit: fill;
        }
        > .video-title {
          z-index: 99;
          color: #fff;
          position: absolute;
          top: 0rem;
          // left: 0.05rem;
          padding: 0 0 0 0.05rem;
          height: 0.5rem;
          line-height: 0.5rem;
          width: 100%;
          background-color: rgba(1, 1, 1, 0.5);
          overflow: hidden; /*超出部分隐藏*/
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /*规定段落中的文本不进行换行 */
        }
        > .cover-box {
          // position: absolute;
          // left: 50%;
          // top: 40%;
          // transform: translate(-50%, -50%);
          // height: 1.95rem;
          // width: 100%;
          > .cover {
            width: 0.3rem;
            height: 0.3rem;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
        > .video-message {
          margin-top: 0.05rem;
          > .video-author-name {
            font-size: 0.13rem;
            float: left;
            margin-left: 0.1rem;
          }
          > .video-share {
            float: right;
            > img {
              // vertical-align: middle;
              width: 0.2rem;
              height: 0.2rem;
              margin-right: 0.13rem;
            }
          }
        }
      }
    }
  }
}
// 广告
> .aclass {
  padding: 0 0.05rem;
  border-bottom: 1px solid #eeeeee;
}
</style>
