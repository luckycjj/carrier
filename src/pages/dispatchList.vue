<template>
  <div id="dispatchList">
    <div id="title" v-title data-title="调度中心"></div>
    <div id="mescroll" class="mescroll">
      <ul id="dataList" class="data-list">
        <li v-for="(items,index) in pdlist"  @click="lookagresRefuseMore(items)">
          <h3>￥<span>{{items.price*1}}</span></h3>
          <h6 class="deliDateTime">{{items.deliDate}}</h6>
          <h6 class="arriDateTime">{{items.arriDate}}</h6>
          <div class="proBox">
            <h5>待调度</h5>
            <p class="startEnd"><span class="startEndSpan">{{items.deliAddr}}<img src="../images/addressImg.png">{{items.arriAddr}}</span><div class="clearBoth"></div></p>
            <div class="proBoxList transType">{{items.transType}}/{{items.goodCode}}</div>
            <div class="proBoxList wvolume"><span>{{items.num}}件</span><span  v-if="items.weight*1 > 0">/{{items.weight*1}}吨</span><span v-if="items.volume*1 > 0">/{{items.volume*1}}立方米</span></div>
          </div>
          <h1>{{items.customer}}</h1>
        </li>
      </ul>
    </div>
    <footComponent  ref="footcomponent" :idx='2'></footComponent>
  </div>
</template>

<script>
  import MeScroll from '../js/mescroll'
  import {iscroll} from '../js/iscroll'
  import {androidIos} from "../js/app";
  import {bomb} from "../js/zujian";
  var thisThat;
  export default {
    name: "dispatchList",
    data(){
      return{
        pdlist:[],
        number:"",
        size:"",
        refuseResule:""
      }
    },
    mounted: function () {
      var _this = this;
      sessionStorage.removeItem("weh");
      sessionStorage.removeItem("nowOrderCartype");
      sessionStorage.removeItem("dataStart");
      sessionStorage.removeItem("dataEnd");
      sessionStorage.removeItem("orderPk");
      sessionStorage.removeItem("dispatchPK");
      sessionStorage.removeItem("carPKlistGo");
      sessionStorage.removeItem("driverPk");
      androidIos.bridge(_this);
    },
    methods: {
      go:function () {
        var self = this;
        thisThat = self;
        self.mescroll = new MeScroll("mescroll", { //请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
          up: {
            callback: self.upCallback, //上拉回调
            isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
            empty:{
              warpId:'mescroll',
              icon:require('../images/nojilu.png'),
              tip:"暂无订单"
            }
          },
          down: {
            offset: 2.1 * $("html").css("font-size").replace("px", ""),
          }
        });
      },
      upCallback: function (page) {
        //联网加载数据
        var self = this;
        getListDataFromNet(page.num, page.size, function (curPageData) {
          //curPageData=[]; //打开本行注释,可演示列表无任何数据empty的配置

          //如果是第一页需手动制空列表 (代替clearId和clearEmptyId的配置)
          if (page.num == 1) self.pdlist = [];

          //更新列表数据
          self.pdlist = self.pdlist.concat(curPageData);
          self.mescroll.endSuccess(curPageData.length);

        }, function () {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        });
      },
      lookagresRefuseMore:function (item) {
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/robbing/robbingMore',query:{"type":3,"pk":item.pkSegment}});
      }
    }
  }
  function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
    //延时一秒,模拟联网
    setTimeout(function () {
      if(pageNum == 1){
        thisThat.$refs.footcomponent.go();
      }
      $.ajax({
        type: "POST",
        url: androidIos.ajaxHttp() + "/order/loadSchedule",
        data: JSON.stringify({
          userCode:sessionStorage.getItem("token"),
          source:sessionStorage.getItem("source"),
          page:pageNum,
          size:pageSize
        }),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout: 10000,
        success: function (getDriverApplication) {
          if(getDriverApplication.success == "1"){
            thisThat.number = pageNum;
            thisThat.size = pageSize;
            successCallback&&successCallback(getDriverApplication.list);
          }else{
            androidIos.second(getDriverApplication.message);
            successCallback([]);
          }
        },
        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
          if(status=='timeout'){//超时,status还有success,error等值的情况
            androidIos.second("当前状况下网络状态差，请检查网络！");
            successCallback([]);
          }else if(status=="error"){
            androidIos.errorwife();
            successCallback([]);
          }
        }
      })
      //成功回调
    },100)
  }
</script>

<style>
  @import "../css/mescroll.css";
  @import "../css/scroll.css";
</style>
<style scoped>
  #dispatchList{
    position:absolute;
    top:1.3rem;
    bottom:0;
    height: auto;
    width:100%;
    background: #f6f6f6;
  }
  #dispatchList ul{
    width:100%;
    margin-top: 0.2rem;
  }
  #dispatchList li{
    width: 94%;
    background: white;
    /* margin-bottom: 0.2rem; */
    margin: 0 auto 0.2rem auto;
    border-radius: 0.2rem;
    box-shadow: 0 5px 10px #cecbcb;
    overflow: hidden;
  }
  #dispatchList .firstBox{
    width:100%;
  }
  #dispatchList .firstBox p,#dispatchList .firstBox h1{
    font-size: 0.4rem;
    margin-left: 0.3rem;
    padding-top: 0.6rem;
    width:auto;
  }
  #dispatchList .firstBox h1{
    padding-top: 0.2rem;
  }
  #dispatchList .secondBox{
    width:100%;
    margin-top: 0.2rem;
  }
  #dispatchList .secondBox button{
    width:50%;
    color:white;
    font-size: 0.375rem;
    line-height: 1.2rem;
    float: left;
  }
  #dispatchList .no{
    background: #c7c7c7;
  }
  #dispatchList .yes{
    background: #2c9cff;
  }
  #dispatchList .mescroll{
    position: fixed;
    top:1.3rem;
    bottom: 1.3rem;
    height: auto;
    background-color: rgb(245, 245, 249)!important;
  }
  .data-list{
    width:100%;
  }
  .data-list li{
    width:94%;
    margin: 0.2rem auto 0.08rem;
    background: white;
    border-radius:0.16rem;
    padding:0.4rem 0 ;
    position: relative;
  }
  .data-list li h6{
    font-size:0.32rem ;
    color:#999;
    margin-left: 0.4rem;
    margin-bottom: 0.01rem;
    padding-left: 0.5rem;
    background-repeat: no-repeat;
    background-size:0.213rem 0.213rem ;
    background-position: 0 50%;
  }
  .data-list li h1{
    font-size:0.34rem ;
    color:#999;
    padding-top: 0.2rem;
    margin-left: 0.5rem;
  }
  .data-list li h3{
    position: absolute;
    color:#333;
    min-width: 2rem;
    font-size: 0.375rem;
    text-align: right;
    right:0.5rem;
    top:0.6rem;
  }
  .data-list li h3 span{
    font-size: 0.375rem;
    color:#f4a131;
  }
  .deliDateTime{
    background-image: url("../images/pickmessage.png");
  }
  .arriDateTime{
    background-image: url("../images/arrmessage.png");
  }
  .proBox{
    width:85%;
    padding: 0.5rem 0.45rem;
    margin: 0.2rem auto;
    border-radius: 0.1rem;
    box-shadow: 0 0 0.13rem #e2e2e2;
    border: 1px solid white;
    position: relative;
  }
  .proBox h5{
     position: absolute;
    top:50%;
    right:2%;
    font-size: 0.5rem;
    color:#999;
    margin-top: -0.25rem;
  }
  .startEndSpan{
    float: left;
    font-size: 0.44rem;
    font-weight:bold;
    line-height: 0.56rem;
    color:#333;
    margin-bottom: 0.25rem;

  }
  .startEnd img{
    display: inline-block;
    margin:0rem 0.3rem 0.13rem 0.3rem;
    width:0.45rem;
  }
  .proBoxList{
    color:#999;
    font-size:0.35rem ;
    margin-top: 0.1rem;
    max-width: 6rem;
  }
  .proBoxList span{
    color:#999;
    font-size:0.35rem ;
  }
  .transType{
     background-image: url("../images/product.png");
    background-size: 0.5rem;
    background-repeat: no-repeat;
    background-position: 0 0.02rem;
    padding-left: 0.65rem;
  }
  .wvolume{
    background-image: url("../images/weight.png");
    background-size: 0.5rem;
    background-repeat: no-repeat;
    background-position :0 0.02rem;
    padding-left: 0.65rem;
  }
</style>
