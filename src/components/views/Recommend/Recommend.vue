<template>
  <div>
      <div class="recommend">
        <img src alt class="refreshImg" />
        <div
          class="recommends"
          @touchstart="$touchstart($event, 'recommends')"
          @touchmove="$touchmove($event, 'recommends')"
          @touchend="$touchend($event, 'recommends')"
        >
          <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh" class="vanpull"> -->
          <!-- 轮播图 -->
          <div class="refresh-box" v-if="refreshNumbaerFlag">已为您更新{{refreshNumber}}条文章</div>
          <banner :images="images" v-if="banner"></banner>
          <!--        <button @click="getUser">获取用户信息</button>-->
          <!--        <button @click="getUsers">重新授权</button>-->
          <!-- 精选 -->
          <featured></featured>
          <div id="wy">
            <!-- <h1 @click="imagePreview">11111111111</h1> -->
          </div>
          <div
            class="indexcontent"
            v-for="(item, index) in artList"
            :key="index"
            v-if="item.advertisementId !== 4"
          >

            <v-touch @swipeleft="handleSwipeLeft"
                     @swiperight="handleSwiperight">
            <!-- 置顶-->
            <div class="authorArticle top" v-if="item.isTop" @click="goArticleInfo(item)">
              <div class="img-one">
                <div class="authorTitle" :id="'color'+item.id">{{ item.title }}</div>
                <div class="authorBox clearfix">
                  <div class="top-tag">置顶</div>
                  <div class="authorName">{{ item.authorName }}</div>
                  <div class="authorTime">{{ item.createTime }}</div>
                </div>
              </div>
            </div>
            <!-- 一张图 -->
            <div class="authorArticle" v-if="item.isType == 0" @click="goArticleInfo(item)">
              <div class="img-one" v-if="item.images != null">
                <div class="authorTitle" :id="'color'+item.id">{{ item.title }}</div>
                <img
                  class="authorOneImg"
                  :src="
                item.images[0] +
                  '?x-oss-process=image/resize,m_fill,w_528,h_230'
              "
                  alt
                  v-lazy="
                item.images[0] +
                  '?x-oss-process=image/resize,m_fill,w_528,h_230'
              "
                />
                <div class="authorBox clearfix">
                  <div class="authorName">{{ item.authorName }}</div>
                  <div class="authorTime">{{ item.createTime }}</div>
                  <img
                    class="authorDelete"
                    src="../../../../static/android/delete.png"
                    alt
                    @click.stop="deleteLike(item,index, 0)"
                  />
                </div>
              </div>
            </div>
            <!-- 新闻图片 -->
            <div class="authorArticle" v-if="item.isType == 5" @click="goArticleInfo(item)">
              <div class="img-one" v-if="item.images != null">
                <div class="authorTitle" :id="'color'+item.id">{{ item.title }}</div>
                <img
                  class="authorOneImg"
                  :src="
                item.images[0] +
                  '?x-oss-process=image/resize,m_fill,w_528,h_230'
              "
                  alt
                  v-lazy="
                item.images[0] +
                  '?x-oss-process=image/resize,m_fill,w_528,h_230'
              "
                />
                <div class="authorBox clearfix">
                  <div class="authorName">{{ item.authorName }}</div>
                  <div class="authorTime">{{ item.createTime }}</div>
                  <img
                    class="authorDelete"
                    src="../../../../static/android/delete.png"
                    alt
                    @click.stop="deleteLike(item,index, 0)"
                  />
                </div>
              </div>
            </div>

            <!-- 三张图 -->
            <div
              class="authorArticle"
              v-if="item.isType == 1 || item.isType == 2"
              @click="goArticleInfo(item)"
            >
              <div class="img-three" v-if="item.images != null">
                <div class="authorTitle" :id="'color'+item.id">{{ item.title }}</div>
                <div class="authorImg">
                  <img
                    :src="
                  item.images[0] + '?x-oss-process=image/resize,m_fill,w_254'
                "
                    alt
                    v-lazy="
                  item.images[0] + '?x-oss-process=image/resize,m_fill,w_254'
                "
                  />
                  <img
                    :src="
                  item.images[1] + '?x-oss-process=image/resize,m_fill,w_254'
                "
                    alt
                    v-lazy="
                  item.images[1] + '?x-oss-process=image/resize,m_fill,w_254'
                "
                  />
                  <img
                    :src="
                  item.images[2] + '?x-oss-process=image/resize,m_fill,w_254'
                "
                    alt
                    v-lazy="
                  item.images[2] + '?x-oss-process=image/resize,m_fill,w_254'
                "
                  />
                </div>
                <div class="authorBox clearfix">
                  <div class="authorName">{{ item.authorName }}</div>
                  <div class="authorTime">{{ item.createTime }}</div>
                  <img
                    class="authorDelete"
                    src="../../../../static/android/delete.png"
                    alt
                    @click.stop="deleteLike(item, index,0)"
                  />
                </div>
              </div>
            </div>

            <!-- 左图右文 -->
            <div class="authorArticle" v-if="item.isType == 6" @click="goArticleInfo(item)">
              <div class="img-left" v-if="item.images != null">
                <div class="authorImg">
                  <img
                    :src="
                  item.images[0] +
                    '?x-oss-process=image/resize,m_fill,h_140,w_282'
                "
                    alt
                    v-lazy="
                  item.images[0] +
                    '?x-oss-process=image/resize,m_fill,h_140,w_282'
                "
                  />
                  <div class="authorFont" :id="'color'+item.id">{{ item.title }}</div>
                </div>
                <div class="authorBox clearfix">
                  <div class="authorName">{{ item.authorName }}</div>
                  <div class="authorTime">{{ item.createTime }}</div>
                  <img
                    class="authorDelete"
                    src="../../../../static/android/delete.png"
                    alt
                    @click.stop="deleteLike(item, index,0)"
                  />
                </div>
              </div>
            </div>

            <!-- 左文右图 -->
            <div
              class="authorArticle"
              v-if="item.isType == 3 || item.isType == 4"
              @click="goArticleInfo(item)"
            >
              <div class="img-right" v-if="item.images != null">
                <div class="authorImg clearfix">
                  <div class="author-left">
                    <div class="authorFont" :id="'color'+item.id">{{ item.title}}</div>
                  </div>
                  <img
                    class="author-img"
                    :src="
                  item.images[0] +
                    '?x-oss-process=image/resize,m_fill,h_140,w_282'
                "
                    alt
                    v-lazy="
                  item.images[0] +
                    '?x-oss-process=image/resize,m_fill,h_140,w_282'
                "
                  />
                  <div class="authorBox clearfix">
                    <div class="authorName">{{ item.authorName }}</div>
                    <div class="authorTime">{{ item.createTime }}</div>
                  </div>
                  <div class="authorDelete" @click.stop="deleteLike(item, index,0)">
                    <img src="../../../../static/android/delete.png" alt />
                  </div>
                </div>
              </div>
            </div>

            <!-- v-if="item.image != null && item.clicks == 0" -->

            <!-- 图片广告 -->
            <div class="authorArticle" @click="Jump(item)" v-if="item.Aid">
              <div class="aclass" :id="item.Aid"></div>
            </div>
            <div class="authorArticle" @click="Jump(item)" v-if="item.Sid">
              <div class="aclass" :id="item.Sid"></div>
            </div>
            <div class="authorArticle" v-if="item.Wid">
              <div class="aclass" :id="item.Wid"></div>
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
                  src="../../../../static/video-info/playing.png"
                  class="cover"
                  @click.stop="playVideo(index)"
                  alt
                />
                <div class="authorBox clearfix" @click="goVideoInfo(item)">
                  <div class="authorName">{{ item.authorName }}</div>
                  <div class="authorTime">{{ item.createTime.substr(0, 10) }}</div>
                  <img
                    class="authorDelete"
                    src="../../../../static/android/delete.png"
                    alt
                    @click.stop="deleteLike(item,index, 1)"
                  />
                </div>
              </div>
            </div>
            <!-- 视频广告 -->
            <div class="authorArticle clearfix" v-if="item.advertisementId == 1 && item.tag == '广告'">
              <div class="authorVideoBox clearfix">
                <div
                  class="authorTitle"
                  @click="goVideoInfo(item)"
                  :id="'color'+item.id"
                >{{ item.title }}</div>
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
                  src="../../../../static/video-info/playing.png"
                  class="cover"
                  @click.stop="playVideo(index)"
                  alt
                />
              </div>
            </div>

            </v-touch>
            <!-- 话题 -->
            <div class="authorArticle clearfix" v-if="item.isTopic">
              <Topic></Topic>
            </div>
            <!--  商品-->
            <div class="authorArticle clearfix products-box" v-if="item.isProduct">
              <h2>< 热门单品 ></h2>
              <van-swipe :autoplay="3000" :show-indicators="false">
                <van-swipe-item
                  v-for="(item2, index2) in item.products"
                  :key="index2"
                  @click="Jump(item2)"
                >
                  <img
                    :src="item2.pimage+'?x-oss-process=image/resize,m_fill,w_528,h_170'"
                    v-lazy="item2.pimage"
                  />
                  <div class="products-bg"></div>
                  <div class="products-details">
                    <p>{{item2.pname}}</p>
                  </div>
                </van-swipe-item>
              </van-swipe>
            </div>
            <!--      作者卡片-->
            <div class="authorArticle clearfix" v-if="item.isRecommend">
              <RecommendAuthor></RecommendAuthor>
            </div>
          </div>

          <!-- 没有更多的数据显示 -->
          <div class="no-follow" v-if="articleFlag" :style="this.lineFlag ? 'color: #dddddd' : ''">
            <span>{{ noDataShow }}</span>
            <div
              class="bottom-line"
              v-if="lineFlag"
              :style="this.lineFlag ? 'background: #dddddd' : ''"
            ></div>
          </div>
          <!-- </van-pull-refresh> -->
        </div>
        <!-- 刷新按钮 -->
        <div class="refresh-bottom" v-if="refreshBottomFlag" @click.stop="refreshBottom">
          <img src="../../../../static/recommend/refresh.png" alt />
        </div>
        <!--      保存滚动条位置-->
        <input v-model="scrollTop" style="display: none" />
      </div>
  </div>
</template>

<script>
import { Dialog, Toast } from "vant";
import banner from "@/components/common/Banner/Banner.vue";
import bridge from "../../../js/bridge.js";
import Featured from "../../common/featured/featured";
import RecommendAuthor from "../../common/RecommendAuthor/RecommendAuthor";
import Topic from "../../common/Topic/Topic";

export default {
  name: "Recommend",
  components: {
    Topic,
    RecommendAuthor,
    Featured,
    banner
  },
  data: () => ({
    isLoading: false,
    artList: [], // 文章列表
    images: [], // 轮播图
    banner: true, // 轮播图显示
    token: "",
    scorller: {
      page: 1,
      noDataText: ""
    },
    videoMax: 0, //视频播放最大完成度
    videoMaxNumber: 0,
    token: "",
    timestamp: "", //当前视频的时间戳
    videoElementId: "", //元素ID
    videoTopId: "", //上一个视频的id
    flag: true, // 节流阀
    aSogou: 408162354, //搜狗广告
    aBaidu: 123223132, //百度广告
    aWanglai: 987231, //往来广告
    end: false, //加载完毕
    articleFlag: false, //暂无更多数据
    noDataShow: "暂无内容呢~",
    element: "",
    refreshImg: "",
    startPos: 0,
    startXPos: 0,
    transitionHeight: 0,
    transitionWidth: 0,
    startTop: false,
    scrollTop: 0,
    lineFlag: false, //我是有底线的中间线条显示
    productsList: {}, //商品列表
    isType: 0,
    refreshNumber: 0, // 刷新数据的条数
    refreshNumbaerFlag: false, // 显示刷新数据条数
    refreshBottomFlag: false // 刷新按钮显示
  }),
  // 销毁完成状态
  // destroyed() {
  //   window.removeEventListener("scroll", this.onScroll);
  // },
  watch: {
    $route(to, from) {
      window.removeEventListener("scroll", this.onScroll);
      if (to.path == "/") {
        window.addEventListener("scroll", this.onScroll);
        document.documentElement.scrollTop = this.scrollTop;
        document.body.scrollTop = this.scrollTop;
        // if(localStorage.getItem('scrollTop0')){
        //   document.documentElement.scrollTop = localStorage.getItem('scrollTop0');
        // }
      }
    }
  },
  created() {
    this.token = this.$token;
    if (this.$route.query.browser) {
      this.$header = true;
      localStorage.setItem("Browser", true);
    }

    window.addEventListener("scroll", this.onScroll);
    // 获取初始化数据
    this.scorller.page = 1;
    this.getList();
    this.getProduct();
    // 获取轮播图
    this.getBanner();
  },
  // 页面销毁
  destroyed: function() {},
  methods: {
    handleSwipeLeft() {
      var active = parseInt(localStorage.getItem('active'));
      var path = JSON.parse(localStorage.getItem('columns'));
      this.$router.push({
        path: path[active + 1],
        query: {
          token: this.token
        }
      });
    },
    handleSwiperight() {
      var active = parseInt(localStorage.getItem('active'));
      var path = JSON.parse(localStorage.getItem('columns'));
      this.$router.push({
        path: path[active - 1],
        query: {
          token: this.token
        }
      });
    },
    imagePreview() {
      this.$router.push({
        path: "/WeekCalendar"
      });
    },
    pageOne() {
      this.$pageOne("recommends");
    },
    onScroll() {
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      var windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      var scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      // localStorage.setItem('scrollTop0',scrollTop)
      this.scrollTop = scrollTop;
      if (scrollTop + windowHeight >= scrollHeight - 100) {
        if (this.flag) {
          this.flag = false;
          this.scorller.page++;
          this.getMoresList();
        }
      }
      // 显示刷新按钮
      if (scrollTop > windowHeight) {
        this.refreshBottomFlag = true;
      } else {
        this.refreshBottomFlag = false;
      }
    },
    getProduct() {
      this.$http
        .get("product/getProductByTypeId/1", {
          params: {
            // token: this.$token,
            productCategory: 4
          }
        })
        .then(res => {
          this.productsList = res.data.extend;
        });
    },
    // 获取初始化数据
    getList() {
      var that = this;
      this.articleFlag = false;
      if (this.end) {
        this.scorller.page = 1;
        this.end = false;
      }
      this.$http
        .get("recommend/getIndexList/" + this.scorller.page, {
          params: {
            token: this.$token,
            isRefresh: 1
          }
        })
        .then(res => {
          var newsList1 = res.data.extend.list;
          this.refreshNumber = newsList1.length;
          if (newsList1.length == 0) {
            this.articleFlag = true;
          }
          // if (newsList1.length < 5) {
          //   this.aBaidu++;
          //   var lists = { Sid: "s" + this.aBaidu };
          //   newsList1.splice(1, 0, lists);
          //   this.artList = this.artList.concat(newsList1);
          //   setTimeout(() => {
          //     var sogou_div = document.getElementById("s" + this.aBaidu);
          //     window.sogou_un = window.sogou_un || [];
          //     window.sogou_un.push({ id: "1043179", ele: sogou_div });
          //   }, 100);
          // } else {
          // this.aSogou++;
          // var list = { Aid: "a" + this.aSogou };
          // newsList1.splice(5, 0, list);
          // this.aBaidu++;
          // var lists = { Sid: "s" + this.aBaidu };
          // newsList1.splice(12, 0, lists);
          // this.aWanglai++;
          // var lists = { Wid: "w" + this.aWanglai };
          // newsList1.splice(1, 0, lists);
          // this.artList = this.artList.concat(newsList1);

          // setTimeout(() => {
          //   console.log(wlwh);
          //   wlwh.appendBox({
          //     boxId: "w" + this.aWanglai,
          //     appId: "123123123",
          //     appSecret: "123123213"
          //   });
          // }, 100);
          newsList1.forEach(function(item, index) {
            if (!item.isTop) {
              if (item.Wid) {
                return;
              }
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
            }
          });
          this.artList = newsList1;
          this.productsList.isProduct = true;
          this.artList.splice(3, 0, { isTopic: true });
          this.artList.splice(6, 0, this.productsList);
          this.artList.splice(10, 0, { isRecommend: true });
          this.flag = true;
          // setTimeout(() => {
          //   (window.slotbydup = window.slotbydup || []).push({
          //     id: "u4081654",
          //     container: "a" + this.aSogou,
          //     isAsync: true
          //   });
          //   var sogou_div = document.getElementById("s" + this.aBaidu);
          //   window.sogou_un = window.sogou_un || [];
          //   window.sogou_un.push({ id: "1043179", ele: sogou_div });
          // }, 100);
          // }
          this.refreshNumbaerFlag = true;
          setTimeout(() => {
            this.refreshNumbaerFlag = false;
          }, 2000);
        }).catch((err)=>{
        this.flag = true;
      });
    },
    // 跳转文章详情页
    goArticleInfo(item) {
      // 设置看过的文章颜色
      document.querySelector("#color" + item.id).style = "color: gray";
      if (item.type == 5) {
        this.$router.push({
          path: "/imagePreview",
          query: { id: item.id, token: this.token, authorId: item.authorId }
        });
        return;
      }
      if (!item.id) {
        item.id = item.pid;
      }
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
            this.$httpUrl + "articleInfo?id=" + item.id + "&token=" + this.token
        };
        bridge.callhandler(name, data, function(response) {});
      }
    },
    // 刷新按钮
    refreshBottom() {
      this.pageOne();
    },
    // 跳转视频详情页
    goVideoInfo(item) {
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
    // 商品跳转
    Jump(item) {
      if (item.purl == "###") {
        return;
      } else {
        if (this.$header) {
          var url = {
            url: item.purl
          };
          localStorage.setItem("goUrl", JSON.stringify(url));
          this.$router.push({
            path: "/iframe"
          });
        } else {
          if (item.purl.search(this.$httpUrl) != -1) {
            var name = "duoruiapp_openInAppUrl";
            var data = {
              title: "多锐",
              url: item.purl + "&token=" + this.token
            };
            bridge.callhandler(name, data, function(response) {});
          } else {
            var name = "duoruiapp_openOutAppUrl";
            var data = {
              url: item.purl
            };
            bridge.callhandler(name, data, function(response) {});
          }
        }
      }
    },
    // 广告跳转
    // Jump(item) {
    //   // 广告点击统计
    //   this.$http
    //     .get("statistics/clicksStatistics", {
    //       params: { type: 7, id: item.id, token: this.token }
    //     })
    //     .then(res => {});
    //   if (item.url == "###") {
    //     return;
    //   } else {
    //     var url = {
    //       url: item.url
    //     };
    //     localStorage.setItem("goUrl", JSON.stringify(url));
    //     this.$router.push({
    //       path: "/iframe"
    //     });
    //   }
    // },
    // 加载更多
    getMoresList() {
      var that = this;
      localStorage.setItem("start", false);
      this.$http
        .get("recommend/getIndexList/" + this.scorller.page, {
          params: {
            token: this.token,
            isRefresh: 0
          }
        })
        .then(res => {
          var recomList = res.data.extend.list;
          if (recomList.length == 0) {
            this.lineFlag = true;
            this.noDataShow = "我是有底线的";
            this.articleFlag = true;
            this.end = true;
            return;
          }
          recomList.forEach(function(item, index) {
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
          // if (recomList.length < 5) {
          //   this.aBaidu++;
          //   var lists = { Sid: "s" + this.aBaidu };
          //   recomList.splice(1, 0, lists);
          //   this.artList = this.artList.concat(recomList);
          //   setTimeout(() => {
          //     var sogou_div = document.getElementById("s" + this.aBaidu);
          //     window.sogou_un = window.sogou_un || [];
          //     window.sogou_un.push({ id: "1043179", ele: sogou_div });
          //   }, 10);
          // } else {
          // this.aSogou++;
          // var list = { Aid: "a" + this.aSogou };
          // recomList.splice(5, 0, list);
          // this.aBaidu++;
          // var lists = { Sid: "s" + this.aBaidu };
          // recomList.splice(12, 0, lists);
          this.artList = this.artList.concat(recomList);
          // this.aWanglai++;
          // var lists = { Wid: "w" + this.aWanglai };
          // recomList.splice(1, 0, lists);
          // this.artList = this.artList.concat(recomList);
          // // console.log(this.artList);

          // setTimeout(() => {
          //   console.log(wlwh);
          //   wlwh.appendBox({
          //     boxId: "w" + this.aWanglai,
          //     appId: "123123123",
          //     appSecret: "123123213"
          //   });
          // }, 100);
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
        }).catch((err)=>{
        this.flag = true;
      });
    },
    // 获取轮播图
    getBanner() {
      this.$http.get("werbungImage/getImage/" + 1).then(res => {
        if (res.data.extend.image.length == 0) {
          this.banner = false;
          return;
        }
        this.images = res.data.extend.image;
      });
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
                that.getMoresList();
              }
            });
        })
        .catch(() => {
          // on cancel
        });
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
    }
  }
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

.refreshImg {
  position: absolute;
  width: 0.5rem;
  left: 50%;
  margin-top: 0.3rem;
  transform: translate(-50%, -50%);
}
// 刷新数据
.refresh-box {
  position: relative;
  top: 0.1rem;
  width: 3.75rem;
  height: 0.2rem;
  background-color: #e4efff;
  text-align: center;
  font-size: 0.11rem;
  line-height: 0.2rem;
  color: #99bbed;
}

.recommend {
  > .recommends {
    .banner {
      padding: 0 4%;
    }

    .scroller {
      padding-top: 46px;
      box-sizing: border-box;
    }

    .indexcontent {
      margin: 0 4%;
      font-size: 0.17rem;

      .authorArticle {
        margin-top: 0.05rem;
        border-bottom: 1px solid #eeeeee;
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

        // 广告
        > .aclass {
          // width: 100%;
          // height: 2.2rem;
          // overflow: hidden;
          padding: 0 0.05rem;
          // border-bottom: 1px solid #eeeeee;
        }

        // 视频
        > .authorVideoBox {
          height: 2.25rem;
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

        .authorTitle {
          position: relative;
          // top: -0.03rem;
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
          position: relative;
          top: 6px;
          height: 0.26rem;

          .top-tag {
            float: left;
            margin-right: 0.05rem;
            font-size: 0.11rem;
            border-radius: 0.2em;
            color: #2290ff;
            line-height: 0.15rem;
          }

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
            padding: 0.05rem;
            position: relative;
            top: -0.05rem;
          }
        }
      }

      .top {
        border-bottom: 0;

        .authorBox {
          top: auto;
          bottom: 0;
          padding: 0.05rem 0;

          .top-tag {
            margin-bottom: 0.05rem;
          }
        }
      }

      .top:last-child {
        border-bottom: 1px solid #eeeeee;
      }

      > .products-box {
        height: 0.85rem;
        width: 100%;
        box-shadow: 0rem 0.01rem 0.045rem 0rem rgba(153, 153, 153, 0.35);
        border-radius: 0.05rem;
        overflow: hidden;
        position: relative;
        border-bottom: none;

        > h2 {
          width: 100%;
          text-align: center;
          font-size: 0.15rem;
          color: #000000;
          position: absolute;
          top: 0.095rem;
          left: 0;
          z-index: 11;
          margin: 0;
        }

        .products-bg {
          position: absolute;
          top: 0;
          left: 0;
          background: #ffffff;
          opacity: 0.5;
          width: 100%;
          height: 100%;
          z-index: 10;
        }

        .products-details {
          position: absolute;
          top: 0.38rem;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 11;

          p {
            padding: 0 0.135rem;
            font-size: 0.13rem;
            color: #000000;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-align: justify;
            margin: 0;
            text-indent: 0.26rem;
            line-height: 0.205rem;
          }
        }

        .van-swipe-item {
          height: 0.85rem;
          width: 100%;

          img {
            height: 0.85rem;
            width: 100%;
            border-radius: 0.05rem;
            overflow: hidden;
          }
        }
      }
    }
  }
  // 刷新按钮
  .refresh-bottom {
    position: fixed;
    bottom: 1.27rem;
    right: 0.145rem;
    width: 0.4rem;
    height: 0.4rem;
    background-color: #e3f1ff;
    border-radius: 50%;
    overflow: hidden;
    > img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
