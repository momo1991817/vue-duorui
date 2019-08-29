<template>
  <div class="topic-info-box">
    <img class="topic-img" :src="coverImage">
    <div class="topic-title">{{explain}} <span style="font-size:0.11rem;color:#666666">{{optionType == 1 ? '（单选）' : '（多选）'}}</span></div>
    <div class="choose-list">
      <div
        class="choose-item"
        @click="handleVote(item)"
        v-for="(item, index) in voteOptions"
        :style="item.voteStatus == 1 ? 'border: solid 0.01rem #7cb6ed;' : 'border: solid 0.01rem #dddddd;'"
      >
        <div class="process-bar"></div>
        <div class="item-text">{{item.name}}</div>
        <transition name="fade">

        </transition>
        <transition name="fade">
          <div class="number" v-if="isVote">
            <img src="../../../../static/topic-votes/gou.png" class="choose-icon" v-if="item.voteStatus == 1">
            {{item.voteNumber}}人
          </div>
        </transition>
      </div>
      <div class="explain">
        <div class="left">{{voteNumber}}人已参与</div>
        <div class="right">{{endText}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'vant'

  export default {
    name: "TopicInfo",
    data() {
      return {
        isVote: false,
        token: "",
        voteLists: [],
        voteNumber: 0,
        voteOption: 0,
        coverImage: '',
        explain: '',
        voteOptions: [],
        optionType: 1,
        leftTime: '',
        endDate: '',
        endText: ''
      }
    },
    created() {
      this.getVoteInfo();
    },
    methods: {
      voteAnimate() {
        var that = this;
        this.$nextTick(() => {
          document.querySelectorAll('.process-bar').forEach(function (item, index) {
            item.style = 'transition: width 1s ease;width:' + 0.0375 * that.voteOptions[index].voteNumber + 'rem'
          });
          document.querySelectorAll('.item-text').forEach(function (item) {
            item.style = 'left:0;transform: translateX(0);transition: all 1s ease;'
          })
        })
      },
      // 投票状态
      async getVoteInfo() {
        var that = this;
        this.token = this.$route.query.token;
        this.$http.get("/vote/getVoteOption", {
          params: {
            type: 3,
            voteId: this.$route.query.id,
            token: this.token
          }
        }).then((res) => {
          this.voteLists = res.data.extend.vote;
          this.coverImage = this.voteLists[0].coverImage;
          this.explain = this.voteLists[0].explain;
          this.voteOptions = this.voteLists[0].voteOptions;
          this.optionType = this.voteLists[0].optionType;
          this.endDate = this.voteLists[0].endDate;
          this.voteNumber = this.voteLists[0].enterVoteTotal;
          this.leftTimer();
          this.voteOptions.forEach(function (item) {
            if (item.voteNumber == null) {
              item.voteNumber = 0;
            }
            if (item.voteStatus == 1) {
              that.voteOption++;
              that.voteAnimate();
              that.isVote = true;
            }
          })
        })
      },
      // 话题投票
      handleVote(item2) {
        if (item2.voteStatus == 1) {
          Toast({
            message: '请勿重复投票！',
            duration: 800
          });
          return;
        }
        if (this.voteOption >= 1 && this.optionType == 1) {
          Toast({
            message: '该话题为单项选择',
            duration: 800
          });
          return;
        }
        this.$http.get("/vote/voteContent", {
          params: {
            type: 3,
            voteId: item2.id,
            token: this.token
          }
        }).then((res) => {
          if (res.data.code == 200) {
            item2.voteStatus = 1;
            this.getVoteInfo();
          } else {
            Toast(res.data.msg);
          }
        })
      },
      //  倒计时
      leftTimer() {
        var that = this;
        var Today = new Date();
        if(new Date( this.endDate + ' 24:00:00').getTime() - Today.getTime() <= 0){
          this.endText = '活动已结束';
          clearTimeout(timer);
          return;
        }
        var endYear = this.endDate.substr(0,4);
        var endMonth = this.endDate.substr(5,2);
        var endDate = this.endDate.substr(8,2);
        var NowYear = Today.getFullYear();
        var NowMonth = Today.getMonth();
        var NowDate = Today.getDate();
        var NowHour = Today.getHours();
        var NowMinute = Today.getMinutes();
        var NowSecond = Today.getSeconds();
        if (NowYear <2000) NowYear=1900+NowYear;
        var Hourleft = 24 - NowHour;
        var Minuteleft = 0 - NowMinute;
        var Secondleft = 0 - NowSecond;
        var Yearleft = endYear - NowYear;
        var Monthleft = endMonth - NowMonth - 1;
        var Dateleft = endDate - NowDate;

        if (Secondleft<0)
        {
          Secondleft=60+Secondleft;
          Minuteleft=Minuteleft-1;
        }
        if (Minuteleft<0)
        {
          Minuteleft=60+Minuteleft;
          Hourleft=Hourleft-1;
        }
        if (Hourleft<0)
        {
          Hourleft=24+Hourleft;
          Dateleft=Dateleft-1;
        }
        if (Dateleft<0)
        {
          Dateleft=31+Dateleft;
          Monthleft=Monthleft-1;
        }
        if (Monthleft<0)
        {
          Monthleft=12+Monthleft;
          Yearleft=Yearleft-1;
        }
        if(Yearleft == 0 && Monthleft > 0){
          this.leftTime=Monthleft + '月' + Dateleft+'天'+Hourleft+'小时';
        }else if(Yearleft == 0 && Monthleft == 0 && Dateleft > 0){
          this.leftTime=Dateleft+'天'+Hourleft+'小时';
        } else if (Yearleft == 0 && Monthleft == 0 && Dateleft == 0 && Hourleft > 0) {
          this.leftTime=Hourleft+'小时';
        } else if(Yearleft == 0 && Monthleft == 0 && Dateleft == 0 && Hourleft == 0  && Minuteleft > 0){
          this.leftTime=Minuteleft+ '分钟'
        } else{
          this.leftTime=Yearleft + '年' + Monthleft + '月' + Dateleft+'天'+Hourleft+'小时';
        }
        this.endText = '还剩'+ this.leftTime +'结束';
        var timer = setTimeout(function () {
          that.leftTimer();
        },1000);
      }
    },

  }
</script>

<style scoped lang="less">
  .topic-info-box {
    position: absolute;
    top: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;

    .topic-img {
      width: 3.75rem;
    }

    .topic-title {
      font-size: 0.15rem;
      color: #000000;
      margin: 0.13rem 0.125rem 0.23rem 0.125rem;
    }

    .choose-list {
      margin: 0 0.125rem;

      .choose-item {
        width: 100%;
        height: 0.365rem;
        border-radius: 0.183rem;
        border: solid 0.01rem #dddddd;
        box-sizing: border-box;
        margin-bottom: 0.1rem;
        position: relative;
        overflow: hidden;

        .process-bar {
          width: 0;
          height: 0.345rem;
          background: #bcdbf9;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
        }

        .item-text {
          line-height: 0.385rem;
          font-size: 0.14rem;
          color: #666666;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          padding: 0 0.155rem;
        }

        .number {
          font-size: 0.13rem;
          color: #7db6ed;
          position: absolute;
          right: 0.15rem;
          top: 0.08rem;
          z-index: 2;
          .choose-icon {
            width: 0.17rem;
            height: 0.15rem;
            float: left;
            margin: 0.01rem 0.15rem;
          }
        }
      }

      .explain {
        margin-top: 0.235rem;
        font-size: 0.12rem;
        color: #999999;

        .left {
          float: left;
        }

        .right {
          float: right;
        }
      }
    }

    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
    }
  }
</style>
