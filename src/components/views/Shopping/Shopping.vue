<template>
  <div class="shopping">
<!--      今日精选-->
    <div class="feature">
      <div class="feature-title">
        <img src="../../../../static/shopping/yin.png">
        <img src="../../../../static/shopping/yin.png">
        <span>今日精选</span>
      </div>
      <div class="feature-scroll">
        <div class="feature-list">
          <div class="feature-item" v-for="(item, index) in featureList" :key="item.pid" @click="Jump(item)">
            <h2>{{item.pname}}</h2>
            <img :src="item.pimage">
          </div>
        </div>
      </div>
    </div>
<!--    为你推荐-->
    <div class="shop-recommend">
      <div class="recommend-title">
        <img src="../../../../static/shopping/yin.png">
        <img src="../../../../static/shopping/yin.png">
        <span>为你推荐</span>
      </div>
      <div class="shop-list van-clearfix">
        <div class="item-box" v-for="(item, index) in recommendList" :key="item.pid" @click="Jump(item)">
          <!--  左图右文-->
          <div class="img-left clearfix" v-if="item.isType==0 || item.isType==1 || item.isType==2">
            <img :src="item.pimage">
            <div class="goods-explain">
              <p>{{item.pname}}</p>
              <h3>原价: ¥ {{item.price}}</h3>
              <div class="after-price">领券后: ¥ {{item.afterPrice}}</div>
            </div>
            <div class="buy-btn">去抢购</div>
          </div>
          <!--  上图下文-->
          <div class="img-top" v-if="item.isType==3 || item.isType==4 || item.isType==5 || item.isType==6">
            <img :src="item.pimage">
            <div class="goods-explain">
              <p>{{item.pname}}</p>
              <h3>原价: ¥ {{item.price}}</h3>
            </div>
            <div class="after-price">领券后: ¥ {{item.afterPrice}}</div>
            <div class="buy-btn">去抢购</div>
          </div>
        </div>
      </div>
      <van-divider :style="{ color: '#666666', borderColor: '#999999', padding: '0 0.6rem' }" v-if="nodata">
        我们正在努力帮您整理新品
      </van-divider>
    </div>
  </div>
</template>

<script>
import bridge from "../../../js/bridge.js";
export default {
  data: () => ({
    token:"",
    featureList: [],
    recommendList:[],
    page: 1,
    isType:0,
    nodata: false,
    flag: true
  }),
  watch: {
    $route(to, from) {
      window.removeEventListener("scroll", this.onScroll);
    }
  },
  created() {
    this.token = this.$token;
    if (this.$route.query.browser) {
      this.$header = true;
      localStorage.setItem("Browser", true);
    };
    //1今日精选 2 为你推荐 初始化数据
    this.getList(1,3,1);
    this.getList(2,5,this.page);
    window.addEventListener("scroll", this.onScroll);
  },
  methods: {
    onScroll() {
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      var windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      var scrollHeight =
        document.querySelector(".shopping").scrollHeight +
        document.querySelector("#app").scrollHeight;
      if (scrollTop + windowHeight >= scrollHeight - 100) {
        if (this.flag) {
          this.getList(2,5,this.page);
        }
      }
    },
    // 获取商品列表
    getList(productCategory, pageSize, page) {
      if(this.nodata){
        return;
      }
      this.flag = false;
      this.$http.get("product/getProductByTypeId/" + page, {
        params: {
          pageSize: pageSize,
          productCategory: productCategory
        }
      }).then((res)=>{
        this.flag = true;
        var that = this;
        if(productCategory == 1){
          this.featureList = res.data.extend.products;
        } else if(productCategory == 2) {
          if(res.data.extend.products.length==0){
            this.nodata = true;
            return;
          }
          res.data.extend.products.forEach(function (item,index) {
            item.isType = that.isType;
            that.isType ++;
            if (that.isType == 7) {
              that.isType = 0;
            }
          })
          this.recommendList = this.recommendList.concat(res.data.extend.products);
          this.page++;
        }
      }).catch((err)=>{
        this.flag = true;
      })
    },
    // 商品跳转
    Jump(item) {
      if (item.purl == "###") {
        return;
      } else {
        if (this.$header) {
          window.open(item.purl);
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
.shopping {
  position: absolute;
  top: 0.1rem;
  width: 100%;
  .feature{
    box-sizing: border-box;
    padding: 0 0 0 0.12rem;
    width: 100%;
    margin-bottom: 0.22rem;
    .feature-title{
      margin-bottom: 0.1rem;
      >img{
        display: inline-block;
        width: 0.05rem;
        height: 0.085rem;
        float: left;
        padding-top: 0.03rem;
        margin-right: 0.02rem;
      }
      >span{
        font-size: 0.17rem;
        font-weight: bold;
        color: #000000;
      }
    }
    .feature-scroll{
      width: 100%;
      overflow: hidden;
      overflow-x: scroll;
      -webkit-overflow-scrolling: touch;
      .feature-list{
        width: max-content;
        .feature-item{
          float: left;
          width: 3.025rem;
          margin-right: 0.26rem;
          >h2{
            font-size: 0.14rem;
            color: #333333;
            font-weight: bold;
            margin: 0.1rem 0;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
          }
          >img{
            display: block;
            width: 3.025rem;
            height: 1.605rem;
            border-radius: 0.05rem;
          }
        }
      }
    }
    .feature-scroll::-webkit-scrollbar {
      display: none;
    }
  }
  .shop-recommend{
    width: 100%;
    .recommend-title{
      box-sizing: border-box;
      padding: 0 0 0 0.12rem;
      >img{
        display: inline-block;
        width: 0.05rem;
        height: 0.085rem;
        float: left;
        padding-top: 0.03rem;
        margin-right: 0.02rem;
      }
      >span{
        font-size: 0.17rem;
        font-weight: bold;
        color: #000000;
      }
    }
    .shop-list{
      padding: 0.15rem 0.08rem 0.2rem 0.08rem;
      box-sizing: border-box;
      .item-box{
        float: left;
      }
      .img-left{
        background-color: #ffffff;
        box-shadow: 0rem 0.01rem 0.19rem 0rem
        rgba(48, 63, 78, 0.15);
        border-radius: 0.05rem;
        position: relative;
        margin: 0.24rem 0.14rem 0.1rem 0.14rem;
        >img{
          display: block;
          width: 0.875rem;
          height: 1rem;
          background-color: #000000;
          box-shadow: 0rem 0.01rem 0.035rem 0rem
          rgba(0, 0, 0, 0.1);
          border-radius: 0.05rem;
          float: left;
          margin: -0.2rem 0.15rem 0.15rem 0.15rem;
        }
        .goods-explain{
          float: left;
          >p{
            font-size: 0.13rem;
            font-weight: normal;
            color: #000000;
            width: 1.945rem;
            margin: 0.1rem 0.19rem 0 0;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            min-height: 0.26rem;
          }
          >h3{
            font-size: 0.12rem;
            font-weight: normal;
            color: #666666;
            margin: 0.06rem 0 0 0;
            float: left;
          }
          .after-price{
            float: right;
            margin: 0.04rem 0.195rem 0.02rem 0;
            font-size: 0.16rem;
            font-weight: normal;
            color: #cda356;
          }
        }
        .buy-btn{
          position: absolute;
          right: 0;
          bottom: 0;
          width: 0.65rem;
          height: 0.235rem;
          background: transparent;
          background: url("../../../../static/shopping/btn-bg.png") no-repeat center center;
          font-size: 0.12rem;
          font-weight: normal;
          text-align: center;
          line-height: 0.235rem;
          background-size: contain;
          color: #966d24;
        }
      }
      .img-top{
        float: left;
        width: 1.615rem;
        background-color: #ffffff;
        box-shadow: 0rem 0.01rem 0.19rem 0rem
        rgba(48, 63, 78, 0.15);
        border-radius: 0.05rem;
        overflow: hidden;
        position: relative;
        margin: 0.08rem 0.09rem;
        >img{
          width: 1.615rem;
          height: 1.15rem;
          display: block;
          box-shadow: 0rem 0.01rem 0.035rem 0rem
          rgba(0, 0, 0, 0.1);
          border-radius: 0.05rem 0.05rem 0rem 0rem;
        }
        .goods-explain{
          padding: 0.09rem 0.1rem 0 0.1rem;
          >p{
            font-size: 0.13rem;
            font-weight: normal;
            color: #000000;
            margin:0 0 0.06rem 0;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
          >h3{
            font-size: 0.12rem;
            font-weight: normal;
            color: #666666;
            margin:0;
          }
        }
        .after-price{
          font-size: 0.16rem;
          font-weight: normal;
          text-align: right;
          color: #cda356;
          margin: 0.09rem 0.1rem 0.06rem 0;
        }
        .buy-btn{
          float: right;
          width: 0.65rem;
          height: 0.235rem;
          background: transparent;
          background: url("../../../../static/shopping/btn-bg.png") no-repeat center center;
          font-size: 0.12rem;
          font-weight: normal;
          text-align: center;
          line-height: 0.235rem;
          background-size: contain;
          color: #966d24;
        }
      }
    }
  }
}
</style>
