<template>
  <div class="imagePreview">
    <div class="follow-box clearfix">
      <div class="clearfix" @click="AuthorDetails">
        <img class="back-img" @click.stop="back" src="../../../../static/android/back-gray.png" alt />
        <img v-if="imgagePreview.headImgUrl" :src="imgagePreview.headImgUrl" alt />
        <img class="header-img" v-else src="../../../../static/personal/header.png" alt />
        <div class="author">
          <span class="authorName">{{authorName}}</span>
          <span class="authorFans">{{createTime}}</span>
        </div>
      </div>
      <div
        class="follow-click"
        @click="follow"
        :style="isFollow?'background-color: #fff;color: #2290ff;':'background-color: #2290ff;color: #fff;'"
      >{{isFollow?'不再关注':'关注'}}</div>
    </div>
    <van-image-preview
      v-model="show"
      :images="images"
      :loop="false"
      :startPosition="startPosition"
      @close="close"
      @change="onImageChange"
    >
      <template v-slot:index v-if="false">第{{ index }}页</template>
    </van-image-preview>
    <van-swipe
      :show-indicators="false"
      :loop="false"
      :initial-swipe="initialSwipe"
      @change="onTitleChange"
      class="title-swipe"
    >
      <van-swipe-item
        v-for="(item, index) in imgagePreview"
        :key="index"
      >{{initialSwipe+1}}/{{imgagePreview.length}} {{item.explain}}</van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import bridge from "../../../js/bridge.js";
import { Toast } from "vant";

export default {
  data() {
    return {
      show: true, // 图片预览
      index: 0,
      startPosition: 0, // 图片索引
      initialSwipe: 0, // 文字索引
      imgagePreview: [], // 文章详情列表
      images: [], // 图片数组
      isFollow: "", //作者关注
      authorName: "", // 作者名称
      createTime: "" // 发布时间
    };
  },
  created() {
    var that = this;
    // window.onload = function() {
    // 获取文章详情
    that.getImagePreview();
    // 获取关注作者
    that.follows();
    // };
  },
  methods: {
    // 返回按钮
    back() {
      this.$router.back(-1);
    },
    // 跳转作者详情
    AuthorDetails() {
      if (this.$header) {
        this.$router.push({
          path: "/authorDetails",
          query: {
            id: this.imgagePreview[0].authorId,
            name: this.imgagePreview[0].authorName,
            img:
              this.imgagePreview[0].headImgUrl == null
                ? "https://articleimage.oss-cn-beijing.aliyuncs.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20190723144514.png"
                : this.imgagePreview[0].headImgUrl,
            token: this.token
          }
        });
      } else {
        var headImgUrl = this.imgagePreview[0].headImgUrl;
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
            this.imgagePreview[0].authorId +
            "&name=" +
            this.imgagePreview[0].authorName +
            "&img=" +
            headImgUrl +
            "&token=" +
            this.$route.query.token
        };
        bridge.callhandler(name, data, function(response) {});
      }
    },
    // 获取作者关注
    follows() {
      this.$http
        .get("token/isFollow", {
          params: {
            authorId: this.$route.query.authorId,
            state: 0,
            token: this.$route.query.token
          }
        })
        .then(res => {
          this.isFollow = res.data.extend.follow;
        });
    },
    // 关注作者
    follow() {
      this.$http
        .get("token/addOrRelease", {
          params: {
            token: this.$route.query.token,
            fellowId: this.$route.query.authorId
          }
        })
        .then(res => {
          this.isFollow = res.data.extend.isFollow;
          Toast(res.data.msg);
        });
    },
    // 获取文章详情
    getImagePreview() {
      this.$http
        .get("/article/getSlideArticleDetail", {
          params: { token: this.$route.query.token, id: this.$route.query.id }
        })
        .then(res => {
          this.imgagePreview = res.data.extend.article;
          this.authorName = this.imgagePreview[0].authorName;
          this.createTime = this.imgagePreview[0].createTime;
          this.imgagePreview.forEach(item => {
            this.images.push(item.image);
          });
        });
    },
    // 图片
    onImageChange(index) {
      setTimeout(() => {
        // 文字索引
        this.initialSwipe = index;
        // 图片索引
        this.startPosition = index;
      }, 300);
    },
    // 文字
    onTitleChange(index) {
      setTimeout(() => {
        // 文字索引
        this.initialSwipe = index;
        // 图片索引
        this.startPosition = index;
      }, 300);
    },
    close() {
      this.show = true;
    }
  }
};
</script>

<style lang="less">
// 清除浮动
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}

// 图片新闻
.imagePreview {
  background-color: #000;
  position: absolute;
  top: 0;
  min-height: 100%;
  // 文字title
  width: 3.75rem;
  // 隐藏页码
  > .van-image-preview {
    top: 0.4rem;
    > .van-image-preview__index {
      display: none !important;
    }
  }
  // 作者信息
  > .follow-box {
    position: fixed;
    top: 0;
    margin: auto auto;
    padding: 0.07rem 4% 0.04rem 4%;
    box-sizing: border-box;
    width: 100%;
    z-index: 99999;
    height: 0.555rem;
    > div {
      float: left;
      > .back-img {
        width: 0.09rem;
        height: 0.165rem;
        position: absolute;
        left: 4%;
        top: 0.09rem;
        padding: 0.1rem 0.1rem 0.1rem 0;
      }
      > .header-img {
        display: block;
        float: left;
        width: 0.4rem;
        height: 0.4rem;
        border-radius: 50%;
        overflow: hidden;
        margin-left: 0.22rem;
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
          color: #ffffff;
        }
        > .authorFans {
          font-size: 0.12rem;
          color: #ffffff;
          opacity: 0.6;
        }
      }
    }
    > .follow-click {
      margin-top: 0.07rem;
      width: 0.82rem;
      float: right;
      text-align: center;
      line-height: 0.26rem;
      font-size: 0.12rem;
      color: #2290ff;
      height: 0.26rem;
      background-color: #ffffff;
      box-shadow: 0rem 0.01rem 0.03rem 0rem rgba(153, 153, 153, 0.22);
      border-radius: 0.13rem;
      > span {
      }
    }
  }
  .title-swipe {
    width: 100%;
    z-index: 9999999;
    position: fixed;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
    .van-swipe-item {
      padding: 4%;
      box-sizing: border-box;
      font-size: 0.11rem;
      color: #fff;
    }
  }
}
</style>
