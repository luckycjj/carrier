<template>
  <div id="statusnow" style="top:1.3rem;">
    <div id="title" v-title data-title="个人资料"></div>
    <div v-if="status == 0" class="statusF">
      <img src="../../images/noStatus.png">
      <p>对不起，您尚未认证，请前去认证</p>
      <button @click="goStatus(1)">前往认证</button>
    </div>
    <div class="statusS" v-else>
      <p>认证状态</p>
      <h1 v-html="status == '0' ? '未认证' :status == '1' ? '待审核' : status == '2' ? '认证成功' : status == '3' ? '已驳回' : status == '4' ? '已禁用' : ''">认证通过</h1>
      <div class="clearBoth"></div>
      <div class="tableBox">
        <div class="tableTap border" v-if="letterType == 2">
          <span class="title">公司名称</span><span class="nei">{{corpName}}</span>
        </div>
        <div class="tableTap border">
          <span class="title w2">姓名</span><span class="nei">{{name}}</span>
        </div>
        <div class="tableTap border" v-if="letterType == 2">
          <span class="title">信用代码</span><span class="nei">{{creditCode}}</span>
        </div>
        <div class="tableTap border" v-if="inviteCode != '' && inviteCode != null">
          <span class="title">邀请代码</span><span class="nei">{{inviteCode}}</span>
        </div>
        <div class="tableTap">
          <span class="title">证件信息</span>
          <div class="clearBoth"></div>
          <div class="imgBox">
             <img :src="IDpic" :onerror="errorlogo" @click="imgLook(IDpic)">
              身份证正面
          </div>
          <div class="imgBox" style="float: right;" @click="imgLook(IDpicfan)">
            <img :src="IDpicfan" :onerror="errorlogo" >
            身份证反面
          </div>
          <div class="imgBox" v-if="letterType == 2">
            <img :src="certification" :onerror="errorlogo"  @click="imgLook(certification)">
            邀请函
          </div>
          <div class="imgBox" v-if="letterType == 1">
            <img :src="driverLicense" :onerror="errorlogo"  @click="imgLook(driverLicense)">
            驾驶证
          </div>
          <div class="imgBox" v-if="letterType == 1"  style="float: right;">
            <img :src="drivingLicence" :onerror="errorlogo"  @click="imgLook(drivingLicence)">
            行驶证
          </div>
          <div class="imgBox" v-if="letterType == 1">
            <img :src="roadTransLicense" :onerror="errorlogo"  @click="imgLook(roadTransLicense)">
            道路运输许可证
          </div>
          <div class="clearBoth"></div>
        </div>
      </div>
      <button v-if="status != 2 && status != 1" @click="goStatus(2)">重新上传</button>
      <button v-if="status == 1" @click="goStatus(2)">修改资料</button>
    </div>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
  import PinchZoom from "../../js/pinchzoom";
    export default {
        name: "status-now",
      data(){
          return{
             status : 0,
             name: "",
             corpName:"",
             certification:"",
             IDpic:"",
             IDpicfan:"",
             driverLicense:"",
             drivingLicence:"",
             roadTransLicense:"",
             ftp:"",
             letterType:"",
             errorlogo: 'this.src="' + require('../../images/timg.jpg') + '"',
          }
      },
      mounted:function () {
        var _this = this;
        androidIos.judgeIphoneX("statusnow",2);
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
          async:false,
          success: function (getUserInfo) {
            if (getUserInfo.success == "1") {
              _this.status =  getUserInfo.status;
              _this.inviteCode = getUserInfo.inviteCode;
              _this.creditCode = getUserInfo.creditCode;
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
        if(_this.status != 0){
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/getCarrAndCompanyInfo",
            data: JSON.stringify({
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source")
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout:10000,
            success: function(findDriverInfo){
              if(findDriverInfo.success == "1"){
                _this.letterType = findDriverInfo.type == 3 ? 1: 2;
                _this.name = findDriverInfo.userName.replace(/[0-9]/g,'');
                _this.certification = findDriverInfo.ftpUrl + findDriverInfo.certification;
                _this.IDpic = findDriverInfo.ftpUrl + findDriverInfo.idCardPos;
                _this.IDpicfan = findDriverInfo.ftpUrl + findDriverInfo.idCardNeg;
                _this.driverLicense = findDriverInfo.ftpUrl + findDriverInfo.drivingLicence;
                _this.drivingLicence = findDriverInfo.ftpUrl + findDriverInfo.driverLicense;
                _this.roadTransLicense = findDriverInfo.ftpUrl + findDriverInfo.roadTransLicense;
                _this.corpName = findDriverInfo.corpName;
                _this.ftp = findDriverInfo.ftpUrl;
              }else{
                androidIos.second(findDriverInfo.message);
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
        }
        androidIos.bridge(_this);
      },
      methods:{
        go:function () {
          var _this = this;
        },
        goStatus:function (type) {
          var _this = this;
          if(type == 1){
            androidIos.addPageList();
            _this.$router.push({path:'/uploadData/uploadDataS',query:{type:1}})
          }else{
            androidIos.addPageList();
            if(_this.letterType == 2){
              _this.$router.push({ path: '/authenticationF'});
            }else{
              _this.$router.push({ path: '/authenticationS'});
            }

          }
        },
        imgLook:function (img) {
          var _this = this;
            $("#imgBigbox").remove();
            $("body").append(
              "<div id='imgBigbox'><div class='pinch-zoom'><img id='zoomimg'  src=" +
              img + " '  onerror='"+ _this.errorlogo+"'></div><div id='zhezhaoImg'></div></div>"
            );
            $("#imgBigbox").css({
              width: "100%",
              height: "100%",
              position: "fixed",
              top: "0",
              left: "0",
              background: "rgb(0,0,0)",
              "z-index": "999",
              display: "block"
            });
            $("#zhezhaoImg").css({
              width: "100%",
              height: "100%",
              position: "absolute",
              background: "rgba(0,0,0,0)",
              "z-index": "999",
              top: "0",
              left: "0"
            });
            $("#imgBigbox img").css({ width: "100%", position: "absolute" });
            var image = document.getElementById("zoomimg");
            image.onload = function() {
              var height = $("#imgBigbox img").height();
              $("div.pinch-zoom").each(function() {
                new PinchZoom($(this), {});
              });
              $(".pinch-zoom-container").css({
                width: "100%",
                height: "100%"
              });
              $("#imgBigbox img").css("top", "50%");
              $(".pinch-zoom").css({ width: "100%", height: "100%" });
              $("#imgBigbox img").css("margin-top", -height / 2 + "px");
              var setImgBox;
              var setImgBoxNumber = 10;
              setImgBox = setInterval(function() {
                setImgBoxNumber--;
                if (setImgBoxNumber < 9) {
                  clearInterval(setImgBox);
                  setImgBoxNumber = 10;
                  $("#zhezhaoImg").remove();
                }
              }, 100);
            };
        }
      }
    }
</script>

<style scoped>
  #statusnow{
    position:absolute;
    top:1.3rem;
    bottom:0;
    height: auto;
    width:100%;
    background: #f6f6f6;
  }
  .statusF img{
    width:4.82rem;
    margin:2.64rem auto 0 auto;
  }
  .statusF p{
    color:#1C1C1C;
    font-size: 0.4rem;
    text-align: center;
    margin-top: 0.65rem;
    font-weight: bold;
  }
  .statusF button{
    width:9.1rem;
    background: -webkit-linear-gradient(left, #00C4FF , #0074FF); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #00C4FF, #0074FF); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #00C4FF, #0074FF); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #00C4FF , #0074FF); /* 标准的语法 */
    color:white;
    display: block;
    margin: 0 auto;
    line-height: 1.2rem;
    font-size: 0.4rem;
    border-radius: 0.2rem;
    margin-top:4.6rem;
  }
  .statusS{
     position: relative;
     width:100%;
  }
  .statusS p{
    color:#373737;
    line-height:1.45rem;
    font-size: 0.375rem;
    margin-left: 0.39rem;
    font-weight: bold;
    float: left;
  }
  .statusS h1{
    color:#373737;
    line-height:1.45rem;
    font-size: 0.32rem;
    margin-right: 0.39rem;
    float: right;
  }
  .statusS button{
    width:9.1rem;
    background-image: url("../../images/backgroundJB.png");
    background-repeat:repeat-y;
    background-size:9.1rem;
    color:white;
    display: block;
    margin: 0 auto;
    line-height: 1.2rem;
    font-size: 0.4rem;
    border-radius: 0.2rem;
    margin-top: 0.8rem;
  }
  .tableBox{
     width:100%;
    background: white;
  }
  .tableTap{
    line-height: 1.17rem;
    width:92%;
    padding: 0 4%;
  }
  .title{
    color:#666;
    font-size:0.375rem ;
  }
  .nei{
    color:#373737;
    font-size:0.375rem ;
    margin-left:1rem ;
  }
  .w2{
    letter-spacing:2em; /*如果需要y个字两端对齐，则为(x-y)/(y-1),这里是（4-2）/(2-1)=2em */
    margin-right:-2em;
  }
  .border{
     border-bottom: 1px solid #E5E5E5;
  }
  .imgBox{
    width: 4rem;
    overflow: hidden;
    position: relative;
    text-align: center;
    font-size: 0.3125rem;
    color:#333;
    float: left;
  }
  .imgBox img{
    width: 4rem;
    height: 2.6rem;
  }
</style>
