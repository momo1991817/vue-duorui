<template>
  <div class="sub-colcumns">
    <ul>
      <li v-for="(item,index) in subColumns" @click.stop="Jump(item)">
        <img :src="item.imgSrc" :key="index">
        <p>{{item.title}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
  import bridge from "@/js/bridge.js";
  export default {
    name: "SubColumns",
    data() {
      return {
        token: "" ,
        subColumns: [
          {
            imgSrc: '../../../../static/bodybuilding/slim.png',
            title: '高效塑形',
            path: 'EfficientShaping'
          },
          {
            imgSrc: '../../../../static/bodybuilding/men.png',
            title: '增肌减脂',
            path: 'MuscleAndFat'
          },
          {
            imgSrc: '../../../../static/bodybuilding/bulding.png',
            title: '健身常识',
            path: 'FitnessKnowledge'
          }
        ]
      }
    },
    created() {
      this.token = this.$route.query.token;
      if (localStorage.getItem("Browser")) {
        this.$header = true;
      }
    },
    methods:{
      Jump(item) {
        if (this.$header) {
          this.$router.push({
            path: "/" + item.path,
            query:{
              token: this.token
            }
          });
        } else {
          var name = "duoruiapp_openInAppUrl";
          var data = {
            title: item.title,
            url:  this.$httpUrl + item.path + "?token=" + this.token
          };
          bridge.callhandler(name, data, function(response) {});
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .sub-colcumns {
    width: 100%;
    border-bottom: 0.05rem #eeeeee solid;

    > ul {
      display: flex;
      > li {
        flex: 1;
        > img {
          display: block;
          width: 0.42rem;
          height: 0.42rem;
          margin: auto;
        }

        > p {
          font-size: 0.12rem;
          text-align: center;
          color: #333333;
        }
      }

    }
  }
</style>
