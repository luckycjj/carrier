<template>
  <div id="user" style="top:1.3rem;">
    <div id="title" v-title data-title="个人中心"></div>
    <div id="userBox">
       <div id="head">
         <div id="photo" class="imgBox">
           <img :src="message.photo"   :onerror="errorlogo">
           <input type="file" @change="imgChange($event)">
         </div>
         <div style="float: left;width:50%;">
           <p>{{message.name}}</p>
           <h1 v-html="message.status == '0' ? '未认证' :message.status == '1' ? '待审核' : message.status == '2' ? '已审核' : message.status == '3' ? '已驳回' : message.status == '4' ? '已禁用' : ''"></h1>
         </div>
        <div class="lookMore"  @click="lookMore('/statusNow')"><span v-if="message.status == 0">去认证</span></div>
         <div class="clearBoth"></div>
       </div>
       <ul>
         <li @click="lookMore(item.url)" v-for="(item,index) in tabList" :class="index % 2 == 0 ? (tabList.length -1 == index ? 'marTop' : 'marTop borderShow') : ''">
           <div class="tableIcon" :style="{backgroundImage:'url(' + item.icon + ')'}"></div>
           <p>{{item.name}}</p>
           <div class="lookMore"></div>
           <div class="clearBoth"></div>
         </li>
       </ul>
    </div>
    <footComponent :idx='2'></footComponent>
    <transition name="slide-fade">
        <div id="shareBox" v-if="shareListTrue">
          <div id="shareBody">
            <div id="shareBodyTab">
              <p>分享至...</p>
              <a @click="shareType(index)" :style="{width:100 / shareList.length + '%'}" v-for="(item,index) in shareList">
                <img :src="item.icon" >
                <h6>{{item.name}}</h6>
              </a>
              <div class="clearBoth"></div>
            </div>
            <button @click="shareYes(false)">取消</button>
          </div>
        </div>
    </transition>
  </div>
</template>

<script>
    import {androidIos} from "../js/app";
    import {bomb} from "../js/zujian";
    import bridge from '../js/bridge';
    export default {
        name: "user",
        data(){
           return{
              message:{
                 photo :null,
                 name : "",
                 status : "",
              },
             shareList:[{
                 name:"微信",
                 icon:require("../images/weChat.png"),
             },{
               name:"朋友圈",
               icon:require("../images/friendCircle.png"),
             },{
               name:"短信",
               icon:require("../images/shortMessage.png"),
             }],
             tabList:[{
               name:"车辆列表",
               icon:require("../images/carlist.png"),
               url:"/site/car"
             },{
               name:"司机列表",
               icon:require("../images/driverlist.png"),
               url:"/car/changeCarpeople"
             },{
               name:"司机申请",
               icon:require("../images/driverAgreeList.png"),
               url:"/agreeToRefuse"
             },{
               name:"消息",
               icon:require("../images/messageList.png"),
               url:"/message"
             },{
               name:"分享",
               icon:require("../images/share.png"),
               url:""
             },{
               name:"建议反馈",
               icon:require("../images/feedback.png"),
               url:"/suggestion"
             },{
               name:"关于我们",
               icon:require("../images/aboutUs.png"),
               url:"/aboutUs"
             }],
             errorlogo: 'this.src="' + require('../images/userImg.png') + '"',
             httpurl:"",
             shareListTrue:false,
           }
        },
      mounted:function () {
        var _this = this;
        var carrierMessage = sessionStorage.getItem("carrierMessage");
        androidIos.judgeIphoneX("userBox",1);
        androidIos.judgeIphoneX("user",2);
        if(carrierMessage != null) {
          carrierMessage = JSON.parse(carrierMessage);
          _this.message.photo = carrierMessage.photo;
          _this.message.name = carrierMessage.name;
          _this.message.status = carrierMessage.status;
        }
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/getUserInfo",
            data:JSON.stringify({
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source")
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            success: function (getUserInfo) {
              if (getUserInfo.success == "1") {
                _this.message.photo =  getUserInfo.photo;
                _this.message.name = getUserInfo.corpName == "" ? getUserInfo.name :getUserInfo.corpName;
                _this.message.status =   getUserInfo.status;
                sessionStorage.setItem("carrierMessage",JSON.stringify({
                  licType: getUserInfo.licType,
                  name:  getUserInfo.name,
                  photo:  getUserInfo.photo,
                  status:  getUserInfo.status,
                  corpName:  getUserInfo.corpName,
                }));
              }else{
                androidIos.second(getUserInfo.message);
              }
            },
            complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
              if (status == 'timeout') { //超时,status还有success,error等值的情况
                androidIos.second("当前状况下网络状态差，请检查网络！");
              } else if (status == "error") {
                androidIos.errorwife();
              }
            }
          });

        androidIos.bridge(_this);
      },
      methods:{
        go:function () {
          var _this = this;
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/settings/findParamValueByName ",
            data: JSON.stringify({
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source"),
              paramName:"resourcePath"
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout:30000,
            success: function(findParamValueByName){
              if(findParamValueByName.success == "1"){
                _this.httpurl = findParamValueByName.paramValue;
              }else{
                androidIos.second(findParamValueByName.message);
              }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
              if(status=='timeout'){//超时,status还有success,error等值的情况
                androidIos.second("当前状况下网络状态差，请检查网络！")
              }else if(status=="error"){
                androidIos.errorwife();
              }
            }
          });
        },
        lookMore:function (url) {
          var _this = this;
          if(url != ""){
            androidIos.addPageList();
            _this.$router.push({ path: url});
          }else{
           _this.shareListTrue = true;
            _this.$nextTick(function () {
              androidIos.judgeIphoneX("shareBody",1);
            })
          }
        },
        shareYes:function (type) {
          var _this = this;
          _this.shareListTrue = type;
        },
        shareType:function (index) {
          var _this = this;
          if(index == 0 || index == 1){
            try{
              var wx = api.require('wx');
              wx.isInstalled(function(ret, err) {
                if (ret.installed) {
                  wx.shareWebpage({
                    apiKey: '',
                    scene:index == 0 ? 'session' : 'timeline',
                    title: '欣阳物流',
                    description: '欣阳物流',
                    thumb: require("../images/logo.png"),
                    contentUrl: 'http://www.xsungroup.com/'
                  }, function(ret, err) {
                    if (ret.status) {
                      _this.$cjj('分享成功');
                    } else {
                      androidIos.second(err.code);
                    }
                  });
                } else {
                  androidIos.second('当前设备未安装微信客户端');
                }
              });
            }
            catch(e){
              androidIos.second("浏览器暂不支持分享");
            }
          }else if(index == 2){
            var u = navigator.userAgent;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
            //android终端
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            var name = "http://www.xsungroup.com/";
            var tel= "";
            if(isiOS){
              document.getElementsByTagName('a')[index].href="sms://"+tel+"&body="+name;
            }
            else{
              document.getElementsByTagName('a')[index].href="sms://"+tel+"?body="+name;
            }
          }
        },
        imgChange:function (e) {
          var _this = this;
          androidIos.loading("正在上传");
          for (var i = 0; i < e.target.files.length; i++) {
            window.URL = window.URL || window.webkitURL;
            var xhr = new XMLHttpRequest();
            xhr.open("get", _this.getObjectURL(e.target.files[i]), true);
            // 至关重要
            xhr.responseType = "blob";
            xhr.onload = function () {
              if (this.status == 200) {
                //得到一个blob对象
                var blob = this.response;
                // 至关重要
                let oFileReader = new FileReader();
                oFileReader.onloadend = function (e) {
                  let base64 = e.target.result;
                  $.ajax({
                    type: "POST",
                    url: androidIos.ajaxHttp() + "/uploadFile",
                    data:JSON.stringify({
                      type: "TX" ,
                      file: base64.substr(23),
                      userCode:sessionStorage.getItem("token"),
                      source:sessionStorage.getItem("source")
                    }),
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    async:false,
                    timeout: 30000,
                    success: function (json) {
                      if (json.success == "1") {
                        var photoUrl = json.path;
                        $.ajax({
                          type: "POST",
                          url: androidIos.ajaxHttp() + "/uploadAvatar",
                          data:JSON.stringify({
                            path:photoUrl,
                            userCode:sessionStorage.getItem("token"),
                            source:sessionStorage.getItem("source")
                          }),
                          contentType: "application/json;charset=utf-8",
                          dataType: "json",
                          async:false,
                          timeout: 30000,
                          success: function (uploadAvatar) {
                            if (uploadAvatar.success == "1") {
                              _this.$cjj("上传成功");
                              _this.message.photo = _this.httpurl + photoUrl;
                              var driverMessage = sessionStorage.getItem("driverMessage");
                              if( driverMessage != null){
                                driverMessage = JSON.parse(driverMessage);
                                driverMessage.photo = _this.message.photo;
                                sessionStorage.setItem("driverMessage",JSON.stringify(driverMessage));
                              }
                            } else{
                              androidIos.second(uploadAvatar.message);
                            }
                          },
                          complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                            $("#common-blackBox").remove();
                            if (status == 'timeout') { //超时,status还有success,error等值的情况
                              androidIos.second("当前状况下网络状态差，请检查网络！")
                            } else if (status == "error") {
                              androidIos.errorwife();
                            }
                          }
                        });
                      } else{
                        $("#common-blackBox").remove();
                        androidIos.second(json.message);
                      }
                    },
                    complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                      if (status == 'timeout') { //超时,status还有success,error等值的情况
                        $("#common-blackBox").remove();
                        androidIos.second("当前状况下网络状态差，请检查网络！")
                      } else if (status == "error") {
                        $("#common-blackBox").remove();
                        androidIos.errorwife();
                      }
                    }
                  });
                };
                oFileReader.readAsDataURL(blob);

              }
            }
            xhr.send();
          }
          e.target.value = "";
        },
        getObjectURL:function(file) {
          var url = null;
          if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
          } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
          } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
          }
          return url;
        },
        compress:function(img, MaximgW, MaximgH,type) {
          var _this = this;
          var image = new Image();
          image.src = img ;
          var imageWidth =  "";
          var imageHeight = "";
          image.onload = function () {
            var canvas = document.createElement('canvas');
            if (image.width < MaximgW && image.height < MaximgH) {
              imageWidth = image.width;
              imageHeight = image.height;
            } else {
              if (image.width > image.height) {
                imageWidth = MaximgW;
                imageHeight = MaximgW * (image.height / image.width);
              } else if (image.width < image.height) {
                imageHeight = MaximgH;
                imageWidth = MaximgH * (image.width / image.height);
              } else {
                imageWidth = MaximgW;
                imageHeight = MaximgH;
              }
            }
            canvas.width = imageWidth;
            canvas.height = imageHeight;
            var con = canvas.getContext('2d');
            con.clearRect(0, 0, canvas.width, canvas.height);
            con.drawImage(image, 0, 0, imageWidth, imageHeight);
            var base64 = canvas.toDataURL('image/jpeg', 0.5).substr(0);
            if(type == 2){
              var photoUrl = "";
              $.ajax({
                type: "POST",
                url: androidIos.ajaxHttp() + "/uploadFile",
                data:JSON.stringify({
                  type: "TX" ,
                  file: base64.substr(23),
                  userCode:sessionStorage.getItem("token"),
                  source:sessionStorage.getItem("source")
                }),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                async:false,
                timeout: 30000,
                success: function (json) {
                  if (json.success == "1") {
                    photoUrl = json.path;
                    $.ajax({
                      type: "POST",
                      url: androidIos.ajaxHttp() + "/uploadAvatar",
                      data:JSON.stringify({
                        path:photoUrl,
                        userCode:sessionStorage.getItem("token"),
                        source:sessionStorage.getItem("source")
                      }),
                      contentType: "application/json;charset=utf-8",
                      dataType: "json",
                      async:false,
                      timeout: 30000,
                      success: function (uploadAvatar) {
                        if (uploadAvatar.success == "1") {
                          _this.$cjj("上传成功");
                          _this.message.photo = _this.httpurl + photoUrl;
                          var carrierMessage = sessionStorage.getItem("carrierMessage");
                          if( carrierMessage != null){
                            carrierMessage = JSON.parse(carrierMessage);
                            carrierMessage.photo = _this.message.photo;
                            sessionStorage.setItem("carrierMessage",JSON.stringify(carrierMessage));
                          }
                        } else{
                          androidIos.second(uploadAvatar.message);
                        }
                      },
                      complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                        $("#common-blackBox").remove();
                        if (status == 'timeout') { //超时,status还有success,error等值的情况
                          androidIos.second("当前状况下网络状态差，请检查网络！")
                        } else if (status == "error") {
                          androidIos.errorwife();
                        }
                      }
                    });
                  } else{
                    $("#common-blackBox").remove();
                    androidIos.second(json.message);
                  }
                },
                complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                  if (status == 'timeout') { //超时,status还有success,error等值的情况
                    $("#common-blackBox").remove();
                    androidIos.second("当前状况下网络状态差，请检查网络！")
                  } else if (status == "error") {
                    $("#common-blackBox").remove();
                    androidIos.errorwife();
                  }
                }
              });
            }else{
              _this.message.photo = base64;
            }
          }
        },
      }
    }
</script>

<style scoped>
  #userBox{
    overflow: scroll;
    position: absolute;
    top:0rem;
    bottom:1.3rem;
    height: auto;
    width:100%;
  }
#user{
  position:absolute;
  top:1.3rem;
  bottom:0;
  height: auto;
  width:100%;
  background: #f6f6f6;
}
.imgBox img{
  width:1.6rem;
  height: 1.6rem;
}
  #head{
     width:100%;
    background: white;
    height: 2.3rem;
    border-top: 2px solid #E5E5E5;
    position: relative;
  }
  .imgBox{
    width:1.6rem;
    height: 1.6rem;
    position: relative;
    overflow: hidden;
    border-radius: 50%;
    float: left;
    margin: 0.35rem 0.5rem 0.35rem 0.44rem;
  }
  .imgBox img{
    width:100%;
  }
  .imgBox input{
     width:100%;
    height:100%;
    position: absolute;
    top:0;
    left:0;
    opacity: 0;
  }
  #head p{
    color:#373737;
    font-size: 0.4rem;
    margin-top: 0.5rem;
  }
#head h1{
  color:#999999;
  font-size: 0.3125rem;
}
  .lookMore{
    width:50%;
    height: 100%;
    line-height: 2.3rem;
    color:#999;
    position: absolute;
    font-size: 0.3125rem;
    background-image: url("../images/lookMore.png");
    right: 4%;
    top:0;
    background-repeat: no-repeat;
    background-position: 100% 50%;
    background-size:0.25rem;
    text-align: right;
    padding-right: 4%;
  }
  .lookMore span{
    font-size: 0.3125rem;
  }
  ul{
    width:100%;
  }
  li{
   background: white;
    position: relative;
  }
  .tableIcon{
      width:0.43rem;
      height: 1.3rem;
      margin-left: 0.44rem;
    background-repeat: no-repeat;
    background-size: 0.43rem;
    background-position: 50% 50%;
    float: left;
  }
  li p {
     float: left;
    line-height: 1.3rem;
    color:#373737;
    font-size: 0.375rem;
    margin-left: 0.27rem;
  }
  .marTop{
     margin-top: 0.27rem;
  }
  .borderShow{
    border-bottom: 1px solid #E5E5E5;
  }
  #shareBox{
    position: fixed;
    top:0;
    bottom: 0;
    left:0;
    right:0;
    height:auto;
    width:auto;
    background-color: rgba(0,0,0,0.6);
  }
  #shareBody{
    position: absolute;
    bottom:0;
    width:92%;
    left:4%;
  }
#shareBody button{
   width:100%;
  margin: 0.2rem 0;
  line-height: 1rem;
  font-size: 0.35rem;
  letter-spacing: 2px;
  background:#ebebeb ;
  border-radius: 0.2rem;
}
  #shareBodyTab{
     background:#ebebeb ;
     padding: 0.2rem 0 0.3rem 0;
    border-radius: 0.2rem;
  }
#shareBodyTab p{
  text-align: center;
  font-size: 0.35rem;
  color:#333;
  line-height: 1rem;
}
#shareBodyTab a{
  float: left;
}
#shareBodyTab a img{
   width:30%;
  margin: 0.3rem auto 0.15rem auto;
}
#shareBodyTab a h6{
   font-size: 0.3125rem;
  color:#333;
  text-align: center;
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
