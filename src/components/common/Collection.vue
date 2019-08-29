<template>
  <div class="recommend">
    <!-- <scroller
      class="scroller"
      :on-infinite="infinite"
      :noDataText="scorller.noDataText"
      ref="my_scroller"
    >-->
    <div
      class="indexcontent"
      v-for="(item, index) in myActive == 0 ? artList : vartList"
      :key="index"
      :id="'indexcontent' + item.id"
      v-bind:listId="item.id"
      v-bind:page="item.page"
      v-if="item.advertisementId !== 4"
    >
      <div class="index-box" :id="'indexBox' + item.id">
        <div class="collection-author clearfix" @click="AuthorDetails(item)">
          <img v-if="item.headImgUrl == null" src="../../../static/personal/header.png" alt/>
          <img v-else :src="item.headImgUrl" alt/>
          <span>{{item.author}}</span>
          <div class="delete-collection" @click.stop="deleteCollection(item, index)">取消收藏</div>
        </div>
        <!-- 一张图 -->
        <div class="authorArticle" v-if="item.type == 0" @click="goArticleInfo(item, index)">
          <div class="img-one" v-if="item.images != null">
            <div class="authorTitle">{{ item.title }}</div>
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
            <div class="authorBox clearfix">
              <div class="authorName">{{ item.authorName }}</div>
              <div class="authorTime">{{ item.createTime }}</div>
            </div>
          </div>
        </div>

        <!-- 三张图 -->
        <div class="authorArticle" v-if="item.type == 1" @click="goArticleInfo(item, index)">
          <div class="img-three" v-if="item.images != null">
            <div class="authorTitle">{{ item.title }}</div>
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
            <div class="authorBox clearfix">
              <div class="authorName">{{ item.authorName }}</div>
              <div class="authorTime">{{ item.createTime }}</div>
            </div>
          </div>
        </div>

        <!-- 左图右文 -->
        <div class="authorArticle" v-if="item.type == 3" @click="goArticleInfo(item, index)">
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
              <div class="authorFont">{{ item.title }}</div>
            </div>
            <div class="authorBox clearfix">
              <div class="authorName">{{ item.authorName }}</div>
              <div class="authorTime">{{ item.createTime }}</div>
            </div>
          </div>
        </div>

        <!-- 左文右图 -->
        <div class="authorArticle" v-if="item.type == 4" @click="goArticleInfo(item, index)">
          <div class="img-right" v-if="item.images != null">
            <div class="authorImg clearfix">
              <div class="author-left">
                <div class="authorFont">{{ item.title }}</div>
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
              <div class="authorBox clearfix">
                <div class="authorName">{{ item.authorName }}</div>
                <div class="authorTime">{{ item.createTime }}</div>
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
            <div class="authorBox clearfix" @click="goVideoInfo(item, index)">
              <div class="authorName">{{ item.authorName }}</div>
              <div class="authorTime">{{ item.createTime }}</div>
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
    </div>
    <!-- </scroller> -->
    <!--    暂无收藏-->
    <div class="no-collection" v-if="noCollection">
      <img src="../../../static/HM-search/collection.png"/>
      <p>暂无收藏哟，快去浏览文章吧</p>
      <!--      <div class="add-collection">立即收藏</div>-->
    </div>
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
  import {Dialog, Toast} from "vant";
  import bridge from "../../js/bridge.js";
  import store from "@/store";
  import banner from "@/components/common/Banner/Banner.vue";

  export default {
    name: "Collection",
    components: {
      banner
    },
    data: () => ({
      artList: [], // 文章列表
      page: 1, // 页码
      token: "",
      scorller: {
        page: 1,
        noDataText: ""
      },
      collectionList: [], // personal页码数据
      collectionFlag: false, // personal页面是否还请求数据
      searchPage: [],
      searchFlag: false,
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
      noDataShow: "我是有底线的",
      noCollection: false, //没有收藏
      flag: true, // 节流阀
      end: false, //判断是否加载完毕
      videoEnd: false, //视频加载完毕
      articleEnd: false, //文章加载完毕
      AuthorDetailsEnd: false, //作者详情推荐加载完毕
      collectionId: "", //进入详情页的id
      collectionState: "", //进入详情页的类型（文章或视频）
      lineFlag: false //我是有底线的中间线条显示
    }),
    store,
    created() {
      this.token = this.$route.query.token;

      if (localStorage.getItem("Browser")) {
        this.$header = true;
      }
    },
    // 页面销毁
    beforeDestroy() {
    },
    methods: {
      // 跳转视频详情页
      goVideoInfo(item, index) {
        this.collectionId = item.id;
        this.collectionState = 1;
        if (this.$header) {
          this.$router.push({
            path: "/videoInfo",
            query: {id: item.id, token: this.token}
          });
        } else {
          var name = "duoruiapp_openInAppUrl";
          var data = {
            title: "多锐",
            url:
              this.$httpUrl + "videoInfo?id=" + item.id + "&token=" + this.token
          };
          bridge.callhandler(name, data, function (response) {
          });
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
      // 获取我的收藏更多文章
      getCollectionWen() {
        this.scorller.page++;
        this.banner = false;
        this.articleFlag = false;
        setTimeout(() => {
          var myActive = localStorage.getItem("myActive");
          this.myActive = myActive;
          if (myActive == 0) {
            var page = this.articlePage;
          } else {
            var page = this.videoPage;
          }
          if (this.end) {
            return;
          }
          this.$http
            .get("token/getCollArtList", {
              params: {token: this.token, state: myActive, page: page}
            })
            .then(res => {
              if (myActive == 0) {
                if (
                  res.data.extend.list == undefined ||
                  res.data.extend.list.length == 0
                ) {
                  this.end = true;
                  this.articleFlag = true;
                  return;
                } else {
                  this.articleFlag = false;
                  var content = res.data.extend.list;
                  this.artList = this.artList.concat(content);
                  this.articlePage++;
                  this.flag = true;
                  console.log("获取我的收藏更多文章");
                }
              } else {
                if (
                  res.data.extend.vList == undefined ||
                  res.data.extend.vList.length == 0
                ) {
                  this.articleFlag = true;
                  return;
                } else {
                  var content = res.data.extend.vList;
                  this.vartList = this.vartList.concat(content);
                  this.videoPage++;
                  this.flag = true;
                  console.log("获取我的收藏更多视频");
                }
              }
            });
        }, 100);
      },
      // 获取我的收藏文章视频
      getCollection(flag) {
        this.$emit("isloading", false);
        if (sessionStorage.getItem("collecionList")) {
          JSON.parse(sessionStorage.getItem("collecionList")).forEach(item => {
            if (item == this.scorller.page) {
              this.collectionFlag = true;
            }
          });
        }
        if (flag) {
          this.artList = [];
          this.scorller.page = 1;
          this.articleFlag = false;
          this.end = false;
          this.collectionList = [];
        }
        if (this.collectionFlag) {
          return;
        }
        if (this.end) {
          return;
        }
        this.banner = false;
        this.$http
          .get("token/getUserEnshrine", {
            params: {
              token: this.token,
              page: this.scorller.page
            }
          })
          .then(res => {
            if (
              res.data.extend.requestList == undefined ||
              res.data.extend.requestList.length == 0
            ) {
              if (this.scorller.page == 1) {
                this.noCollection = true;
              } else {
                this.noCollection = false;
                this.articleFlag = true;
                this.noDataShow = "我是有底线的";
                this.lineFlag = true;
              }
              this.end = true;
              return;
            } else {
              this.noCollection = false;
              this.articleFlag = false;
              var content = res.data.extend.requestList;
              for (var k = 0; k < content.length; k++) {
                content[k].page = this.scorller.page;
              }
              this.artList = this.artList.concat(content);
              this.$emit("isloading", true);
              this.articlePage++;
              this.flag = true;
            }
            this.collectionList.push(this.scorller.page);
            sessionStorage.setItem(
              "collecionList",
              JSON.stringify(this.collectionList)
            );
            this.scorller.page++;
          }).catch((err) => {
          this.$emit("isloading", true);
        });
      },
      // 跳转文章详情
      goArticleInfo(item, index) {
        this.collectionId = item.id;
        this.collectionState = 0;
        if (this.$header) {
          this.$router.push({
            path: "/articleInfo",
            query: {id: item.id, token: this.token}
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
          bridge.callhandler(name, data, function (response) {
          });
        }
      },
      // 取消收藏
      deleteCollection(item, index) {
        var that = this;
        var state = 0;
        if (item.cover != undefined) {
          state = 1;
        } else {
          state = 0;
        }
        this.$http
          .get("token/collection", {
            params: {token: this.token, artid: item.id, state: state}
          })
          .then(res => {
            that.isStar = res.data.extend.isCollection;

            var element = document.getElementById("indexBox" + item.id);
            element.setAttribute("class", "collectionTrantion index-box");
            setTimeout(() => {
              element.setAttribute("class", "index-box");
              this.artList.splice(index, 1);
              // Toast(res.data.msg);
              if (this.artList.length == 0) {
                this.articleFlag = false;
                this.noCollection = true;
              } else {
                this.noCollection = false;
              }
            }, 500);
          });
      },
      // 跳转作者详情
      AuthorDetails(item) {
        // 统计作者点击
        this.$http.get("statistics/clicksStatistics", {
          params: {type: 6, id: item.id}
        });
        if (this.$header) {
          this.$router.push({
            path: "/authorDetails",
            query: {
              id: item.authorId,
              name: item.author,
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
              item.authorId +
              "&name=" +
              item.author +
              "&img=" +
              headImgUrl +
              "&token=" +
              this.token
          };
          bridge.callhandler(name, data, function (response) {
          });
        }
      }
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

  .collectionTrantion {
    position: absolute;
    transform: translateX(3.75rem);
    transition: all 500ms ease;
    opacity: 0.3;
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

  .recommend {
    padding: 0 5%;
    min-height: 100%;
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

      .index-box {
        .collection-author {
          padding: 0.1rem 0;

          > img {
            width: 0.4rem;
            height: 0.4rem;
            float: left;
            border-radius: 50%;
          }

          > span {
            line-height: 0.4rem;
            float: left;
            margin-left: 0.12rem;
            font-size: 0.13rem;
            color: #333333;
          }

          .delete-collection {
            float: right;
            line-height: 0.28rem;
            text-align: center;
            font-size: 0.11rem;
            color: #2290ff;
            width: 0.82rem;
            height: 0.26rem;
            background-color: #ffffff;
            box-shadow: 0rem 0.01rem 0.03rem 0rem rgba(153, 153, 153, 0.22);
            border-radius: 0.13rem;
            margin: 0.06rem 0 0.06rem 0.12rem;
          }
        }

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
                top:0;
                padding: 0;
                min-width: 50%;
                margin-top: 0.05rem;
                .authorTime{
                  margin: 0;
                }
              }
              .author-left{
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
                  line-height: 0.22rem;
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
                margin: 0.048rem 0.05rem 0.05rem 0.05rem;
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

            .authorDelete {
              display: block;
              float: right;
              width: 0.16rem;
              height: 0.16rem;
              vertical-align: middle;
            }
          }
        }
      }
    }

    /*  暂无收藏*/

    .no-collection {
      width: 100%;

      > img {
        width: 1.175rem;
        height: 1.21rem;
        margin: 0.67rem auto 0.135rem auto;
        display: block;
      }

      p {
        width: 100%;
        text-align: center;
        font-size: 0.131rem;
        color: #888888;
      }

      .add-collection {
        width: 0.87rem;
        height: 0.27rem;
        border-radius: 0.133rem;
        border: solid 0.01rem #7abbfc;
        margin: 0.18rem auto 0 auto;
        font-size: 0.131rem;
        color: #87c1fc;
        line-height: 0.27rem;
        text-align: center;
      }
    }
  }
</style>
