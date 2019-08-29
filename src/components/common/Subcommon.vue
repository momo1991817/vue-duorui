<template>
  <div class="recommend">
    <!-- <scroller
      class="scroller"
      :on-infinite="infinite"
      :noDataText="scorller.noDataText"
      ref="my_scroller"
    >-->
    <div class="refresh-box" v-if="refreshNumbaerFlag">已为您更新{{refreshNumber}}条文章</div>
    <div class="refresh-box" v-if="refreshNoNumbaerFlag">暂时没有更多文章更新</div>
    <div
      class="indexcontent"
      v-for="(item, index) in myActive == 0 ? artList : vartList"
      :key="index"
      :id="'indexcontent' + item.id"
      v-bind:listId="item.id"
      v-bind:page="item.page"
      v-if="item.advertisementId !== 4"
      :style="bottomColumn==false?'padding-bottom:0.1rem;':''"
    >
      <!-- 一张图 -->
      <div class="authorArticle" v-if="item.isType == 0" @click="goArticleInfo(item, index)">
        <div class="img-one" v-if="item.images != null">
          <div class="authorTitle" :id="'color'+item.id">{{ item.title }}</div>
          <img
            class="authorOneImg"
            :src="
              item.images[0] + '?x-oss-process=image/resize,m_fill,w_528,h_230'
            "
            alt
            v-lazy="
              item.images[0] + '?x-oss-process=image/resize,m_fill,w_528,h_230'
            "
          />
          <div class="authorBox clearfix" v-if="bottomColumn">
            <div class="authorName">{{ item.authorName }}</div>
            <div class="authorTime">{{ item.createTime }}</div>
            <img
              class="authorDelete"
              src="../../../static/android/delete.png"
              alt
              @click.stop="deleteLike(item, index,0)"
            />
          </div>
        </div>
      </div>

      <!-- 三张图 -->
      <div
        class="authorArticle"
        v-if="item.isType == 1 || item.isType == 2"
        @click="goArticleInfo(item, index)"
      >
        <div class="img-three" v-if="item.images != null">
          <div class="authorTitle" :id="'color'+item.id">{{ item.title }}</div>
          <div class="authorImg">
            <img
              :src="item.images[0] + '?x-oss-process=image/resize,m_fill,w_254'"
              v-lazy="
                item.images[0] + '?x-oss-process=image/resize,m_fill,w_254'
              "
              alt
            />
            <img
              :src="item.images[1] + '?x-oss-process=image/resize,m_fill,w_254'"
              v-lazy="
                item.images[1] + '?x-oss-process=image/resize,m_fill,w_254'
              "
              alt
            />
            <img
              :src="item.images[2] + '?x-oss-process=image/resize,m_fill,w_254'"
              v-lazy="
                item.images[2] + '?x-oss-process=image/resize,m_fill,w_254'
              "
              alt
            />
          </div>
          <div class="authorBox clearfix" v-if="bottomColumn">
            <div class="authorName">{{ item.authorName }}</div>
            <div class="authorTime">{{ item.createTime }}</div>
            <img
              class="authorDelete"
              src="../../../static/android/delete.png"
              alt
              @click.stop="deleteLike(item,index, 0)"
            />
          </div>
        </div>
      </div>

      <!-- 左图右文 -->
      <div class="authorArticle" v-if="item.isType == 6" @click="goArticleInfo(item, index)">
        <div class="img-left" v-if="item.images != null">
          <div class="authorImg">
            <img
              :src="
                item.images[0] +
                  '?x-oss-process=image/resize,m_fill,h_140,w_282'
              "
              v-lazy="
                item.images[0] +
                  '?x-oss-process=image/resize,m_fill,h_140,w_282'
              "
              alt
            />
            <div class="authorFont" :id="'color'+item.id">{{ item.title }}</div>
          </div>
          <div class="authorBox clearfix" v-if="bottomColumn">
            <div class="authorName">{{ item.authorName }}</div>
            <div class="authorTime">{{ item.createTime }}</div>
            <img
              class="authorDelete"
              src="../../../static/android/delete.png"
              alt
              @click.stop="deleteLike(item,index, 0)"
            />
          </div>
        </div>
      </div>

      <!-- 左文右图 -->
      <div
        class="authorArticle"
        v-if="item.isType == 3 || item.isType == 4"
        @click="goArticleInfo(item, index)"
      >
        <div
          class="img-right"
          v-if="item.images != null"
          :style="bottomColumn==false?'margin-bottom:0':'margin-bottom:0.05rem'"
        >
          <div class="authorImg clearfix">
            <div class="author-left">
              <div
                class="authorFont"
                :style="bottomColumn?'margin-bottom: 0.14rem;':'margin-bottom: 0;'"
                :id="'color'+item.id"
              >{{ item.title }}</div>
            </div>
            <img
              class="author-img"
              :src="
                item.images[0] +
                  '?x-oss-process=image/resize,m_fill,h_140,w_282'
              "
              v-lazy="
                item.images[0] +
                  '?x-oss-process=image/resize,m_fill,h_140,w_282'
              "
              alt
            />
            <div v-if="bottomColumn" class="authorBox clearfix">
              <div class="authorName">{{ item.authorName }}</div>
              <div class="authorTime">{{ item.createTime }}</div>
            </div>
            <div class="authorDelete" @click.stop="deleteLike(item, index,0)">
              <img src="../../../static/android/delete.png" alt />
            </div>
          </div>
        </div>
      </div>

      <!-- 视频 -->
      <div class="authorArticle clearfix" v-if="item.cover != undefined">
        <div class="authorVideoBox clearfix">
          <div class="authorTitle">{{ item.title }}</div>
          <div class="authorVideo">
            <video
              webkit-playsinline
              playsinline
              x5-playsinline
              x-webkit-airplay="allow"
              controlslist="nodownload nofullscreen"
              :src="item.url"
              :poster="item.cover"
              :id="'videoId' + index"
              @play="starPlay(index, item)"
            ></video>
          </div>
          <img
            :id="'img' + index"
            src="../../../static/video-info/playing.png"
            class="cover"
            @click.stop="playVideo(index)"
            alt
          />
          <div class="authorBox clearfix" v-if="bottomColumn" @click="goVideoInfo(item, index)">
            <div class="authorName">{{ item.authorName }}</div>
            <div class="authorTime">{{ item.createTime }}</div>
            <img
              class="authorDelete"
              src="../../../static/android/delete.png"
              alt
              @click.stop="deleteLike(item, index,1)"
            />
          </div>
        </div>
      </div>

      <!-- 图片广告 -->
      <div class="authorArticle" v-if="item.Aid">
        <div class="aclass" :id="item.Aid"></div>
      </div>
      <div class="authorArticle" v-if="item.Sid">
        <div class="aclass" :id="item.Sid"></div>
      </div>
    </div>
    <!-- </scroller> -->
    <!-- 没有更多的数据显示 -->
    <div class="no-follow" v-if="articleFlag" :style="this.lineFlag ? 'color: #dddddd' : ''">
      <span>{{ noDataShow }}</span>
      <div class="bottom-line" v-if="lineFlag" :style="this.lineFlag ? 'background: #dddddd' : ''"></div>
    </div>
    <!-- 保存进入详情页的文章或视频id-->
    <input
      v-model="collectionId"
      v-bind:collectionState="collectionState"
      id="collectionId"
      style="display: none"
    />
  </div>
</template>

<script>
import { Dialog, Toast } from "vant";
import bridge from "../../js/bridge.js";
import store from "@/store";
import banner from "@/components/common/Banner/Banner.vue";
import SubColumns from "./SubColumns/SubColumns";

export default {
  props: ["bottomColumn"],
  components: {
    SubColumns,
    banner
  },
  data: () => ({
    artList: [], // 文章列表
    page: 1, // 页码
    scorller: {
      page: 0,
      noDataText: ""
    },
    token: "",
    dietPage: [], // diet页码数据
    diet: false, // diet页面是否还请求数据
    id: "", // 页面id
    articlePage: 1, //文章页码
    videoPage: 1, // 视频页码
    vartList: [], //视频列表
    myActive: "", // tab栏索引
    articleFlag: false, //暂无更多数据
    videoMax: 0, //视频播放最大完成度
    videoMaxNumber: 0,
    token: "",
    timestamp: "", //当前视频的时间戳
    videoElementId: "", //元素ID
    videoTopId: "", //上一个视频的id
    noDataShow: "暂无内容呢~",
    flag: true, // 节流阀
    aSogou: 4081654, //搜狗广告
    aBaidu: 1232132, //百度广告
    end: false, //判断是否加载完毕
    videoEnd: false, //视频加载完毕
    articleEnd: false, //文章加载完毕
    collectionId: "", //进入详情页的id
    collectionState: "", //进入详情页的类型（文章或视频）
    lineFlag: false, //我是有底线的中间线条显示
    columnId: "",
    isType: 0,
    refreshNumber: 0, // 刷新数据的条数
    refreshNumbaerFlag: false, // 显示刷新数据条数
    refreshNoNumbaerFlag: false, // 刷新0条数据时显示
    isSubColumn: false // 是否有子栏目
  }),
  store,
  created() {
    this.token = this.$route.query.token;
    if (localStorage.getItem("Browser")) {
      this.$header = true;
    }

  },
  // 页面销毁
  beforeDestroy() {},
  methods: {
    // 跳转视频详情页
    goVideoInfo(item, index) {
      this.collectionId = item.id;
      this.collectionState = 1;
      if (this.$header) {
        this.$router.push({
          path: "/videoInfo",
          query: { id: item.id, token: this.token }
        });
      } else {
        var name = "duoruiapp_openInAppUrl";
        var data = {
          title: "多锐",
          url: this.$httpUrl + "videoInfo?id=" + item.id + "&token" + this.token
        };
        bridge.callhandler(name, data, function(response) {});
      }
    },
    // 点击播放视频
    playVideo(index) {
      document.getElementById("videoId" + index).play();
      document.getElementById("img" + index).style.display = "none";
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
    // 删除不喜欢
    deleteLike(item, index, state) {
      var that = this;
      Dialog.confirm({
        // title: "标题",
        message: "不感兴趣?"
      })
        .then(() => {
          // on confirm
          that.$http
            .get("token/donotShow", {
              params: { id: item.id, token: that.token, state: state }
            })
            .then(res => {
              that.artList.splice(index, 1);
              if (that.artList.length == 5) {
                that.getMoresList(that.columnId);
              }
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    // 获取更多文章
    getMoresList(columnId) {
      var that = this;
      this.$emit("isloading", false);
      this.scorller.page++;
      // 判断页码是否请求过，请求过就不请求了
      if (columnId == 4) {
        if (sessionStorage.getItem("dietPage")) {
          JSON.parse(sessionStorage.getItem("dietPage")).forEach(item => {
            if (this.scorller.page == item) {
              this.diet = true;
            }
          });
        }
      }

      if (columnId == 4 && this.diet) {
        return;
      } else if (this.end) {
        return;
      }
      localStorage.setItem("start", false);

      this.$http
        .get("article/getArticleByTypeId/" + this.scorller.page, {
          params: { articleCategory: columnId }
        })
        .then(res => {
          var newsList1 = res.data.extend.articles;
          if (newsList1.length == 0) {
            localStorage.setItem("start", true);
            this.noDataShow = "我是有底线的";
            this.lineFlag = true;
            this.articleFlag = true;
            this.end = true;
            return;
          }
          newsList1.forEach(function(item, index) {
            item.isType = that.isType;
            if (item.images.length < 3 && that.isType == 1) {
              item.isType = 4;
            }
            if (item.images.length < 3 && that.isType == 2) {
              item.isType = 0;
            }
            that.isType++;
            if (that.isType == 5) {
              that.isType = 0;
            }
          });
          // if (newsList1.length < 5) {
          //   this.aBaidu++;
          //   var lists = { Sid: "s" + this.aBaidu };
          //   newsList1.splice(1, 0, lists);
          //   this.artList = this.artList.concat(newsList1);
          //   setTimeout(() => {
          //     var sogou_div = document.getElementById("s" + this.aBaidu);
          //     window.sogou_un = window.sogou_un || [];
          //     window.sogou_un.push({ id: "1043179", ele: sogou_div });
          //   }, 10);
          // } else {
          // this.aSogou++;
          // var list = { Aid: "a" + this.aSogou };
          // newsList1.splice(4, 0, list);
          // this.aBaidu++;
          // var lists = { Sid: "s" + this.aBaidu };
          // newsList1.splice(11, 0, lists);
          this.artList = this.artList.concat(newsList1);
          this.$emit("isloading", true);
          // setTimeout(() => {
          //   (window.slotbydup = window.slotbydup || []).push({
          //     id: "u4081654",
          //     container: "a" + this.aSogou,
          //     isAsync: true
          //   });
          //   var sogou_div = document.getElementById("s" + this.aBaidu);
          //   window.sogou_un = window.sogou_un || [];
          //   window.sogou_un.push({ id: "1043179", ele: sogou_div });
          // }, 10);
          // }
          this.flag = true;
        }).catch((err) => {
        this.$emit("isloading", true);
      });
      if (columnId == 4) {
        this.dietPage.push(this.scorller.page);
        sessionStorage.setItem("dietPage", JSON.stringify(this.dietPage));
      }
    },
    // 获取初始化数据
    getList(columnId) {
      if(this.lineFlag){
        this.refreshNumber = false;
        this.refreshNoNumbaerFlag = true;
        setTimeout(() => {
          this.refreshNoNumbaerFlag = false;
        }, 2000);
        return;
      }
      var that = this;
      this.articleFlag = false;
      this.$emit("isloading", false);
      this.scorller.page++;
      this.end = false;
      this.dietPage = [];
      sessionStorage.removeItem("dietPage");
      // 获取页面id
      this.id = columnId;
      this.$http
        .get("article/getArticleByTypeId/" + this.scorller.page, {
          params: { articleCategory: columnId}
        })
        .then(res => {
          var newsList1 = res.data.extend.articles;
          if(newsList1 == ""){
            this.refreshNumber = false;
            this.refreshNoNumbaerFlag = true;
            setTimeout(() => {
              this.refreshNoNumbaerFlag = false;
            }, 2000);
            return;
          } else {
            this.refreshNumber = newsList1.length;
          }
          if (newsList1.length == 0) {
            this.articleFlag = true;
            this.scorller.page = 0;
            this.getList();
          }
          // if (newsList1.length < 5) {
          //   // 添加广告
          //   this.aBaidu++;
          //   var lists = { Sid: "s" + this.aBaidu };
          //   newsList1.splice(1, 0, lists);
          //   this.artList = newsList1;
          //   setTimeout(() => {
          //     var sogou_div = document.getElementById("s" + this.aBaidu);
          //     window.sogou_un = window.sogou_un || [];
          //     window.sogou_un.push({ id: "1043179", ele: sogou_div });
          //   }, 100);
          // } else {
          // 添加广告
          // this.aSogou++;
          // var list = { Aid: "a" + this.aSogou };
          // newsList1.splice(4, 0, list);
          // this.aBaidu++;
          // var lists = { Sid: "s" + this.aBaidu };
          // newsList1.splice(11, 0, lists);
          this.artList = newsList1.concat(this.artList);
          this.artList.forEach(function(item, index) {
            item.isType = that.isType;
            if (item.images.length < 3 && that.isType == 1) {
              item.isType = 4;
            }
            if (item.images.length < 3 && that.isType == 2) {
              item.isType = 0;
            }
            that.isType++;
            if (that.isType == 5) {
              that.isType = 0;
            }
          });
          this.$emit("isloading", true);
          //   setTimeout(() => {
          //     (window.slotbydup = window.slotbydup || []).push({
          //       id: "u4081654",
          //       container: "a" + this.aSogou,
          //       isAsync: true
          //     });
          //     var sogou_div = document.getElementById("s" + this.aBaidu);
          //     window.sogou_un = window.sogou_un || [];
          //     window.sogou_un.push({ id: "1043179", ele: sogou_div });
          //   }, 100);
          // }
          this.refreshNumbaerFlag = true;
          setTimeout(() => {
            this.refreshNumbaerFlag = false;
          }, 2000);
        }).catch((err) => {
        this.$emit("isloading", true);
      });
    },
    // 跳转文章详情
    goArticleInfo(item, index) {
      // 设置看过的文章颜色
      document.querySelector("#color" + item.id).style = "color: gray";
      this.collectionId = item.id;
      this.collectionState = 0;
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
            this.$httpUrl +
            "articleInfo?id=" +
            item.id +
            "&index=" +
            item.index +
            "&token=" +
            this.token
        };
        bridge.callhandler(name, data, function(response) {});
      }
    },
  },
  watch: {}
};
</script>

<style lang="less" scoped>
// 清除浮动
.clearfix:after {
  content: "";
  display: block;
  clear: both;
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
  }

  .bottom-line {
    width: 60%;
    height: 1px;
    background: #67737f;
    position: absolute;
    top: 50%;
    z-index: 2;
    left: 20%;
  }
}
// 刷新数据
.refresh-box {
  position: relative;
  left: -4.3%;
  top: 0;
  box-sizing: border-box;
  width: 3.75rem;
  height: 0.2rem;
  background-color: #e4efff;
  text-align: center;
  font-size: 0.11rem;
  line-height: 0.2rem;
  color: #99bbed;
}

.recommend {
  padding: 0 4%;
  min-height: 100%;
  box-sizing: border-box;
  // 轮播图
  .swipe-img {
    height: 2rem;
    width: 100%;
    box-sizing: border-box;
    margin: 0 auto;
    margin-bottom: 0.1rem;

    .van-swipe-item {
      .swipe-img {
        margin: 0 auto;
        display: block;
        width: 95%;
        height: 100%;
      }
    }
  }

  .indexcontent {
    border-bottom: 1px solid #eeeeee;
    font-size: 0.17rem;
    color: #666;

    > .authorArticle {
      margin-top: 0.05rem;
      // 一张图
      > .img-one {
        width: 100%;
        overflow: hidden;
        // border-bottom: 1px solid #eeeeee;
        > .authorOneImg {
          display: block;
          width: 100%;
          height: 1.4rem;
          position: relative;
          top: 0;
          left: 0;
          border-radius: 0.05rem;
        }
      }

      // 三张图
      > .img-three {
        // border-bottom: 1px solid #eeeeee;
        > .authorImg {
          width: 100%;
          display: flex;
          height: 1.1rem;

          > img {
            display: block;
            box-sizing: border-box;
            flex: 1;
            width: 33.333%;
            float: left;
            padding: 0 0.01rem;
          }

          > img:nth-child(1) {
            border-radius: 0.05rem 0rem 0rem 0.05rem;
          }

          img:nth-child(3) {
            border-radius: 0rem 0.05rem 0.05rem 0rem;
          }
        }
      }

      // 左图右文
      > .img-left {
        // border-bottom: 1px solid #eeeeee;
        > .authorImg {
          display: flex;
          width: 100%;
          height: 0.7rem;

          > img {
            flex: 1;
            width: 0.9rem;
            margin-top: 0.05rem;
            border-radius: 0.05rem;
          }

          > .authorFont {
            flex: 2;
            font-size: 0.17rem;
            color: #000;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
          }
        }
      }

      // 左文右图
      > .img-right {
        position: relative;
        margin-bottom: 0.05rem;
        // border-bottom: 1px solid #eeeeee;

        > .authorImg {
          /*display: flex;*/
          width: 100%;
          border-radius: 0.05rem;
          position: relative;
          > .authorBox {
            float: left;
            height: 0.15rem;
            top: 0;
            padding: 0;
            min-width: 50%;
            margin-top: 0.05rem;
          }
          .author-left {
            float: left;
            width: 70%;
            max-height: 0.8rem;
            overflow: hidden;
            > .authorFont {
              font-size: 0.17rem;
              color: #000;
              /*flex: 2;*/
              float: left;
              width: 100%;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              overflow: hidden;
              min-height: 0.46rem;
              margin-bottom: 0.14rem;
              line-height: 0.23rem;
              .authorBox {
                margin-top: 30px;
              }
            }
          }
          > img {
            /*flex: 1;*/
            float: right;
            width: 30%;
            height: 0.8rem;
            border-radius: 0.05rem;
          }
          > .authorDelete {
            float: right;
            margin: 0.048rem 0.05rem 0 0.05rem;
            > img {
              display: block;
              width: 0.16rem;
              height: 0.16rem;
              vertical-align: middle;
            }
          }
        }
      }

      // 视频
      > .authorVideoBox {
        // border-bottom: 1px solid #eeeeee;
        // padding-bottom: 0.1rem;
        position: relative;

        > .authorVideo {
          width: 100%;

          > video {
            display: block;
            object-position: inherit;
            height: 1.7rem;
            width: 100%;
            object-fit: fill;
          }
        }

        > .cover {
          width: 0.3rem;
          height: 0.3rem;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -60%);
        }
      }

      // 广告
      > .aclass {
        padding: 0 0.05rem;
        // border-bottom: 1px solid #eeeeee;
      }

      .authorTitle {
        position: relative;
        margin-bottom: 0.07rem;
        width: 100%;
        font-size: 0.17rem;
        float: left;
        font-weight: normal;
        color: #000;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-align: justify;
        line-height: 0.22rem;
      }

      .authorBox {
        padding: 0.05rem 0;

        .authorName,
        .authorTime {
          float: left;
          color: #999;
          font-size: 0.11rem;
          line-height: 0.15rem;
        }

        .authorName {
        }

        .authorTime {
          margin: 0rem 0 0 0.05rem;
        }

        .authorDelete {
          display: block;
          float: right;
          width: 0.16rem;
          height: 0.16rem;
          vertical-align: middle;
          margin: 0 0.05rem;
        }
      }
    }
  }
}
</style>
