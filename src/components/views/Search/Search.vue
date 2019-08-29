<template>
  <div class="search-interface">
    <!-- 搜索框 -->
    <form
      action="/"
      class="formD clearfix"
      :style="isShowBackIcon?'padding-left:0;width:100%':'padding-left:4%;width:96%'"
    >
      <img
        class="arrow-f"
        v-if="isShowBackIcon"
        src="../../../../static/android/back_button.png"
        alt
        @click="onCancel"
      />
      <van-search
        v-model="inputValue"
        :placeholder="placeholder"
        show-action
        shape="round"
        @search="onSearch"
        @clear="searchClear"
      >
        <div slot="action" @click="onSearch" class="search">搜索</div>
      </van-search>
    </form>

    <div class="s-hidden">
      <!-- 历史搜索 -->
      <div class="host-search clearfix">
        <div class="host-font" v-if="historyList.length !== 0">历史搜索</div>
        <div class="host-img" v-if="historyList.length !== 0" @click="searchDelete">
          <img src="../../../../static/HM-search/delete.png" alt />
        </div>
      </div>
      <!-- 列表 -->
      <div class="shopping-list clearfix" v-show="searchImg">
        <div v-for="(item, index) in historyList" :key="index" @click="getValue(item)">
          <span>{{ item }}</span>
        </div>
      </div>
      <!-- 隐藏列表显示 -->
      <div class="host-none" v-show="!searchImg">当前历史搜索已隐藏</div>
      <!-- 热门搜索 -->
      <div class="hosts-search host-search clearfix">
        <div class="host-font">热门搜索</div>
      </div>
      <!-- 列表 -->
      <div class="shopping-list shopping-lists shopping-list-border clearfix">
        <div v-for="(item, index) in hostValse" :key="index" @click="getValue(item)">
          <span>{{ item }}</span>
        </div>
      </div>
      <!-- 预搜索 -->
      <div class="preview-box clearfix">
        <div v-for="(item, index) in previewList" :key="index" @click="getValue(item)">
          <span>{{item}}</span>
        </div>
      </div>
    </div>
    <!-- tab栏 -->
    <!-- <van-tabs v-model="active" @click="getTitle" ref="head" v-if="searchType">
      <van-tab title="文章"></van-tab>
      <van-tab title="视频"></van-tab>
    </van-tabs>-->
    <!-- 搜索列表 -->
    <div id="scroll-box" @scroll="onScroll" v-show="searchType" ref="scroll">
      <dietcommon
        class="dietcommon"
        ref="dietcommon"
        @searchEmpty="set"
        :bottomColumn="true"
        v-on:isloading="changeFlag"
        :style="searchEmptys? 'padding-top:0': 'padding-top:55px'"
      ></dietcommon>
      <!--    <button @click="goto">跳转</button>-->
      <div class="search-record search-record-top" v-if="searchEmptys">
        <div>
          <img
            style="width: 0.745rem;height: 1.005rem;text-align:center"
            src="../../../../static/HM-search/search-ico.jpg"
            alt
          />
          <span>亲~暂无内容哟</span>
        </div>
      </div>
    </div>
    <div class="search-record" v-if="historyList.length == 0">
      <div>
        <img src="../../../../static/HM-search/search-record.png" alt />
        <span>你还没有留下搜索记录哟</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog } from "vant";
import dietcommon from "@/components/common/Dietcommon.vue";
export default {
  components: {
    dietcommon
  },
  data: () => ({
    inputValue: "", // 搜索关键字
    placeholder: "大家都在搜：马甲线",
    hostValse: ["跑步", "腹肌", "脂肪", "减脂", "营养"], // 热门搜索
    previewList: [
      "3个动作教你拥有马甲线",
      "有关减肥的5个错误",
      "关于深蹲的2个知识点",
      "瘦腰平腹，仅用这5招",
      "懒人最快减肥方法",
      "4个动作纠正不良腿型"
    ], // 预搜索
    searchImg: true, // 眼睛
    active: 0, // tab栏选中
    searchType: false,
    flag: true,
    historyList: [], // 搜索历史列表
    searchEmptys: false, // 未搜索到数据
    isShowBackIcon: true
  }),
  watch: {
    inputValue(val, newVal) {
      this.inputValue = val;
      this.$refs.dietcommon.articlePage = 1;
      this.$refs.dietcommon.articleFlag = false;
      this.$refs.dietcommon.videoPage = 1;
      if (this.inputValue == "") {
        this.searchEmptys = false;
        this.searchType = false;
      }
      this.$refs.dietcommon.artList = [];
      this.$refs.dietcommon.vartList = [];
      this.$refs.dietcommon.articleEnd = false;
      // this.$refs.dietcommon.getSearch(this.inputValue, this.active);
    }
  },
  // 销毁完成状态
  destroyed() {
    window.removeEventListener("scroll", this.onScroll);
  },
  created() {
    // 设置scroll高度
    // var h = document.documentElement.clientHeight || document.body.clientHeight;
    // setTimeout(() => {
    //   document.getElementById("scroll-box").style.height = h + "px";
    // }, 100);
    if (this.$route.query.value !== undefined) {
      this.isShowBackIcon = false;
    } else {
      this.isShowBackIcon = true;
    }
    localStorage.setItem("myActive", this.active);
    // this.active = localStorage.getItem("myActive");
    window.addEventListener("scroll", this.onScroll);

    if (localStorage.getItem("searchValue")) {
      this.historyList = JSON.parse(localStorage.getItem("searchValue"));
    }
  },
  methods: {
    changeFlag: function(flag) {
      this.flag = flag;
    },
    set(data) {
      this.searchEmptys = data;
    },
    onScroll() {
      var scrollTop = document.querySelector("#scroll-box").scrollTop;
      var windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      var scrollHeight = document.querySelector(".dietcommon").scrollHeight;
      if (scrollTop + windowHeight >= scrollHeight - 100) {
        if (this.inputValue !== "" && this.active !== "") {
          if (this.flag) {
            this.$refs.dietcommon.getSearch(this.inputValue, this.active);
          }
        }
      }
    },
    retu() {
      history.back();
    },
    // 搜索
    onSearch() {
      sessionStorage.removeItem("searchPage");
      this.$refs.dietcommon.searchPage = [];
      this.$refs.dietcommon.searchFlag = false;

      if (this.inputValue == "") {
        // 大家都在搜
        if (this.placeholder.indexOf("大家都在搜：") !== -1) {
          this.inputValue = this.placeholder.substring(6);
        }
      }
      this.$refs.dietcommon.getSearch(this.inputValue, this.active, 1);
      this.searchType = true;
      // 获取搜索关键字
      var search = this.inputValue;
      // 取出本地的历史
      if (localStorage.getItem("searchValue")) {
        this.historyList = JSON.parse(localStorage.getItem("searchValue"));
        if (this.historyList.indexOf(search) == -1) {
          // 把关键字添加到第一个
          this.historyList.unshift(search);
        }
        if (this.historyList.length >= 10) {
          this.historyList.splice(9);
        }
        // 存到本地
        localStorage.setItem("searchValue", JSON.stringify(this.historyList));
      } else {
        this.historyList.unshift(search);
        localStorage.setItem("searchValue", JSON.stringify(this.historyList));
      }
    },
    searchClear() {
      this.searchType = false;
      this.searchEmptys = false;
    },
    // 返回
    onCancel() {
      if (this.searchType) {
        this.searchType = false;
        this.inputValue = "";
      } else {
        this.$router.go(-1);
      }

      this.searchEmptys = false; //隐藏搜索没有数据
    },
    // 删除历史记录
    searchDelete() {
      Dialog.confirm({
        message: "确定删除全部历史记录？"
      })
        .then(() => {
          localStorage.removeItem("searchValue");
          this.historyList = [];
        })
        .catch(() => {
          // on cancel
        });
    },
    // 搜索热门
    getValue(item) {
      sessionStorage.removeItem("searchPage");
      this.$refs.dietcommon.searchPage = [];
      this.$refs.dietcommon.searchFlag = false;

      this.active = 0;
      this.inputValue = item;
      this.searchType = true;
      this.$refs.dietcommon.getSearch(item, this.active, 2);
      // 获取搜索关键字
      var search = this.inputValue;
      // 取出本地的历史
      if (localStorage.getItem("searchValue")) {
        this.historyList = JSON.parse(localStorage.getItem("searchValue"));
        if (this.historyList.indexOf(search) == -1) {
          // 把关键字添加到第一个
          this.historyList.unshift(search);
        }
        if (this.historyList.length >= 10) {
          this.historyList.splice(9);
        }
        // 存到本地
        localStorage.setItem("searchValue", JSON.stringify(this.historyList));
      } else {
        this.historyList.unshift(search);
        localStorage.setItem("searchValue", JSON.stringify(this.historyList));
      }
    },
    // tab栏
    getTitle(index, title) {
      this.active = index;
      localStorage.setItem("myActive", this.active);
      this.active = localStorage.getItem("myActive");
      this.$refs.dietcommon.getSearch(this.inputValue, this.active);
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$route.query.value !== undefined) {
        this.inputValue = this.$route.query.value;
        this.onSearch();
      }
    });
  }
};
</script>

<style lang="less" >
// 清除浮动
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
#scroll-box {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 98;
  height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch; /* 解决ios滑动不流畅问题 */
}
.dietcommon {
  /*position: absolute;*/
  /*top: 55px;*/
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  /*overflow-y: scroll;*/
  /*-webkit-overflow-scrolling: touch;!* 解决ios滑动不流畅问题 *!*/
}
.search-interface {
  box-sizing: border-box;
  position: absolute;
  top: 0px;
  box-sizing: border-box;
  background-color: #f7f8f9;
  height: 100%;
  width: 100%;
  overflow: hidden;
  z-index: 97;
  // 搜索框
  .formD {
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 99;
    background-color: #ffffff;
    .search {
      color: #2290ff;
    }
    .van-search__content {
      color: #ddedff;
      background-color: #ddedff;
      .van-icon-search {
        color: #9dccfc;
        font-size: 14px;
      }
    }
    ::-webkit-input-placeholder {
      color: #9dccfc;
    }
  }
  .arrow-f {
    display: inline-block;
    width: 20px;
    height: 20px;
    color: #9dccfc;
    float: left;
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    background-color: #ffffff;
    margin: 17px 10px;
  }
  .van-search {
    /*float: right;*/
    /*width: 95%;*/
    background-color: #ffffff;
    color: #9dccfc;
  }
  .van-field__control {
    color: #9dccfc;
  }
  .van-search--show-action {
    padding: 10px 0;
  }
  > .s-hidden {
    // 热门搜索
    > .host-search {
      margin-top: 60px;
      padding: 0 3%;
      > .host-font {
        float: left;
        font-size: 0.12rem;
        color: #666666;
      }
      > .host-img {
        float: right;
        width: 0.2rem;
        height: 0.2rem;
        > img {
          width: 100%;
          height: 100%;
        }
      }
    }
    > .hosts-search {
      margin-top: 0.1rem;
    }
    // 列表
    > .shopping-list-border {
      border-bottom: 1px solid #ddd;
    }
    > .shopping-list {
      margin: 0.185rem 0 0 0;
      padding: 0 5% 0.1rem 5%;
      > div {
        float: left;
        height: 0.305rem;
        font-size: 0.12rem;
        color: #666666;
        overflow: hidden;
        text-overflow: ellipsis; //超出部分以省略号显示
        white-space: nowrap;
        width: 33.333%; //用px单位亦可行
        > span {
          line-height: 0.305rem;
          font-size: 0.12rem;
          color: rgba(161, 157, 157, 1);
        }
      }
    }
    > .shopping-lists {
      > div {
        width: 0.5rem;
      }
    }
    // 预搜索
    > .preview-box {
      margin-top: 0.2rem;
      > div {
        > span {
          margin-top: 0.15rem;
          display: block;
          font-size: 0.12rem;
          color: rgba(161, 157, 157, 1);
          width: 50%;
          float: left;
          padding-left: 5%;
          box-sizing: border-box;
        }
      }
    }
    // 热门列表隐藏
    > .host-none {
      text-align: center;
      color: #6b6b6b;
      font-size: 0.13rem;
      margin-top: 0.1rem;
    }
  }

  // tab栏
  > .van-tabs {
    > .van-tabs__wrap {
      width: 3.75rem;
      position: fixed;
      left: 50%;
      top: 54px;
      transform: translate(-50%, 0%);
      > .van-tabs__nav {
        > .van-tabs__line {
          height: 0.02rem;
          margin: 0 auto !important;
          background-color: #409efc;
          border-radius: 0.008rem;
        }
        > .van-tab {
          color: #9ba5af;
          font-size: 0.12rem;
        }
        .van-tab--active {
          font-size: 0.14rem;
          font-weight: 550;
          color: #409efc;
          background: linear-gradient(90deg, #409efc 0%, #409efc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }
  }
  // 暂无搜索内容
  .search-record {
    > div {
      position: absolute;
      top: 60%;
      left: 50%;
      transform: translate(-50%, -50%);
      > img {
        width: 1.455rem;
        height: 0.97rem;
      }
      > span {
        display: block;
        font-size: 0.14rem;
        color: #888888;
      }
    }
  }
  .search-record-top {
    > div {
      top: 50%;
    }
  }
}
</style>
