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
        }
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
          var map  = new AMap.Map("container", {});
          //构造路线导航类
          var truckOptions = {
            map:map,
            policy:0,
            size:1,
            city:'beijing',
            panel:'panel',
            province:"",
            number:""
          };
          //构造路线导航类
          var driving = new AMap.TruckDriving(truckOptions);
          var path = [];
          path.push({lnglat:[_this.startJ, _this.startW]});//起点
          path.push({lnglat:[_this.endJ,_this.endW]});//途径
          driving.search(path, function(status, result) {
            var marker;
            marker = new AMap.Marker({
              icon:require('../../images/end1.png'),
              position: [_this.startJ, _this.startW],
            });
            marker.setMap(map);
            var marker1;
            marker1 = new AMap.Marker({
              icon:require('../../images/end.png'),
              position: [_this.endJ,_this.endW],
            });
            marker1.setMap(map);
          });
        }
      },
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
