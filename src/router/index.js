// 引入子路由
import robbing from '../pages/robbing'
import track from '../pages/track'
import site from '../pages/site'
import car from '../pages/car'
import uploadData from '../pages/uploadData'
import agreeToRefuse from '../pages/agreeToRefuse'
import trackList from '../pages/trackList'
import message from '../pages/message'
import user from '../pages/user'
import Vue from 'vue'
import Router from 'vue-router'
import  robbingF from '@/components/robbing/robbingMore'
import  robbingS from '@/components/robbing/dismantling'
import  robbingT from '@/components/robbing/dismantlingTrue'
import  siteF from '@/components/site/chooseSite'
import  siteFo from '@/components/site/editSite'
import  siteFi from '@/components/site/siteSure'
import  siteSi from '@/components/site/timeSite'
import  siteSe from '@/components/site/lastSure'
import  siteEg from '@/components/site/car'
import  siteNi from '@/components/site/carHanger'
import  trackF from '@/components/track/trackMore'
import  trackS from '@/components/track/map'
import  carF from '@/components/car/carMessage'
import  carS from '@/components/car/map'
import  carT from '@/components/car/changeCarpeople'
import  carFo from '@/components/car/newdriver'
import  carFi from '@/components/car/newCar'
import uploadDataS from '@/components/uploadData/uploadDataS'
import uploadDataT from '@/components/uploadData/uploadDataT'
import uploadDataFo from '@/components/uploadData/uploadDataFo'
import  agreeList from  '@/components/agreeToRefuse/agreeList'
import  agreeMore from  '@/components/agreeToRefuse/agreeMore'
import listMessage from '@/components/message/messageList'
import aboutUs from '@/components/myBox/aboutUs'
import setup from '@/components/myBox/setup'
import suggestion from '@/components/myBox/suggestion'
import changePassword from '@/components/myBox/changePassword'
import statusNow from '@/components/myBox/statusNow'
Vue.use(Router);

Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title
    document.getElementById('title').innerText = document.title
  }
});
Vue.filter('companyTypeName', function(value) {
  value = value*1;
  var valueTypeName  ="";
  switch (value)
  {
    case 0:
      valueTypeName="";
      break;
    case 1:
      valueTypeName="待审核";
      break;
    case 2:
      valueTypeName="已审核";
      break;
    case 3:
      valueTypeName="已驳回";
      break;
    case 4:
      valueTypeName="已禁用";
      break;
  }
  return valueTypeName
});

Vue.filter('orderTypeName', function(value) {
  value = value*1;
  var valueTypeName  ="";
  switch (value)
  {
    case 0:
      valueTypeName = "待确认";
      break;
    case 10:
      valueTypeName = "已确认";
      break;
    case 20:
      valueTypeName = "司机出发";
      break;
    case 31:
      valueTypeName = "提货到达";
      break;
    case 32:
      valueTypeName = "开始装货";
      break;
    case 33:
      valueTypeName = "装货完毕";
      break;
    case 41:
      valueTypeName = "运输到达";
      break;
    case 42:
      valueTypeName = "开始卸货";
      break;
    case 43:
      valueTypeName = "卸货完毕";
      break;
    case 50:
      valueTypeName = "已签收";
      break;
    case 60:
      valueTypeName = "退单";
      break;
  }
  return valueTypeName
});

export default new Router({
  routes: [
    {
      path:'/changePassword',
      name:'changePassword',
      component:changePassword,
    },
    {
      path:'/statusNow',
      name:'statusNow',
      component:statusNow,
    },
    {
      path:'/aboutUs',
      name:'aboutUs',
      component:aboutUs,
    },
    {
      path:'/setup',
      name:'setup',
      component:setup,
    },
    {
      path:'/suggestion',
      name:'suggestion',
      component:suggestion,
    },
    {
      path:'/trackList',
      name:'trackList',
      component:trackList,
    },
    {
      path:'/listMessage',
      name:'listMessage',
      component:listMessage
    },
    {
      path:'/message',
      name:'message',
      component:message,
    },
    {
      path:'/user',
      name:'user',
      component:user,
    },
    {
      path: '/uploadData',
      name: 'uploadData',
      component: uploadData,
      children: [
        {path: 'uploadDataS', component: uploadDataS},
        {path: 'uploadDataT', component: uploadDataT},
        {path: 'uploadDataFo', component: uploadDataFo}
      ]
    },
    {
      path: '/robbing',
      name: 'robbing',
      component: robbing,
      children: [
        {path: 'robbingMore', component: robbingF},
        {path: 'dismantling', component: robbingS},
        {path: 'dismantlingTrue', component: robbingT}
        ]
    },
    {
      path: '/site',
      name: 'site',
      component: site,
      children: [
        {path: 'chooseSite', component: siteF},
        {path: 'editSite', component: siteFo},
        {path: 'siteSure', component: siteFi},
        {path: 'timeSite', component: siteSi},
        {path: 'lastSure', component: siteSe},
        {path: 'car', component: siteEg},
        {path: 'carHanger', component: siteNi}
      ]
    },
    {
      path: '/track',
      name: 'track',
      component: track,
      children: [
        {path: 'trackMore', component: trackF},
        {path: 'map', component: trackS}
      ]
    },
    {
      path: '/car',
      name: 'car',
      component: car,
      children: [
        {path: '/',
          component: carF,
          children:[{
            path:"/",
            component:carS
          }]
        },
        {path: 'map', component: carS},
        {path: 'changeCarpeople', component: carT},
        {path: 'newdriver', component: carFo},
        {path: 'newCar', component: carFi}
      ]
    },
    {
      path: '/agreeToRefuse',
      name: 'agreeToRefuse',
      component: agreeToRefuse,
      children: [
        {path: '/', component: agreeList},
        {path: 'agreeMore', component: agreeMore},
      ]
    },
  ]
})
