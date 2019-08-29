<template>
  <div class="iframe">
    <!-- 头部 -->
    <headers title="多锐"></headers>
    <iframe :src="goUrl" class="iframe" frameborder="0"></iframe>
  </div>
</template>
<script>
import headers from "@/components/common/Header.vue";
export default {
  components: { headers },
  data: () => ({ goUrl: "" }),
  created() {
    this.goUrl = JSON.parse(localStorage.getItem("goUrl")).url;
  },
  methods: {}
};
</script>

<style lang="less" scoped>
// 清除浮动
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
.iframe {
  max-width: 750px;
  min-width: 300px;
  margin: 0 auto;
  // background-color: #fff;
  position: absolute;
  width: 100%;
  padding-bottom: 0.5rem;
  min-height: 100%;
}
</style>