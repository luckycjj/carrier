<template>
  <div id="orderScreen" style="top:0rem;">
    <div id="title" v-title data-title="发货地址"></div>
    <div id="carTitleBox"   @click="event($event)">
      <div class="carTitleBox">
        <div class="carTitleback" @click="goback()"></div>
        <div class="InputDiv">
          <input type="text" placeholder="请输入订单号/货物名称"  id="carNumber" v-model="address"  @focus="aaa()">
          <div class="yuyinhuatong" @click="yuyin = true"></div>
          <!--<img src="../../images/huatong-3.png">-->
        </div>
        <p @click="sousuo()" id="sousuo">搜索</p>
      </div>
    </div>
    <div id="mescroll" class="mescroll" style="top:1.3rem;">
      <ul id="dataList" class="data-list">
        <li v-for="(items,indexs) in pdlist" @click="lookTrackMore(items.pkInvoice)">
          <h3 v-html="items.status == 10 ? '已确认': items.status == 20 ? '司机出发': items.status == 31 ? '提货到达': items.status == 32 ? '开始装货': items.status == 33 ? '装货完毕': items.status == 41 ? '运输到达': items.status == 42 ? '开始卸货': items.status == 43 ? '卸货完毕': items.status == 50 ? '已签收': items.status == 55 ? '已回单': items.status == 60 ? '已拒绝': ''"></h3>
          <h6 class="deliDateTime">{{items.deliDate}}</h6>
          <h6 class="arriDateTime">{{items.arriDate}}</h6>
          <div class="proBox">
            <p class="startEnd"><span class="startEndSpan">{{items.deliAddr}}<img src="../../images/addressImg.png">{{items.arriAddr}}</span><div class="clearBoth"></div></p>
            <div class="proBoxList" v-for="(pro,proIndex) in items.itemDaos">{{pro.goodsCode}}/{{pro.goodsName}}/{{pro.num}}件/{{pro.weight*1}}吨/{{pro.volume*1}}立方米</div>
          </div>
          <h1>订单编号：{{items.vbillno}}</h1>
        </li>
      </ul>
    </div>
    <transition name="slide-fade">
      <div id="yuyinBox" v-if="yuyin" @click.stop="yuyinFlase($event)">
        <div id="yuyin"  @touchstart="liTouchstart()" @touchmove="liTouchmove()"  @touchend="liTouchend()">
          <p>按住识别</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import MeScroll from '../../js/mescroll'
  import {iscroll} from '../../js/iscroll'
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  var thisthatsecond;
  export default {
    name: "orderScreen",
    data(){
      return{
        pdlist:[],
        address:"",
        pk:"",
        size:"",
        number:"",
        manage:false,
        addressType:"",
        total:100,
        settime:null,
        ajax1:null,
        yuyin:false,
        iflyRecognition:null,
      }
    },
    mounted:function () {
      var _this = this;
      androidIos.judgeIphoneX("orderScreen",2);
      androidIos.judgeIphoneX("mescroll",2);
      _this.addressType = _this.$route.query.type;
      try{
        _this.iflyRecognition = api.require('iflyRecognition');
        _this.iflyRecognition.createUtility({
          android_appid: '5c04a475'
        }, function(ret, err) {
          if (ret.status) {
            console.log("创建成功");
          } else {
            console.log("创建失败");
          }
        });
      }
      catch (e){
        _this.iflyRecognition = null;
      }
      androidIos.bridge(_this);
    },
    methods:{
      liTouchstart:function () {
        var _this = this;
        if(_this.iflyRecognition != null){
          _this.iflyRecognition.record({
            vadbos: 5000,
            vadeos: 5000,
            rate: 16000,
            asrptt: 1,
            audioPath: 'fs://speechRecogniser/speech.pcm'
          }, function(ret, err) {
            if (ret.status) {
              console.log(ret.wordStr);
              _this.address = ret.wordStr.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'').toUpperCase();
            } else {
              console.log(err.msg);
            }
          });
        }else{
          _this.yuyin = false;
          androidIos.second("暂不支持语音搜索")
        }
      },
      liTouchmove:function () {
        var _this = this;
        if(_this.iflyRecognition != null){
        }else{
          _this.yuyin = false;
          androidIos.second("暂不支持语音搜索")
        }
      },
      liTouchend:function () {
        var _this = this;
        if(_this.iflyRecognition != null){
          _this.iflyRecognition.stopRecord();
          _this.yuyin = false;
        }else{
          _this.yuyin = false;
          androidIos.second("暂不支持语音搜索")
        }
      },
      yuyinFlase:function (e) {
        var _this = this;
        if(e.target.id == "yuyinBox"){
          _this.yuyin = false;
        }
      },
      go:function () {
        var self = this;
        thisthatsecond = self;
        var ORDERSCREEN = sessionStorage.getItem("ORDERSCREEN");
        if( ORDERSCREEN != null){
          self.address = ORDERSCREEN;
        }
        self.mescroll = new MeScroll("mescroll", { //请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
          up: {
            callback: self.upCallback, //上拉回调
            isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
            empty:{
              warpId:'mescroll',
              icon:require('../../images/nojilu.png'),
              tip:""
            },
            page: {
              num: 0, //当前页码,默认0,回调之前会加1,即callback(page)会从1开始
              size: 10, //每页数据的数量
            }
          },
          down: {
            offset: 2.1 * $("html").css("font-size").replace("px", ""),
          }
        });
      },
      inputKeyup:function () {
        var _this = this;
        _this.address = _this.address.replace(/[^\a-\z\A-\Z0-9\-]/g,'');;
      },
      aaa:function(){
        $("#orderScreen #carTitleBox").css("z-index","100");
        document.getElementById("sousuo").innerText = "搜索";
      },
      event:function (e) {
        var _this = this;
        if($("#orderScreen #carTitleBox").css("z-index")=="100"){
          if(e.target.id=="carTitleBox"){
            $("#orderScreen #carTitleBox").css("z-index","0");
            _this.pdlist = [];
            _this.mescroll.resetUpScroll();
          }
        }
      },
      sousuo:function(){
        var _this = this;
        $("#orderScreen #carTitleBox").css("z-index","0");
        _this.pdlist = [];
        _this.mescroll.resetUpScroll();
      },
      upCallback: function(page) {
        //联网加载数据
        var self = this;
        getListDataFromNet(page.num, page.size, function(curPageData) {
          //curPageData=[]; //打开本行注释,可演示列表无任何数据empty的配置

          //如果是第一页需手动制空列表 (代替clearId和clearEmptyId的配置)
          if(page.num == 1) self.pdlist = [];
          self.number = page.num;
          self.size = page.size;
          //更新列表数据
          self.pdlist = self.pdlist.concat(curPageData);
          self.mescroll.endSuccess(curPageData.length);
          self.$nextTick(function () {
            $("#addressMessage .secondBox").css("height","50%");
          })

        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        });
      },
      goback:function () {
        androidIos.gobackFrom(this);
      },
      lookTrackMore:function (pk) {
        var _this = this;
        sessionStorage.setItem("ORDERSCREEN",_this.address);
        androidIos.addPageList();
        _this.$router.push({ path: '/track/trackMore',query:{pk:pk,pt:2}});
      },
    },
    beforeDestroy:function () {
      var _this = this;
      clearTimeout(_this.settime);
      if(_this.ajax1 != null){
        _this.ajax1.abort();
      }
    },
    destroy:function () {
      var _this = this;
      clearTimeout(_this.settime);
      if(_this.ajax1 != null){
        _this.ajax1.abort();
      }
    }
  }
  function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
    //延时一秒,模拟联网
    thisthatsecond.settime = setTimeout(function () {
      if( thisthatsecond.address != "") {
        thisthatsecond.ajax1 = $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + "/order/loadEntrust",
          data: JSON.stringify({
            page: pageNum,
            size: pageSize,
            type: 0,
            state: 0,
            userCode: sessionStorage.getItem("token"),
            source: sessionStorage.getItem("source"),
            keyword: thisthatsecond.address == "" ? "HDSDDD" : thisthatsecond.address,
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 30000,
          success: function (loadEntrust) {
            if (loadEntrust.success == "1") {
              successCallback(loadEntrust.list);
            } else {
              androidIos.second(loadEntrust.message);
              successCallback([]);
            }
          },
          complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
            if (status == 'timeout') { //超时,status还有success,error等值的情况
              androidIos.second("当前状况下网络状态差，请检查网络！");
              successCallback([]);
            } else if (status == "error") {
              androidIos.errorwife();
              successCallback([]);
            }
          }
        });
      }else{
        successCallback([]);
      }
    },500)
  }
</script>

<style >
  @import "../../css/mescroll.css";
  @import "../../css/scroll.css";
  #orderScreen .carTitleBox{
    width: 100%;
    position: absolute;
    top: 0;
    height: 1.25rem;
    background: white;
  }
  #orderScreen .carTitleback{
    position: absolute;
    left:0;
    top:0;
    bottom: 0;
    height: auto;
    width: 1.5rem;
    background-image: url("../../images/titlejian.png");
    background-position: 35% 50%;
    background-repeat: no-repeat;
    background-size: 0.2rem 0.3714rem;
  }
  #orderScreen #carTitleBox{
    position: absolute;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background: rgba(0,0,0,0);
    width:auto;
    height: auto;
    z-index:0;
  }
  #orderScreen .carTitleBox p {
    position: absolute;
    right:0;
    top:0;
    line-height: 1.25rem;
    color:#333;
    margin-right: 2%;
    font-size: 0.35rem;
  }
  .InputDiv{
    display: block;
    width:60%;
    background-color: #f2f2f2;
    border:1px solid #eaeaea;
    padding: 0.15rem 0;
    margin-top:0.225rem;
    margin-left:2rem;
    border-radius: 0.45rem;
    position: relative;
  }
  .InputDiv .yuyinhuatong{
    position: absolute;
    width:15%;
    right:0;
    top:0;
    bottom:0;
    height: 100%;
    background-image: url("../../images/huatong-3.png");
    background-size: 0.3rem;
    background-repeat: no-repeat;
    background-position: 50% 50%;
  }
  #orderScreen .carTitleBox input{
    display: block;
    width:70%;
    color:#333;
    background-color: transparent;
    font-size: 0.36rem;
    text-align: left;
    padding-left: 15%;
    background-image: url("../../images/sousuo.png");
    background-position: 6% 50%;
    background-repeat: no-repeat;
    background-size: 0.4133rem 0.4rem;
  }
  #orderScreen .mescroll{
    position: fixed;
    top:1.3rem;
    bottom:0rem;
    height: auto;
    background-color: rgb(245, 245, 249)!important;
  }
</style>
<style scoped>
  #orderScreen{
    position:absolute;
    top:0rem;
    bottom:0;
    height: auto;
    width:100%;
    background: #f6f6f6;
  }
  .mescroll{
    position: absolute;
    top:1.2rem;
    bottom:0rem;
    height: auto!important;
  }
  #showBox{
    position: absolute;
    top:0;
    bottom: 1.3rem;
    height: auto;
    width:100%;
  }
  .wrapper {
    position:relative;
    height: 1rem;
    width: 100%;
    margin:0 auto;
    background:white;
    border-top: 2px solid #E5E5E5;
  }
  .wrapper .scroller {
    position:absolute;
  }
  .wrapper .scroller li {
    height: 1rem;
    color:#373737;
    float: left;
    line-height: 1rem;
    font-size: .4rem;
    text-align: center;
    width:2rem;
  }
  .wrapper .scroller li a{
    color:#373737;
    display:block;
    font-size: 0.35rem;
    margin:0 0.1rem;
  }
  .wrapper .scroller li a span{
    color:#2c9cff;
    font-size: 0.3125rem;
  }
  .wrapper .scroller li.cur a{
    color:#2c9cff;
    border-bottom: 1px solid #2c9cff;
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
    width:2rem;
    font-size: 0.375rem;
    right:0;
    top:0.6rem;
  }
  .deliDateTime{
    background-image: url("../../images/pickmessage.png");
  }
  .arriDateTime{
    background-image: url("../../images/arrmessage.png");
  }
  .proBox{
    width:85%;
    padding: 0.5rem 0.45rem;
    margin: 0.2rem auto;
    border-radius: 0.1rem;
    box-shadow: 0 0 0.13rem #e2e2e2;
    border: 1px solid white;
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
  }
  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateY(0.13rem);
    opacity: 0;
  }
  #yuyinBox{
    position: fixed;
    top:0;
    bottom:0;
    width:100%;
    height: auto;
    background: rgba(0,0,0,0);
  }
  #yuyin{
    width:2rem;
    height: 2rem;
    background-color:rgba(0,0,0,0.5);
    background-image: url("../../images/huatong-2.png");
    background-repeat: no-repeat;
    background-position: 50% 30%;
    border-radius: 0.2rem;
    background-size: 0.5rem;
    position: absolute;
    top:50%;
    margin-top: -1rem;
    left:50%;
    margin-left: -1rem;
  }
  #yuyin p {
    font-size: 0.35rem;
    color:white;
    text-align: center;
    margin-top: 1.3rem;
  }
</style>
