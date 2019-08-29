import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: '推荐',
    component: () => import("@/components/views/recommend/recommend"),
    meta: { showFooter: true, keepAlive: true }
  }, {
    path: '/lady',
    name: '女人',
    component: () => import("@/components/views/lady/lady"),
    meta: { showFooter: true, keepAlive: true }
  },
  // {
  //   path:'/life',
  //   name:'生活',
  //   component:() => import("@/components/views/life/life"),
  //   meta: {showFooter:true, keepAlive:true }
  // },
  {
    path: '/video',
    name: '视频',
    component: () => import("@/components/views/video/video"),
    meta: { showFooter: true, keepAlive: true }
  }, {
    path: '/shopping',
    name: '商城',
    component: () => import("@/components/views/shopping/shopping"),
    // meta: { showFooter: true, keepAlive: true }
  }, {
    path: '/emotion',
    name: '健身',
    component: () => import("@/components/views/Emotion/Emotion"),
    meta: { showFooter: true, keepAlive: true }
  }, {
    path: '/diet',
    name: '情感',
    component: () => import("@/components/views/diet/diet"),
    meta: { showFooter: true, keepAlive: true }
  }, {
    path: '/yoga',
    name: '生活',
    component: () => import("@/components/views/yoga/yoga"),
    meta: { showFooter: true, keepAlive: true }
  }, {
    path: '/bodybuilding',
    name: '育儿',
    component: () => import("@/components/views/bodybuilding/bodybuilding"),
    meta: { showFooter: true, keepAlive: true }
  }, {
    path: '/healthy',
    name: '健康',
    component: () => import("@/components/views/Healthy/Healthy"),
    meta: { showFooter: true, keepAlive: true }
  }, {
    path: '/thousandChat',
    name: '千聊',
    component: () => import("@/components/views/ThousandChat/ThousandChat"),
    meta: { showFooter: true, keepAlive: true }
  }, {
    path: '/search',
    name: '搜索',
    component: () => import("@/components/views/search/search"),
    // meta: { keepAlive: true }
  }, {
    path: '/personal',
    name: '个人信息',
    component: () => import("@/components/views/personal/personal"),
    meta: { keepAlive: true }
  }, {
    path: '/follow',
    name: '我的关注',
    component: () => import("@/components/views/follow/follow"),
    meta: { keepAlive: true }
  }, {
    path: '/collection',
    name: '我的收藏',
    component: () => import("@/components/views/collection/collection"),
    meta: { keepAlive: true }
  }, {
    path: '/authorDetails',
    name: '作者文章',
    component: () => import("@/components/views/authorDetails/authorDetails"),
    meta: { keepAlive: true }
  }, {
    path: '/articleInfo',
    name: '文章详情',
    component: () => import("@/components/views/articleInfo/articleInfo"),
    // meta: {keepAlive:true}
  }, {
    path: '/article-info-f',
    name: '文章详情分享',
    component: () => import("@/components/views/article-info-f/article-info-f"),
    meta: { keepAlive: true }
  }, {
    path: '/articleInfo-title',
    name: '广告图跳转的文章详情',
    component: () => import("@/components/views/articleInfo-title/articleInfo-title"),
    meta: { keepAlive: true }
  }, {
    path: '/videoInfo',
    name: '视频详情',
    component: () => import("@/components/views/videoInfo/videoInfo"),
    meta: { keepAlive: true }
  }, {
    path: '/video-info-f',
    name: '视频详情分享',
    component: () => import("@/components/views/Video-info-f/Video-info-f"),
    meta: { keepAlive: true }
  }, {
    path: '/iframe',
    name: '跳转第三方',
    component: () => import("@/components/views/iframe/iframe"),
    meta: { keepAlive: true }
  },
  {
    path: '/hot-article',
    name: '热点文章',
    component: () => import("@/components/views/HotArticle/HotArticle"),
    meta: { keepAlive: true }
  },
  {
    path: '/columns-sort',
    name: '栏目排序',
    component: () => import("@/components/views/ColumnsSort/ColumnsSort"),
    // meta: {keepAlive:true}
  },
  {
    path: '/imagePreview',
    name: '图片新闻',
    component: () => import("@/components/views/ImagePreview/ImagePreview"),
  },
  {
    path: '/FitnessKnowledge',
    name: '健身常识',
    component: () => import("@/components/views/FitnessKnowledge/FitnessKnowledge"),
    meta: { keepAlive: true }
  },
  {
    path: '/EfficientShaping',
    name: '高效塑形',
    component: () => import("@/components/views/EfficientShaping/EfficientShaping"),
    meta: { keepAlive: true }
  },
  {
    path: '/MuscleAndFat',
    name: '增肌减脂',
    component: () => import("@/components/views/MuscleAndFat/MuscleAndFat"),
    meta: { keepAlive: true }
  },
  {
    path: '/Investigation',
    name: '大调查',
    component: () => import("@/components/views/Investigation/Investigation"),
    // meta: { keepAlive: true }
  },
  {
    path: '/TopicInfo',
    name: '话题详情',
    component: () => import("@/components/views/TopicInfo/TopicInfo"),
    // meta: { keepAlive: true }
  },
  {
    path: '/Myintegral',
    name: '我的积分',
    component: () => import("@/components/views/Myintegral/Myintegral"),
    // meta: { keepAlive: true }
  },
  {
    path: '/IncomeRecord',
    name: '收益记录',
    component: () => import("@/components/views/IncomeRecord/IncomeRecord"),
    // meta: { keepAlive: true }
  },
  {
    path: '/CheckInRule',
    name: '签到规则',
    component: () => import("@/components/views/CheckInRule/CheckInRule"),
    // meta: { keepAlive: true }
  }
  ]

})
