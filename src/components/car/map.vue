<template>
  <div id="carmap">
    <div id="title" v-title data-title="地图" v-if="navShow"></div>
    <div id="container"></div>
    <div id="panel"></div>
  </div>
</template>
<script>
  import AMap from 'AMap'
  import {androidIos} from "../../js/app";
  export default {
    data(){
      return{
        navShow:false,
        startJ :sessionStorage.getItem("dataStart") == "" || sessionStorage.getItem("dataStart") == null || sessionStorage.getItem("dataStart") == "null"? "" :sessionStorage.getItem("dataStart").split(",")[0],
        startW :sessionStorage.getItem("dataStart") == "" || sessionStorage.getItem("dataStart") == null || sessionStorage.getItem("dataStart") == "null" ? "" :sessionStorage.getItem("dataStart").split(",")[1],
        endJ:sessionStorage.getItem("dataEnd") == "" || sessionStorage.getItem("dataEnd") == null || sessionStorage.getItem("dataEnd") == "null" ? "" :sessionStorage.getItem("dataEnd").split(",")[0],
        endW:sessionStorage.getItem("dataEnd") == "" || sessionStorage.getItem("dataEnd") == null || sessionStorage.getItem("dataEnd") == "null" ? "" :sessionStorage.getItem("dataEnd").split(",")[1],
        peopleJ:120.40,
        peopleW:30.26,
        setTimeSS:"",
        json:{
          userCode:sessionStorage.getItem("token"),
          source:sessionStorage.getItem("source"),
          pk:sessionStorage.getItem("driverPk"),
        },
        map:null,
      }
    },
    mounted: function () {
      var _this = this;
      androidIos.bridge(_this);
    },
    methods: {
      go:function () {
        var _this = this;
        var http = window.location.href;
        if(http.indexOf("/car/map")!=-1){
          _this.navShow = true;
          $("#carmap .amap-zoomcontrol").show();
        }
        _this.init();
      },
      init: function () {
        var _this = this;
        if(_this.startJ!=""&&_this.startW!=""){
          _this.map  = new AMap.Map("container", {});
          //构造路线导航类
          //构造路线导航类
          _this.peopleAddress();
          _this.setTimeSS = setInterval(function () {
            _this.peopleAddress();
          },20000)
        }
      },
      peopleAddress:function () {
        var _this = this;
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp()+"/order/getLocation",
          data:JSON.stringify(_this.json),
          dataType: "json",
          contentType: "application/json;charset=utf-8",
          timeout: 30000,
          success: function (getLocation) {
            if(getLocation.success == "1"){
              _this.peopleJ = getLocation.errorCode == "" ? "12" : getLocation.errorCode.split(",")[0];
              _this.peopleW = getLocation.errorCode == "" ? "3" : getLocation.errorCode.split(",")[1];
              _this.mapGo();
            }else{
              androidIos.second(getLocation.message);
            }
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            _this.cancelReasonBox = false;
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("网络请求超时");
            }else if(status=='error'){
              androidIos.errorwife();
            }
          }
        });
      },
      mapGo:function () {
        var _this = this;
        var truckOptions = {
          map:_this.map,
          policy:0,
          size:1,
          city:'beijing',
          panel:'panel',
          province:"",
          number:""
        };
        _this.map.clearMap();
        var driving = new AMap.TruckDriving(truckOptions);
        var path = [];
        path.push({lnglat:[_this.peopleJ, _this.peopleW]});//起点
        path.push({lnglat:[_this.startJ,_this.startW]});//途径
        driving.search(path, function(status, result) {
          var marker5;
          marker5 = new AMap.Marker({
            icon:require('../../images/start1.png'),
            position: [_this.peopleJ, _this.peopleW],
          });
        marker5.setMap(_this.map);
          var marker7;
          marker7 = new AMap.Marker({
            icon:require('../../images/end1.png'),
            position: [_this.startJ,_this.startW],
          });
        marker7.setMap(_this.map);
        });
      }
    },
    updated:function () {
      var _this = this;
      var http = window.location.href;
      if(http.indexOf("/car/map")!=-1){
        _this.navShow = true;
        $("#carmap .amap-zoomcontrol").show();
      }
    },
    destroyed:function () {
      var _this = this;
      clearInterval( _this.setTimeSS );
    }
  }
</script>
<style scoped>
  #panel {
    position: fixed;
    background-color: white;
    max-height: 90%;
    overflow-y: auto;
    top: 10px;
    right: 10px;
    width: 280px;
    display: none!important;
  }
</style>
