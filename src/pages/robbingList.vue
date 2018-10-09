<template>
  <div id="robbingList">
    <div id="title" v-title data-title="订单"></div>
    <div id="showBox">
      <div class="wrapper" id="trackTab">
        <div class="scroller">
          <ul class="clearfix">
            <li v-for="(item,index) in list" :i="index"><a href="javascript:void(0)">{{item.name}}<span v-if="item.number*1 > 0">{{item.number}}</span></a></li>
          </ul>
        </div>
      </div>
      <div id="screen" v-if="tabShow == 0">
        <div class="screenAddre">
            <div class="startAddre">
               <div class="addresscheck" @click="checkAddress(0)" v-html="searchList.startAdd == '' ? '全国' : searchList.startAdd "></div>
            </div>
            <img src="../images/arrow.png">
            <div class="startAddre">
              <div class="addresscheck" @click="checkAddress(1)" v-html="searchList.endAdd == '' ? '全国' : searchList.endAdd "></div>
            </div>
           <div class="clearBoth"></div>
        </div>
        <div class="screenDistance">
          <div class="distanceLine"></div>
          <div class="dist">
            <p v-html="searchList.distance == '' ? '运输距离' : searchList.distanceName " @click="checkdistance()"></p>
          </div>
        </div>
        <div class="clearBoth"></div>
      </div>
      <div v-for="(item,index) in list" :id="'mescroll' + index" :class="index != tabShow ? 'hide' :''" class="mescroll" :style="{top:index == 0 ? '2.8rem' : '1.3rem'}">
        <ul :id="'dataList' + index" class="data-list">
          <li v-for="(items,indexs) in item.prolist" @click="lookTrackMore(items)">
            <h3>￥{{items.price*1}}</h3>
            <h6 class="deliDateTime">{{items.deliDate}}</h6>
            <h6 class="arriDateTime">{{items.arriDate}}</h6>
            <div class="proBox">
              <div class="qiangRobbing">抢单</div>
              <p class="startEnd"><span class="startEndSpan">{{items.deliAddr}}<img src="../images/addressImg.png">{{items.arriAddr}}</span><div class="clearBoth"></div></p>
              <div class="proBoxList transType">{{items.transType}}/{{items.goodCode}}</div>
              <div class="proBoxList wvolume"><span>{{items.num}}件</span><span  v-if="items.weight*1 > 0">/{{items.weight*1}}吨</span><span v-if="items.volume*1 > 0">/{{items.volume*1}}立方米</span></div>
            </div>
            <h1>{{items.customer}}</h1>
          </li>
        </ul>
      </div>
    </div>
    <footComponent ref="footcomponent" :idx='0'></footComponent>
    <transition name="slide-fade">
      <div id="screenDistanceBox" v-if="screenDistanceTrue">
        <div id="screenDistanceBody">
          <img src="../images/closed2.png" @click="screenDistanceTrueClick(false)">
          <p>选择运输距离<span>（公里）</span></p>
          <ul>
            <li v-for="(item,index) in distanceList" @click="distanceListChecked(index)" :class="item.checked ? 'distanceListcheckTrue': ''" :style="{marginRight : index % 4 != 3 ? '0.25rem' : '0'}">{{item.name}}</li>
            <div class="clearBoth"></div>
          </ul>
          <div class="screenDistanceCheck">
            <h6>只看零担货源</h6>
            <div class="screenDistanceCheckFalse" @click="screenDistanceCheckFalse()" :class="zeroload ? 'screenDistanceCheckTrue': ''"></div>
            <div class="clearBoth"></div>
          </div>
           <div class="screenDistanceButton">
             <button @click="screenDistanceReset()">重置</button>
             <button @click="screenDistanceTrueClick(true)">确定</button>
             <div class="clearBoth"></div>
           </div>
        </div>
      </div>
      <div id="screenAddressBox" v-if="screenAddressTrue">
        <div id="screenAddressBody">
          <img src="../images/closed2.png"  @click="hotAddressListno()">
          <p>选择地址</p>
           <h6 v-if="normalCityList.length > 0" @click="normalCityGoback()">返回</h6>
           <div class="checkedAddress" v-if="normalCityList.length > 0">
            <h1>已选择</h1>
            <ul>
              <li v-html="addtype == 0 ? searchList.searchStartPro : searchList.searchEndPro"></li>
              <div class="clearBoth"></div>
            </ul>
          </div>
          <div class="hotAddress" v-if="normalCityList.length == 0">
            <h1>热门城市</h1>
            <ul>
              <li v-for="(item ,index) in hotAddressList"  :class="item.checked ? 'addCheckTrue' : ''" @click="hotAddressListChoose(item,0)">{{item.name}}</li>
              <div class="clearBoth"></div>
            </ul>
          </div>
          <div class="hotAddress" v-if="normalCityList.length == 0">
            <h1>选择省</h1>
            <ul>
              <li v-for="(item ,index) in normalAddressList" @click="chooseProvince(item,index)">{{item.region}}</li>
              <div class="clearBoth"></div>
            </ul>
          </div>
          <div class="hotAddress" v-if="normalCityList.length > 0">
            <h1>选择市</h1>
            <ul>
              <li v-for="(item ,index) in normalCityList" :class="item.checked ? 'addCheckTrue' : ''" @click="hotAddressListChoose(item,1)">{{item.region}}</li>
              <div class="clearBoth"></div>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import "../js/navbarscroll";
  import {androidIos} from "../js/app";
  import {bomb} from "../js/zujian";
  import bridge from '../js/bridge';
  import MeScroll from '../js/mescroll'
  import {iscroll} from '../js/iscroll'
  import {provinceCityArea} from "../js/provinceCityArea";
  export default {
    name: "robbingList",
    data(){
      return{
        list:[{
          name:"抢单",
          number:0,
          prolist:[]
        },{
          name:"指派订单",
          number:0,
          prolist:[]
        }],
        searchList:{
          startAdd:"",
          endAdd:"",
          distance:"",
          distanceName:"",
          zeroload:false,
          searchStartPro:"",
          searchEndPro:"",
        },
        tabShow:0,
        mescrollArrList:null,
        screenDistanceTrue:false,
        screenAddressTrue:false,
        zeroload:false,
        distanceList:[{
          name:"不限",
          value:"0",
          checked:false,
        },{
          name:"0-200",
          value:"0-200",
          checked:false,
        },{
          name:"200-500",
          value:"200-500",
          checked:false,
        },{
          name:"500-1000",
          value:"500-1000",
          checked:false,
        },{
          name:"1000以上",
          value:"1000",
          checked:false,
        }],
        hotAddressList:[{
          name:"北京市",
          region:"北京市",
          chescked:false,
        },{
          name:"上海市",
          region:"上海市",
          chescked:false,
        },{
          name:"广州市",
          region:"广州市",
          chescked:false,
        },{
          name:"深圳市",
          region:"深圳市",
          chescked:false,
        },{
          name:"杭州市",
          region:"杭州市",
          chescked:false,
        },{
          name:"南京市",
          region:"南京市",
          chescked:false,
        },{
          name:"苏州市",
          region:"苏州市",
          chescked:false,
        },{
          name:"天津市",
          region:"天津市",
          chescked:false,
        },{
          name:"武汉市",
          region:"武汉市",
          chescked:false,
        },{
          name:"长沙市",
          region:"长沙市",
          chescked:false,
        },{
          name:"重庆市",
          region:"重庆市",
          chescked:false,
        },{
          name:"成都市",
          region:"成都市",
          chescked:false,
        },{
          name:"全国",
          region:"",
          chescked:false,
        }],
        normalAddressList:[],
        normalCityList:[],
        searchStartPro:"",
        searchEndPro:"",
        addtype:0,
      }
    },
    mounted:function () {
      var _this = this;
      sessionStorage.removeItem("weh");
      sessionStorage.removeItem("nowOrderCartype");
      sessionStorage.removeItem("dataStart");
      sessionStorage.removeItem("dataEnd");
      sessionStorage.removeItem("orderPk");
      sessionStorage.removeItem("dispatchPK");
      sessionStorage.removeItem("carPKlistGo");
      sessionStorage.removeItem("driverPk");
      var SCREENROBBING = localStorage.getItem("SCREENROBBING");
      if(SCREENROBBING != null){
         _this.searchList = JSON.parse(SCREENROBBING);
      }
      _this.normalAddressList = provinceCityArea;
      androidIos.bridge(_this);
    },
    methods:{
      go:function () {
        var _this = this;
        var robbingTap = sessionStorage.getItem("robbingTap");
        if(robbingTap != undefined){
          _this.tabShow = robbingTap*1;
        }
        $('.wrapper').navbarscroll({defaultSelect:_this.tabShow});
        var curNavIndex = _this.tabShow;//首页0; 奶粉1; 面膜2; 图书3;
        var mescrollArr=new Array(_this.list.length);//4个菜单所对应的4个mescroll对象
        //初始化首页
        mescrollArr[_this.tabShow]=initMescroll("mescroll" + _this.tabShow, "dataList" + _this.tabShow);
        _this.mescrollArrList = mescrollArr;
        /*初始化菜单*/
        $("#trackTab li").click(function(){
          var i=Number($(this).attr("i"));
          sessionStorage.setItem("robbingTap",i);
          _this.tabShow = i;
          if(curNavIndex!=i) {
            //更改列表条件
            //隐藏当前列表和回到顶部按钮
            $("#mescroll"+curNavIndex).hide();
            mescrollArr[curNavIndex].hideTopBtn();
            //显示对应的列表
            $("#mescroll"+i).show();
            //取出菜单所对应的mescroll对象,如果未初始化则初始化
            if(mescrollArr[i]==null){
              mescrollArr[i]=initMescroll("mescroll"+i, "dataList"+i);
              _this.mescrollArrList = mescrollArr;
            }else{
              //检查是否需要显示回到到顶按钮
              var curMescroll=mescrollArr[i];
              var curScrollTop=curMescroll.getScrollTop();
              if(curScrollTop>=curMescroll.optUp.toTop.offset){
                curMescroll.showTopBtn();
              }else{
                curMescroll.hideTopBtn();
              }
            }
            //更新标记
            curNavIndex=i;
          }
        })

        /*创建MeScroll对象*/
        function initMescroll(mescrollId,clearEmptyId){
          //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
          var mescroll = new MeScroll(mescrollId, {
            //上拉加载的配置项
            up: {
              callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
              isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
              noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
              empty: {
                icon: require("../images/nojilu.png"),
                tip: "暂无订单", //提示
              },
              clearEmptyId: clearEmptyId, //相当于同时设置了clearId和empty.warpId; 简化写法;默认null; 注意vue中不能配置此项
              toTop:{ //配置回到顶部按钮
                src :require("../images/scrollTop.png"), //默认滚动到1000px显示,可配置offset修改
                //offset : 1000
              },
              lazyLoad: {
                use: true // 是否开启懒加载,默认false
              }
            }
          });
          return mescroll;
        }

        /*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
        function getListData(page){
          //联网加载数据
          var dataIndex=curNavIndex; //记录当前联网的nav下标,防止快速切换时,联网回来curNavIndex已经改变的情况;
          getListDataFromNet(dataIndex, page.num, page.size, function(pageData){
            mescrollArr[dataIndex].endSuccess(pageData.length);
            setListData(pageData,dataIndex);
          }, function(){
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            mescrollArr[dataIndex].endErr();
          });
        }
        function setListData(pageData,dataIndex){
          for (var i = 0; i < pageData.length; i++) {
            _this.list[dataIndex].prolist.push(pageData[i]);
          }
        }
        function getListDataFromNet(curNavIndex,pageNum,pageSize,successCallback,errorCallback) {
          //延时一秒,模拟联网
          setTimeout(function () {
            if(pageNum == 1){
              _this.$refs.footcomponent.go();
            }
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + "/order/loadSegment",
              data:JSON.stringify({
                page:pageNum,
                size:pageSize,
                type:curNavIndex,
                userCode:sessionStorage.getItem("token"),
                source:sessionStorage.getItem("source"),
                startCity:curNavIndex == 0 ? _this.searchList.startAdd : "",
                endCity:curNavIndex == 0 ? _this.searchList.endAdd : "",
                transType:curNavIndex == 0 ? (_this.searchList.zeroload ? 1 : 0) : "",
                range:curNavIndex == 0 ?_this.searchList.distance : "", //不传
                pkTransType:"",//不传
                gta: "",
                lta: "",
              }),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 30000,
              success: function (loadEntrust) {
                if (loadEntrust.success == "1") {
                  successCallback(loadEntrust.list);
                }else{
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
          },100)
        }
      },
      checkAddress:function (type) {
        var _this = this;
        _this.screenAddressTrue = true;
        _this.addtype = type;
        _this.normalCityList = [];
        for(var i =0 ; i < _this.hotAddressList.length;i++){
          _this.hotAddressList[i].checked = false;
        }
        for(var i =0 ; i < _this.normalCityList.length;i++){
          _this.normalCityList[i].checked = false;
        }
        if(type == 0){
          _this.searchStartPro =  _this.searchList.searchStartPro;
          if(_this.searchList.startAdd != "" && _this.searchList.searchStartPro == ""){
            for(var i = 0; i < _this.hotAddressList.length;i++){
              _this.hotAddressList[i].checked = false;
              if(_this.hotAddressList[i].region == _this.searchList.startAdd){
                _this.hotAddressList[i].checked = true;
              }
            }
          }else if( _this.searchList.searchStartPro != ""){
            for(var i = 0 ; i < _this.normalAddressList.length ; i++){
              if(_this.searchList.searchStartPro == _this.normalAddressList[i].region){
                 _this.normalCityList = _this.normalAddressList[i].child;
                 break;
              }
            }
            for(var i = 0 ; i < _this.normalCityList.length ; i++){
              _this.normalCityList[i].checked = false;
               if(_this.searchList.startAdd == _this.normalCityList[i].region){
                 _this.normalCityList[i].checked = true;
               }
            }
          }
        }else if(type == 1){
          _this.searchEndPro =  _this.searchList.searchEndPro;
          if(_this.searchList.endAdd != "" && _this.searchList.searchEndPro == ""){
            for(var i = 0; i < _this.hotAddressList.length;i++){
              _this.hotAddressList[i].checked = false;
              if(_this.hotAddressList[i].region == _this.searchList.endAdd){
                _this.hotAddressList[i].checked = true;
              }
            }
          }else if( _this.searchList.searchEndPro != ""){
            for(var i = 0 ; i < _this.normalAddressList.length ; i++){
              if(_this.searchList.searchEndPro == _this.normalAddressList[i].region){
                _this.normalCityList = _this.normalAddressList[i].child;
                break;
              }
            }
            for(var i = 0 ; i < _this.normalCityList.length ; i++){
              _this.normalCityList[i].checked = false;
              if(_this.searchList.endAdd == _this.normalCityList[i].region){
                _this.normalCityList[i].checked = true;
              }
            }
          }
        }

      },
      hotAddressListno:function () {
        var _this = this;
        _this.screenAddressTrue = false;
        if(_this.addtype == 0){
          _this.searchList.searchStartPro = _this.searchStartPro;
        }else if(_this.addtype == 1){
          _this.searchList.searchEndPro = _this.searchEndPro;
        }
      },
      chooseProvince:function (item,index) {
        var _this = this;
        for(var i = 0; i < _this.normalAddressList.length; i++){
          _this.normalAddressList[i].checked = false;
        }
        _this.normalAddressList[index].checked = true;
        _this.normalCityList = item.child;
        for(var i =0 ; i < _this.normalCityList.length;i++){
          _this.normalCityList[i].checked = false;
        }
        if(_this.addtype == 0){
          _this.searchList.searchStartPro = item.region;
        }else if(_this.addtype == 1){
          _this.searchList.searchEndPro = item.region;
        }
      },
      normalCityGoback:function () {
        var _this = this;
        for(var i = 0; i < _this.normalAddressList.length; i++){
          _this.normalAddressList[i].checked = false;
        }
        _this.normalCityList = [];
        if(_this.addtype == 0){
          _this.searchList.searchStartPro = "";
        }else if(_this.addtype == 1){
          _this.searchList.searchEndPro = "";
        }
      },
      hotAddressListChoose:function (item,type) {
        var _this = this;
        if(_this.addtype == 0){
          _this.searchList.startAdd = item.region;
          if(type == 0){
            _this.searchList.searchStartPro = "";
          }
        }else if(_this.addtype == 1){
          _this.searchList.endAdd = item.region;
          if(type == 0){
            _this.searchList.searchEndPro = "";
          }
        }
        for(var i =0 ; i < _this.hotAddressList.length;i++){
          _this.hotAddressList[i].checked = false;
        }
        for(var i =0 ; i < _this.normalCityList.length;i++){
          _this.normalCityList[i].checked = false;
        }
        item.checked = true;
        _this.screenAddressTrue = false;
        _this.mescrollArrList[0].resetUpScroll();
        localStorage.setItem("SCREENROBBING",JSON.stringify(_this.searchList))
      },
      checkdistance:function () {
        var _this = this;
        _this.screenDistanceTrue = true;
        for(var i = 0;i < _this.distanceList.length ; i++){
          if(_this.distanceList[i].value == _this.searchList.distance){
            _this.distanceList[i].checked = true;
          }
        }
        _this.zeroload = _this.searchList.zeroload;
       /* _this.mescrollArrList[0].resetUpScroll();*/
      },
      distanceListChecked:function (number) {
         var _this = this;
        for(var i = 0;i < _this.distanceList.length ; i++){
          _this.distanceList[i].checked = false;
        }
        _this.distanceList[number].checked = true;
      },
      screenDistanceReset:function () {
        var _this = this;
        for(var i = 0;i < _this.distanceList.length ; i++){
          _this.distanceList[i].checked = false;
        }
        _this.zeroload = false;
      },
      screenDistanceCheckFalse:function () {
        var _this = this;
        _this.zeroload = !_this.zeroload;
      },
      screenDistanceTrueClick:function (type) {
        var _this = this;
        _this.screenDistanceTrue = false;
        var list = [];
        var listName = [];
        for(var i = 0;i < _this.distanceList.length ; i++){
          if(_this.distanceList[i].checked){
            list.push(_this.distanceList[i].value);
            listName.push(_this.distanceList[i].name);
            _this.distanceList[i].checked = false;
          }
        }
        if(type){
          _this.searchList.distance = list.join(",");
          _this.searchList.distanceName = listName.join(",");
          _this.searchList.zeroload = _this.zeroload;
          _this.zeroload = false;
          _this.mescrollArrList[0].resetUpScroll();
          localStorage.setItem("SCREENROBBING",JSON.stringify(_this.searchList))
        }
      },
      lookTrackMore:function (item) {
        var _this = this;
        androidIos.addPageList();
        _this.$router.push({ path: '/robbing/robbingMore',query:{pk:item.pkSegment,type:_this.tabShow == 0 ? 1 : 2}});
      },
    },
    beforeDestroy:function () {
      var _this = this;
      var body = document.getElementsByTagName("body")[0];
      var listDom=document.getElementsByClassName("mescroll-totop")[0];
      if(listDom != null){
        body.removeChild(listDom);
      }
    },
    destroy:function () {
      var _this = this;
      var body = document.getElementsByTagName("body")[0];
      var listDom=document.getElementsByClassName("mescroll-totop")[0];
      if(listDom != null){
        body.removeChild(listDom);
      }
    }
  }
</script>
<style>
  @import "../css/mescroll.css";
  @import "../css/scroll.css";
  #robbingList .hide{
    display: none;
  }
</style>
<style scoped>
  #screen{
    width:100%;
    height:1.35rem;
    background-color: white;
    border-bottom: 0.15rem solid #f6f6f6;
  }
  .screenAddre{
    float: left;
    width:6.7rem;
  }
  .screenDistance{
    float: left;
    width:3.3rem;
    line-height: 1.3rem;
    position: relative;
  }
  .screenDistance p{
    display: inline-block;
    font-size:0.4rem ;
    max-width: 2rem;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    background-image: url("../images/dropDown.png");
    background-size:0.22rem ;
    background-repeat: no-repeat;
    background-position: 100% 50%;
    padding-right: 0.3rem;
  }
  .dist{
    width:100%;
    float: left;
    line-height: 1.3rem;
    position: relative;
    font-size:0.4rem ;
    color:#333;
    text-align: center;
    display: inline-block;
  }
  .distanceLine{
    position: absolute;
    width:1px;
    background-color: #333;
    height:0.82rem;
    left:0;
    top:39%;
    margin-top: -0.41rem;
  }
  .startAddre{
     width:46.6%;
     float: left;
    line-height: 1.3rem;
    position: relative;
    font-size:0.4rem ;
    color:#333;
    text-align: center;
    display: inline-block;
  }
  .addresscheck{
    display: inline-block;
    font-size:0.4rem ;
    max-width: 2rem;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    background-image: url("../images/dropDown.png");
    background-size:0.22rem ;
    background-repeat: no-repeat;
    background-position: 100% 50%;
    padding-right: 0.3rem;
  }
  .screenAddre img{
    width:6.8%;
    float: left;
    margin-top: 0.573rem;
  }
  #robbingList{
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
    height: 1.3rem;
    width: 100%;
    margin:0 auto;
    background: -webkit-linear-gradient(left, #00C4FF , #0074FF); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #00C4FF, #0074FF); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #00C4FF, #0074FF); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #00C4FF , #0074FF); /* 标准的语法 */
  }
  .wrapper .scroller {
    position:absolute;
  }
  .wrapper .scroller li {
    height: 1.3rem;
    color:#373737;
    float: left;
    line-height: 1.3rem;
    font-size: .4rem;
    text-align: center;
    width:5rem;
  }
  .wrapper .scroller li a{
    color:#6DCFF8;
    display:block;
    font-size: 0.35rem;
    margin:0 0.1rem;
  }
  .wrapper .scroller li a span{
    color:#77B6F8;
    font-size: 0.3125rem;
  }
  .wrapper .scroller li.cur a{
    color:#fff;
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
  .qiangRobbing{
     position: absolute;
    right:0.2rem;
    width:1.4rem;
    height: 1.4rem;
    background-color: #2c9cff;
    color:white;
    top:50%;
    margin-top: -0.7rem;
    border-radius: 50%;
    line-height: 1.4rem;
    text-align: center;
    font-size: 0.375rem;
    box-shadow: 0 0 10px #2c9cff;
  }
  .startEndSpan{
    float: left;
    font-size: 0.44rem;
    font-weight:bold;
    line-height: 0.56rem;
    color:#333;
    margin-bottom: 0.25rem;

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
  #screenDistanceBox,#screenAddressBox{
    position: fixed;
    top:0;
    bottom: 0;
    left:0;
    right:0;
    height:auto;
    width:auto;
    background-color: rgba(0,0,0,0.3);
  }
  #screenDistanceBody{
    position: absolute;
    top:2.6rem;
    width:98%;
    left:1%;
    border-radius:0.4rem ;
    min-height: 2rem;
    background: white;
  }
  #screenAddressBody{
    position: absolute;
    bottom:0rem;
    width:98%;
    left:1%;
    border-top-left-radius:0.4rem ;
    border-top-right-radius:0.4rem ;
    min-height: 2rem;
    background: white;
  }
  #screenDistanceBody img,#screenAddressBody img{
    position: absolute;
    width:0.3rem;
    top:0.4rem;
    right:0.4rem;
  }
  #screenAddressBody h6{
    position: absolute;
    font-size: 0.35rem;
    top:0.25rem;
    left:0.4rem;
    color:#999;
  }
  #screenDistanceBody p,#screenAddressBody p{
    text-align: center;
    font-size: 0.43rem;
    color:#333;
    margin-top:0.15rem ;
  }
  #screenDistanceBody p span, #screenAddressBody p span{
    font-size: 0.43rem;
    color:#999;
  }
  #screenDistanceBody ul{
    width:9rem;
    margin: 0.5rem  auto 0 auto;
    border-bottom: 1px solid #e6e6e6;
  }
  #screenDistanceBody li{
    float: left;
    width:2rem;
    border: 1px solid #e6e6e6;
    text-align: center;
    line-height: 0.7rem;
    border-radius: 0.1rem;
    color:#333;
    font-size: 0.35rem;
    margin-bottom: 0.35rem;
  }
  .marginRight{
    margin-right: 0.25rem;
  }
  .screenDistanceCheck{
    width:9rem;
    margin: 0.4rem  auto 0 auto;
    border-top: 1px solid white;
  }
  .screenDistanceCheck h6{
     float: left;
     font-size: 0.375rem;
     color:#333;
    line-height: 0.375rem;
  }
  .distanceListcheckTrue{
    border:1px solid #2c9cff!important;
    background-image: url("../images/checkdistance.png");
    background-position: 102% 102%;
    background-size: 0.4rem;
    background-repeat: no-repeat;
  }
  .screenDistanceCheckFalse{
      width:0.42rem;
      height: 0.42rem;
      border-radius: 0.22rem;
      border:1px solid #999;
      margin-top: -0.06rem;
      float: right;
  }
  .screenDistanceButton{
    width:9rem;
    margin: 0.96rem  auto 0.3334rem auto;
  }
  .screenDistanceButton button:nth-child(1){
    width:2.32rem;
    height:1.1rem;
    border: 1px solid #2c9cff;
    color:#2c9cff;
    border-radius: 0.15rem;
    background-color: transparent;
    font-size: 0.45rem;
    float: left;
  }
  .addCheckTrue{
    color:#2c9cff!important;
  }
  .screenDistanceButton button:nth-child(2){
    width:6.46rem;
    height:1.1rem;
    border: 1px solid #2c9cff;
    color:#fff;
    border-radius: 0.15rem;
    background-color: #2c9cff;
    font-size: 0.45rem;
    float: right;
  }
  .screenDistanceCheckTrue{
     border: 1px solid #2c9cff!important;
    background-image: url("../images/screenDistanceCheckFalse.png");
    background-repeat: no-repeat;
    background-size:0.25rem;
    background-position: 50% 50%;
    background-color: #2c9cff;
  }
  .hotAddress,.checkedAddress{
    width:9rem;
    margin: 0.3rem  auto 0.3334rem auto;
  }
  .hotAddress h1,.checkedAddress h1{
     font-size: 0.35rem;
     color:#999;
    margin-bottom: 0.15rem;
  }
  .hotAddress ul{
    width:100%;
    max-height: 7.5rem;
    overflow: scroll;
  }
  .checkedAddress ul{
    width:100%;
    max-height: 7.5rem;
    overflow: scroll;
    background-color: #FAFAFA;
  }
  .checkedAddress li{
    min-width:20%;
    margin-left:2.5%;
    float: left;
    text-align: left;
    font-size: 0.35rem;
    line-height: 0.8rem;
  }
  .hotAddress li{
     float: left;
     width:20%;
    margin: 0 2.5%;
    text-align: center;
    font-size: 0.35rem;
    line-height: 0.8rem;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
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
</style>
