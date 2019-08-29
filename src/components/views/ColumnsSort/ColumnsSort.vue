<template>
  <div class="sort-box">
    <div class="sort-title van-clearfix">
      我的栏目
      <span>长按可拖动排序(除推荐外)</span>
      <div class="submit-btn" @click="handleSubmit">编辑</div>
    </div>
    <ul class="column-list van-clearfix">
      <li :style="active == 0 ? 'color: #2090ff' : 'color: #000000'">推荐</li>
      <draggable v-model="columns" @update="datadragEnd" animation="500" @start="datadragStart">
        <transition-group>
          <li
            v-for="(item, index) in columns"
            :style="item.active == 1?'color:#2090ff':'color:#000000'"
            :key="item.id"
          >{{item.columnName}}</li>
        </transition-group>
      </draggable>
    </ul>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import {Toast} from 'vant'
  export default {
    name: "ColumnsSort",
    components: {
      draggable,
    },
    data() {
      return {
        token: "" ,
        columns: [],
        startArr:[],
        endArr:[],
        count:0,
        context: '编辑',
        active: ''
      }
    },
    created() {
      this.token = this.$token;
      this.active = this.$route.query.active;
      if (this.$route.query.browser) {
        this.$header = true;
      }
      // 栏目信息
      this.$http.get("/columns/getColumnsByUser?token=" + this.token).then(res => {
        this.columns = res.data.extend.list;
        var that = this;
        this.columns.forEach(function (item,index) {
          if(that.active == index){
            item.active = 1;
          }else{
            item.active = 0;
          }
        });
        this.columns.splice(0,1);
      })
    },
    methods:{
      datadragEnd (evt) {
        evt.preventDefault();
        // console.log('拖动前的索引 :' + evt.oldIndex)
        // console.log('拖动后的索引 :' + evt.newIndex)
        // console.log(this.columns);
      },
      datadragStart() {
        // this.context = '完成'
      },
      handleSubmit() {
        var newsData = [];
        // this.context = this.context == '完成' ? '编辑' : '完成';
        this.columns.forEach(function (item,index) {
          // delete item.active;
          item.listorder = index+2;
        });
        newsData = [{"id":1,"columnName":"推荐","listorder":1,"updateTime":null,"createTime":null}];
        newsData = newsData.concat(this.columns);
        // 提交栏目修改
        this.$http({
          method: 'post',
          url: "columns/updateColumnsOrder/" + this.token,
          data: newsData
        }).then((res)=>{
          Toast(res.data.msg)
        });

      }
    },
    mounted () {
      //为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
      document.body.ondrop = function (event) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }
</script>

<style scoped lang="less">
  .sort-box {
    position: absolute;
    top: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 0.11rem 0.12rem;
    overflow: hidden;
    .sort-title {
      line-height: 0.245rem;
      padding: 0 0.1rem 0.1rem 0.1rem;
      font-size: 0.15rem;
      color: #333333;

      span {
        font-size: 0.12rem;
        color: #999999;
      }
      .submit-btn{
        width: 0.675rem;
        height: 0.245rem;
        border-radius: 0.113rem;
        border: solid 0.005rem #fed967;
        font-size: 0.13rem;
        color: #fed967;
        float: right;
        text-align: center;
        line-height: 0.245rem;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin: 0;
      }
    }

    .column-list {
      li {
        width: 0.675rem;
        height: 0.245rem;
        border-radius: 0.113rem;
        border: solid 0.005rem #dddddd;
        font-size: 0.13rem;
        color: #000000;
        float: left;
        text-align: center;
        line-height: 0.245rem;
        box-sizing: border-box;
        margin: 0.1rem;
      }
    }
  }
  .test{
    border:1px solid #ccc;
  }
  .drag-item{
    width: 200px;
    height: 50px;
    line-height: 50px;
    margin: auto;
    position: relative;
    background: #ddd;
    margin-top:20px;
  }
  .ghostClass{
    opacity: 1;
  }
  .bottom{
    width: 200px;
    height: 50px;
    position: relative;
    background: blue;
    top:2px;
    left: 2px;
    transition: all .5s linear;
  }
</style>
