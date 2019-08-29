<template>
  <div class="IncomeRecord">
    <div class="IncomeRecord-bgc">
      <div class="Total_gold_coin">
        <div class="Total_gold_coin_money">
          <span>¥</span>1200
        </div>
        <div class="Total_gold_coin_jin">总金币</div>
      </div>
      <div class="Total_gold_coin_bottom">
        <div>
          <div class="Profit_top">
            <div>
              <span>+</span>100
            </div>
          </div>
          <div class="Profit_bottom">
            <div>今日收益</div>
          </div>
        </div>
        <div>
          <div class="Profit_top">
            <div>30</div>
          </div>
          <div class="Profit_bottom">
            <div>阅读时长(分钟)</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 过去7天金币收益 -->
    <div class="Record_title">过去7天金币收益</div>
    <!-- 图表 -->
    <div class="Chart"></div>
    <!-- 任务 -->
    <div class="task_box">
      <div class="box">
        <div class="box_top">
          <img src="../../../../static/IncomeRecord/Sign-in.png" alt />
          <span>签到收益</span>
        </div>
        <div class="box_bottom">
          <div>
            <span>+</span>270
          </div>
        </div>
      </div>
      <div class="box">
        <div class="box_top">
          <img src="../../../../static/IncomeRecord/Read.png" alt />
          <span>阅读收益</span>
        </div>
        <div class="box_bottom">
          <div>
            <span>+</span>500
          </div>
        </div>
      </div>
      <div class="box">
        <div class="box_top">
          <img src="../../../../static/IncomeRecord/task.png" alt />
          <span>任务收益</span>
        </div>
        <div class="box_bottom">
          <div>
            <span>+</span>50
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bridge from "@/js/bridge.js";
export default {
  name: "IncomeRecord",
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>

<style scoped lang="less">
.IncomeRecord {
  position: absolute;
  top: 0;
  width: 3.75rem;
  > .IncomeRecord-bgc {
    width: 100%;
    height: 3rem;
    background: url("../../../../static/IncomeRecord/bgc.png") no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    color: #ffffff;
    > .Total_gold_coin {
      margin-top: 0.585rem;
      text-align: center;
      > .Total_gold_coin_money {
        font-size: 0.425rem;
        font-weight: normal;
        font-stretch: normal;
        > span {
          font-size: 0.16rem;
        }
      }
      > .Total_gold_coin_jin {
        font-size: 0.13rem;
      }
    }
    > .Total_gold_coin_bottom {
      display: flex;
      text-align: center;
      margin-top: 0.2rem;
      > div {
        flex: 1;
        > .Profit_top {
          > div {
            font-size: 0.25rem;
            font-weight: normal;
            font-stretch: normal;
            > span {
              font-size: 0.16rem;
              font-weight: normal;
              font-stretch: normal;
              color: #ffffff;
            }
          }
        }
        > .Profit_bottom {
          font-size: 0.12rem;
        }
      }
    }
  }
  // 过去7天金币收益
  > .Record_title {
    margin-top: 0.195rem;
    padding: 0 0.115rem;
    font-size: 0.15rem;
    font-weight: bold;
    font-stretch: normal;
    letter-spacing: 0rem;
    color: #333333;
  }
  // 图表
  > .Chart {
    margin: 0.145rem 0.115rem 0 0.115rem;
    height: 1.4rem;
    background-color: #fee1db;
  }
  // 任务
  > .task_box {
    display: flex;
    padding: 0 0.125rem;
    margin-top: 0.28rem;
    > .box {
      flex: 1;
      width: 1.1rem;
      height: 0.625rem;
      box-shadow: 0rem 0.04rem 0.083rem 0.007rem rgba(172, 172, 172, 0.46);
      border-radius: 0rem 0.1rem 0.1rem 0.1rem;
      background-size: 100% 100%;
      overflow: hidden;
      color: #ffffff;
      > .box_top {
        padding: 0 0.1rem;
        > img {
          vertical-align: middle;
        }
        > span {
          font-size: 0.12rem;
          color: #ffffff;
        }
      }
      > .box_bottom {
        margin-top: 0.03rem;
        text-align: center;
        font-size: 0.225rem;
        font-weight: normal;
        font-stretch: normal;
        color: #ffffff;
        > div {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          > span {
            position: relative;
            top: -0.02rem;
          }
        }
      }
    }
    > div:nth-child(1) {
      background: url("../../../../static/IncomeRecord/bgc-orange.png")
        no-repeat;
      > .box_top {
        > img {
          width: 0.14rem;
          height: 0.14rem;
        }
      }
    }
    > div:nth-child(2) {
      margin: 0 0.1rem;
      background: url("../../../../static/IncomeRecord/bgc-blue.png") no-repeat;
      > .box_top {
        > img {
          width: 0.14rem;
          height: 0.11rem;
        }
      }
    }
    > div:nth-child(3) {
      background: url("../../../../static/IncomeRecord/bgc-brown.png") no-repeat;
      > .box_top {
        > img {
          width: 0.12rem;
          height: 0.12rem;
        }
      }
    }
  }
}
</style>
