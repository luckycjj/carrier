<template>
    <div id="authentication" style="top:1.3rem;">
      <div id="title" v-title data-title="认证"></div>
      <ul id="step">
        <li v-for="(item,index) in step" :class="nowStep == ( index + 1) ? 'stepNowColor' : nowStep > (index + 1) ? 'stepBeforeColor' : nowStep < (index + 1) ? 'stepAfterColor' : '' ">
          <div class="stepNumber">
            <div :class="nowStep == ( index + 1) ? 'stepNow' : nowStep > (index + 1) ? 'stepBefore' : nowStep < (index + 1) ? 'stepAfter' : '' " class="line" style="margin-left: 0.05rem;" :style="{opacity: index == 0 ? '0' : '1'}"></div>
            <div :class="nowStep == ( index + 1) ? 'stepNow' : nowStep > (index + 1) ? 'stepBefore' : nowStep < (index + 1) ? 'stepAfter' : '' " class="circle">{{ index + 1}}</div>
            <div :class="nowStep == ( index + 1) ? 'stepNow' : nowStep > (index + 1) ? 'stepBefore' : nowStep < (index + 1) ? 'stepAfter' : '' " class="line" :style="{opacity: index == step.length - 1 ? '0' : '1'}"></div>
            <div class="clearBoth"></div>
          </div>
            {{item}}
        </li>
        <div class="clearBoth"></div>
      </ul>
      <div id="stepF" v-if="nowStep == 1">
        <div class="stepFbottom">
          <ul>
            <li>
              <span>公司名称：</span>
              <input type="text" placeholder="请输入公司名称" v-model="message.first.companyName" maxlength="50"/>
              <div class="clearBoth"></div>
            </li>
          </ul>
        </div>
        <div class="stepFtop">
          <p>请上传公司授权函</p>
          <div class="fileup">
            <img src="../../images/addImg.png" v-if="message.first.authorization.bendi == ''">
            <input type="file" @change="fileImgUp($event,0)"  accept="image/*"  capture = "camera">
            <img :onerror="errorlogo" class="fileImg" :src="message.first.authorization.bendi" v-if="message.first.authorization.bendi != ''">
            <h6 v-if="message.first.authorization.bendi == ''">点击拍照</h6>
          </div>
          <div class="YYZZLook">
            <img src="../../images/SQHlook.png"   @click="lookImg($event,require('../../images/SQHlook.png'))">
            <span>样例</span>
          </div>
          <div class="clearBoth"></div>
        </div>
      </div>
      <div id="stepS" v-if="nowStep == 2">
        <div class="stepStop" v-if="message.first.creator == 1">
          <p>请上传营业执照</p>
          <div class="fileup">
            <img src="../../images/addImg.png" v-if="message.second.businesslicense.bendi == ''">
            <input type="file" @change="fileImgUp($event,1)"  accept="image/*"  capture = "camera">
            <img :onerror="errorlogo" class="fileImg" :src="message.second.businesslicense.bendi" v-if="message.second.businesslicense.bendi != ''">
            <h6 v-if="message.second.businesslicense.bendi == ''">点击拍照</h6>
          </div>
          <div class="YYZZLook">
            <img src="../../images/YYZZLook.png"    @click="lookImg($event,require('../../images/YYZZLook.png'))">
            <span>样例</span>
          </div>
          <div class="clearBoth"></div>
        </div>
        <div class="stepStop" v-if="message.first.creator == 1">
          <p>请上传道路运输许可证</p>
          <div class="fileup2">
            <img src="../../images/addImg.png" v-if="message.second.roadtransport.bendi == ''">
            <input type="file" @change="fileImgUp($event,5)"  accept="image/*"  capture = "camera">
            <img :onerror="errorlogo" class="fileImg2" :src="message.second.roadtransport.bendi" v-if="message.second.roadtransport.bendi != ''">
            <h6 v-if="message.second.roadtransport.bendi == ''">点击拍照</h6>
          </div>
          <div class="SFZFLook">
            <img src="../../images/DLYS.png"    @click="lookImg($event,require('../../images/DLYS.png'))">
            <span>样例</span>
          </div>
          <div class="clearBoth"></div>
        </div>
        <div class="stepSbottom">
           <ul>
             <li>
               <span>公司名称：</span>
               <div class="classCompanyName">{{message.first.companyName}}</div>
               <div class="clearBoth"></div>
             </li>
             <li v-if="message.first.creator == 1">
               <span>社会信用代码：</span>
               <input type="text" placeholder="请真实填写" v-model="message.second.creditcode" maxlength="18"/>
               <div class="clearBoth"></div>
             </li>
             <li v-if="message.first.creator == 1">
               <span>运输类别：</span>
               <div @click="tranTypeLook()" :class="message.second.tranType != '' ? 'blackColor' : ''" v-html="message.second.tranType == '' ? '请选择运输类别' : message.second.tranType" id="tranTypeBigBox"></div>
               <div class="clearBoth"></div>
             </li>
             <li v-if="message.first.creator == 1">
               <span>开户行：</span>
               <input type="text" placeholder="请输入公司开户行（非必填）" v-model="message.second.bank" maxlength="20"/>
               <div class="clearBoth"></div>
             </li>
             <li v-if="message.first.creator == 1"  class="borderno">
               <span>银行账号：</span>
               <input type="text" placeholder="请输入公司银行账号（非必填）" v-model="message.second.banknumber" maxlength="19"/>
               <div class="clearBoth"></div>
             </li>
           </ul>
        </div>
      </div>
      <div id="stepT" v-if="nowStep == 3">
        <div class="stepTtop">
          <p>请拍摄五官清晰头像照</p>
          <div class="fileup3" @click="BAIDURENLIAN()">
            <img src="../../images/addImg.png" v-if="message.third.people.bendi == ''">
            <!--<input type="file" @change="fileImgUp($event,2)"  accept="image/*"  capture = "user">-->
            <img :onerror="errorlogo" class="fileImg3" :src="message.third.people.bendi" v-if="message.third.people.bendi != ''">
            <h6 v-if="message.third.people.bendi == ''">点击拍照</h6>
          </div>
          <div class="SFZLook">
            <img src="../../images/ALEX.png"    @click="lookImg($event,require('../../images/ALEX.png'))">
            <span>样例</span>
          </div>
          <div class="clearBoth"></div>
        </div>
        <div class="stepTtop">
          <p>请拍摄本人身份证正面照</p>
          <div class="fileup2">
            <img src="../../images/addImg.png" v-if="message.third.idCardZ.bendi == ''">
            <input type="file" @change="fileImgUp($event,3)"  accept="image/*"  capture = "camera">
            <img :onerror="errorlogo" class="fileImg2" :src="message.third.idCardZ.bendi" v-if="message.third.idCardZ.bendi != ''">
            <h6 v-if="message.third.idCardZ.bendi == ''">点击拍照</h6>
          </div>
          <div class="SFZFLook">
            <img src="../../images/SFZZ.png"    @click="lookImg($event,require('../../images/SFZZ.png'))">
            <span>样例</span>
          </div>
          <div class="clearBoth"></div>
        </div>
        <div class="stepTtop">
          <p>请拍摄本人身份证反面照</p>
          <div class="fileup2">
            <img src="../../images/addImg.png" v-if="message.third.idCardF.bendi == ''">
            <input type="file" @change="fileImgUp($event,4)"  accept="image/*"  capture = "camera">
            <img :onerror="errorlogo" class="fileImg2" :src="message.third.idCardF.bendi" v-if="message.third.idCardF.bendi != ''">
            <h6 v-if="message.third.idCardF.bendi == ''">点击拍照</h6>
          </div>
          <div class="SFZFLook">
            <img src="../../images/SFZF.png"    @click="lookImg($event,require('../../images/SFZZ.png'))">
            <span>样例</span>
          </div>
          <div class="clearBoth"></div>
        </div>
        <div class="stepTbottom">
          <ul>
            <li>
              <span>姓名：</span>
              <input type="text" placeholder="请输入姓名" v-model="message.third.name" maxlength="50"/>
              <div class="clearBoth"></div>
            </li>
            <li class="borderno">
              <span>身份证号：</span>
              <input type="text" placeholder="请真实填写" v-model="message.third.idCode" maxlength="18"/>
              <div class="clearBoth"></div>
            </li>
          </ul>
        </div>
      </div>
      <h5 class="calltel"  @click="telCall()">有问题请联系客服</h5>
      <button @click="goNext()" v-html="nowStep == 1 || nowStep == 2 ? '下一步': '提交'"></button>
      <div id="tranTypeBox" v-if="tranTypeBox">
        <div id="tranType">
          <img src="../../images/closed.png" @click="tranTypeClosed()">
          <p>运输类型</p>
          <div class="tranTypeBox">
            <div class="tranType" v-if="tranTypeList.length > 0">
              <h6>运输类型</h6>
              <ul>
                <li  @click="choosetranType(index)" :class="item.choose ? 'chooseTrue' : '' " v-for="(item,index) in tranTypeList">{{item.displayName}}</li>
                <div class="clearBoth"></div>
              </ul>
            </div>
          </div>
          <button @click="tranTypeSure()">确定</button>
        </div>
      </div>
      <div v-if="baiduhuotiBox" id="baiduhuotiBox">
        <div id="baiduhuoti">
          <div id="baiduhuotiTop">
            <img src="../../images/baiduhuoti.png">
            <img src="../../images/closed.png" class="closedBaidu" @click="BAIDURENLIANLosed()">
            <h6>正面平视手机、保证光线充足<br>请勿遮挡面部</h6>
          </div>
          <div id="baiduhuotiBottom">
            <div class="prompt-box">
              <div class="prompt-box-text">
                <span class="prompt-box-text-number">1</span>
                <span class="prompt-box-text-content">牢记验证码，点击开始录制</span>
                <span class="prompt-box-text-border"></span>
              </div>
              <div class="prompt-box-text">
                <span class="prompt-box-text-number">2</span>
                <span class="prompt-box-text-content">开启前置摄像头，用普通话朗读数字</span>
                <span class="prompt-box-text-border"></span>
              </div>
              <div class="prompt-box-text">
                <span class="prompt-box-text-number">3</span>
                <span class="prompt-box-text-content">完成录制，等待验证结果</span>
                <!---->
              </div>
              <button @click="baidudumaNumber()">下一步</button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="baidudumaBox" id="baidudumaBox">
        <div id="baiduduma">
          <p>请牢记以下验证码</p>
          <h1>此验证码将于<span>{{daojishi}}</span>秒后过期<br>用普通话朗读数字，视频时长<span>3-8</span>秒最佳</h1>
          <h2>{{baidudumaHaoma}}</h2>
          <div id="fileVideo">
            <button>记住了，开始录制</button>
            <input type="file" accept="video/*"  capture = "camcorder" @change="video($event)">
          </div>
        </div>
        <img @click="baidunumberClosed()" src="../../images/icon_close.png">
      </div>
    </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  import bridge from '../../js/bridge';
  import PinchZoom from "../../js/pinchzoom";
  import  {provinceCityArea} from "../../js/provinceCityArea"
    export default {
        name: "authentication",
        data(){
          return{
             step:["填写公司名","公司信息","个人信息"],
             nowStep:1,
             tranTypeList:[],
             tranTypeBox:false,
            baiduhuotiBox:false,
            baidudumaBox:false,
            ajaxnumber:"",
            baidudumaHaoma:"",
            daojishi:0,
            setTime:null,
             message:{
                first:{
                  authorization:{
                    bendi:"",
                    http:"",
                  },
                  companyName:"",
                  creator:0,
                  companyType:"",
                },
                second:{
                 businesslicense : {
                   bendi:"",
                   http:"",
                 },
                roadtransport:{
                  bendi:"",
                  http:"",
                },
                creditcode:"",
                tranType:"",
                tranTypeNumber:"",
                bank:"",
                banknumber:"",
               },
                third:{
                  people:{
                    bendi:"",
                    http:"",
                  },
                 idCardZ:{
                   bendi:"",
                   http:"",
                 },
                 idCardF:{
                   bendi:"",
                   http:"",
                 },
                 name:"",
                 idCode:""
               }
             },
            errorlogo: 'this.src="' + require('../../images/timg.jpg') + '"',
          }
        },
      watch:{
        message:{
          handler:function(val,oldval){
            var _this = this;
            _this.message.first.companyName = _this.message.first.companyName.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】\-]/g,'');
            _this.message.second.creditcode = _this.message.second.creditcode.replace(/[^\a-\z\A-\Z0-9]/g,'');
            _this.message.second.banknumber = _this.message.second.banknumber.replace(/[^\0-9]/g,'');
            _this.message.second.bank = _this.message.second.bank.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】\-]/g,'');
            _this.message.third.name = _this.message.third.name.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\,\，\.\。\;\!\[\]\【\】\-]/g,'');
            _this.message.third.idCode = _this.message.third.idCode.replace(/[^\X0-9\x]/g,'');
            var type = _this.$route.query.type;
            if(type != undefined){
              localStorage.setItem("CARRIERSSETMESSAGE",JSON.stringify(_this.message));
            }
          },
          deep:true
        }
      },
      mounted:function () {
        var _this = this;
        androidIos.judgeIphoneX("authentication",2);
        var type = _this.$route.query.type;
        if(type != undefined){
           var CARRIERSSETMESSAGE = localStorage.getItem("CARRIERSSETMESSAGE");
           if(CARRIERSSETMESSAGE != undefined){
             _this.message = JSON.parse(CARRIERSSETMESSAGE);
           }
        }else{
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/getCarrAndCompanyInfo",
            data: JSON.stringify({
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source")
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async:false,
            timeout:10000,
            success: function(getCarrAndCompanyInfo){
              if(getCarrAndCompanyInfo.success == "1"){
                var tranType = [];
                var tranTypeNumber = [];
                if(getCarrAndCompanyInfo.transType == null){
                  getCarrAndCompanyInfo.transType = [];
                }
                for(var i = 0; i < getCarrAndCompanyInfo.transType.length ; i++){
                  tranType.push(getCarrAndCompanyInfo.transType[i].displayName);
                  tranTypeNumber.push(getCarrAndCompanyInfo.transType[i].value);
                }
               _this.message = {
                 first: {
                   authorization: {
                     bendi: getCarrAndCompanyInfo.ftpUrl + getCarrAndCompanyInfo.certification,
                     http: getCarrAndCompanyInfo.certification,
                   },
                   companyName: getCarrAndCompanyInfo.corpName,
                   creator: getCarrAndCompanyInfo.isYourSelf,
                   companyType: getCarrAndCompanyInfo.status,
                 },
                 second: {
                   businesslicense: {
                     bendi: getCarrAndCompanyInfo.ftpUrl + getCarrAndCompanyInfo.businessLicense,
                     http:getCarrAndCompanyInfo.businessLicense,
                   },
                   roadtransport: {
                     bendi:  getCarrAndCompanyInfo.ftpUrl + getCarrAndCompanyInfo.roadTransLicense,
                     http: getCarrAndCompanyInfo.roadTransLicense,
                   },
                   creditcode: getCarrAndCompanyInfo.socialCreditCode,
                   tranType:tranType.join(","),
                   tranTypeNumber:tranTypeNumber.join(","),
                   bank: getCarrAndCompanyInfo.bank,
                   banknumber: getCarrAndCompanyInfo.bankAccount,
                 },
                 third: {
                   people: {
                     bendi: getCarrAndCompanyInfo.ftpUrl + getCarrAndCompanyInfo.photo,
                     http:getCarrAndCompanyInfo.photo,
                   },
                   idCardZ: {
                     bendi: getCarrAndCompanyInfo.ftpUrl + getCarrAndCompanyInfo.idCardPos,
                     http: getCarrAndCompanyInfo.idCardPos,
                   },
                   idCardF: {
                     bendi: getCarrAndCompanyInfo.ftpUrl + getCarrAndCompanyInfo.idCardNeg,
                     http: getCarrAndCompanyInfo.idCardNeg,
                   },
                   name:  getCarrAndCompanyInfo.userName,
                   idCode:  getCarrAndCompanyInfo.idCardNum
                 }
               }
              }else{
                androidIos.second(getCarrAndCompanyInfo.message);
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
         telCall:function () {
           androidIos.telCall("021-50929122");
         },
         video:function (e) {
           var _this = this;
           var file =   e.target.files[0];
           var reader = new FileReader();
           reader.readAsDataURL(file);
           reader.onload = function(event) {
             androidIos.loading("正在上传");
             _this.ajaxnumber = androidIos.getbaidunumber();
             $.ajax({
               type: "POST",
               url: "https://aip.baidubce.com/rest/2.0/face/v1/faceliveness/verify",
               data:{
                 "access_token": _this.ajaxnumber,
                 "video_base64":reader.result.split(",")[1],
               },
               contentType: "application/x-www-form-urlencoded",
               dataType: "json",
               timeout: 30000,
               success: function (json) {
                 if(json.result.score > 0.95){
                   clearInterval(_this.setTime);
                   _this.baidudumaHaoma = "";
                   _this.daojishi = 0;
                   $.ajax({
                     type: "POST",
                     url: androidIos.ajaxHttp() + "/uploadFile",
                     data:JSON.stringify({
                       type:  "USER",
                       name:"",
                       file:json.result.pic_list[1].pic,
                       userCode:sessionStorage.getItem("token"),
                       source:sessionStorage.getItem("source")
                     }),
                     contentType: "application/json;charset=utf-8",
                     dataType: "json",
                     timeout: 30000,
                     success: function (uploadFile) {
                       if (uploadFile.success == "1") {
                         _this.message.third.people.bendi = "data:image/jpeg;base64," + json.result.pic_list[1].pic;
                         _this.message.third.people.http = uploadFile.path;
                       } else{
                         androidIos.second(uploadFile.message);
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
                 }else{
                   $("#common-blackBox").remove();
                   androidIos.second("检测失败");
                 }
                 _this.baiduhuotiBox  = false;
                 _this.baidudumaBox = false;
               },
               complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                 if (status == 'timeout') { //超时,status还有success,error等值的情况
                   androidIos.second("当前状况下网络状态差，请检查网络！");
                 } else if (status == "error") {
                   androidIos.second("当天使用次数用尽，请明日再上传");
                   _this.baiduhuotiBox  = false;
                   _this.baidudumaBox = false;
                   clearInterval(_this.setTime);
                   _this.baidudumaHaoma = "";
                   _this.daojishi = 0;
                 }
               }
             });
           }
         },
         BAIDURENLIAN:function () {
           var _this = this;
           _this.baiduhuotiBox  = true;
         },
         BAIDURENLIANLosed:function () {
           var _this = this;
           _this.baiduhuotiBox  = false;
         },
         ajaxBaidu:function () {
           var _this = this;
           _this.ajaxnumber = androidIos.getbaidunumber();
           $.ajax({
             type: "POST",
             url: "https://aip.baidubce.com/rest/2.0/face/v1/faceliveness/sessioncode?access_token=" + _this.ajaxnumber,
             data:{
               "appid":"n69EmEIilvv4K9B0eDDMIEot",
             },
             success: function (json) {
               _this.baidudumaHaoma = json.result.code;
               _this.daojishi = 60;
             },
             complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
               if (status == 'timeout') { //超时,status还有success,error等值的情况
                 androidIos.second("当前状况下网络状态差，请检查网络！")
               } else if (status == "error") {
                 androidIos.second("当天使用次数用尽，请明日再上传");
                 _this.baiduhuotiBox  = false;
                 _this.baidudumaBox = false;
                 clearInterval(_this.setTime);
                 _this.baidudumaHaoma = "";
                 _this.daojishi = 0;
               }
             }
           });
         },
         baidudumaNumber:function () {
           var _this = this;
           _this.baidudumaBox  = true;
           _this.setTime = setInterval(function () {
             if(_this.daojishi == 0){
               _this.ajaxBaidu();
             }else{
               _this.daojishi --;
             }
           },1000)

         },
         baidunumberClosed:function () {
           var _this = this;
           _this.baidudumaBox  = false;
           clearInterval(_this.setTime);
           _this.baidudumaHaoma = "";
           _this.daojishi = 0;
         },
          go:function(){
             var _this = this;
             _this.$nextTick(function () {
                 _this.showBefore();
             })
          },
         tranTypeLook:function () {
           var _this = this;
           _this.tranTypeBox = true;
           if(_this.tranTypeList == 0){
             $.ajax({
               type: "GET",
               url: androidIos.ajaxHttp() + "/settings/getSysConfigList",
               data: {
                 str: "trans_type",
                 userCode: sessionStorage.getItem("token"),
                 source: sessionStorage.getItem("source")
               },
               dataType: "json",
               timeout: 30000,
               success: function (getSysConfigList) {
                 for(var i = 0 ;i < getSysConfigList.length ; i++){
                   getSysConfigList[i].choose = false;
                 }
                 _this.tranTypeList = getSysConfigList;
                 var list = _this.message.second.tranTypeNumber.split(",");
                 for(var x = 0 ; x < _this.tranTypeList.length ; x++){
                   _this.tranTypeList[x].choose = false;
                   for(var i = 0; i < list.length ; i++){
                     if(_this.tranTypeList[x].value - list[i] == 0){
                       _this.tranTypeList[x].choose = true;
                     }
                   }
                 }
               },
               complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                 if (status == 'timeout') {//超时,status还有success,error等值的情况
                   androidIos.second("网络请求超时");
                 } else if (status == 'error') {
                   androidIos.errorwife();
                 }
               }
             })
           }else{
             var list = _this.message.second.tranTypeNumber.split(",");
             for(var x = 0 ; x < _this.tranTypeList.length ; x++){
               _this.tranTypeList[x].choose = false;
               for(var i = 0; i < list.length ; i++){
                 if(_this.tranTypeList[x].value - list[i] == 0){
                   _this.tranTypeList[x].choose = true;
                 }
               }
             }
           }
         },
         lookImg:function (even,imgurl) {
           var _this = this;
           if (even.target.className != "closed") {
             var img = imgurl;
             $("#imgBigbox").remove();
             $("body").append(
               "<div id='imgBigbox'><div class='pinch-zoom'><img onerror='"+ _this.errorlogo+"' id='zoomimg'  src='"+img+"' '></div><div id='zhezhaoImg'></div></div>"
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
         },
         showBefore:function () {
           var _this = this;
           if(_this.nowStep == 1){
             document.getElementById("authenticationTab").style.display = "none";
           }else{
             document.getElementById("authenticationTab").style.display = "block";
             document.getElementById("authenticationTab").onclick = function () {
               _this.nowStep --;
               _this.showBefore();
             };
           }
         },
         goNext:function () {
           var _this = this;
           if(_this.nowStep == 1){
             if(_this.message.first.companyName == ""){
               bomb.first("请填写公司名称");
               return false;
             }
             if(_this.message.first.authorization.bendi == "" || _this.message.first.authorization.http == ""){
               bomb.first("请上传公司授权函");
               return false;
             }
           }
           if(_this.nowStep == 2){
             if(_this.message.second.businesslicense.bendi == "" || _this.message.second.businesslicense.http == ""){
               bomb.first("请上传营业执照");
               return false;
             }
             if(_this.message.second.roadtransport.bendi == "" || _this.message.second.roadtransport.http == ""){
               bomb.first("请上传道路许可证");
               return false;
             }
             if(!androidIos.CheckSocialCreditCode(_this.message.second.creditcode)){
               bomb.first("请填写正确的社会信用代码");
               return false;
             }
             if(_this.message.second.banknumber.length > 0  && _this.message.second.banknumber.length < 19){
               bomb.first("银行账号不完整");
               return false;
             }
           }
           if(_this.nowStep == 3){
             if(_this.message.third.people.bendi == "" || _this.message.third.people.http == ""){
               bomb.first("请拍摄头像照");
               return false;
             }
             if(_this.message.third.idCardZ.bendi == "" || _this.message.third.idCardZ.http == ""){
               bomb.first("请拍摄身份证正面");
               return false;
             }
             if(_this.message.third.idCardF.bendi == "" || _this.message.third.idCardF.http == ""){
               bomb.first("请拍摄身份证反面");
               return false;
             }
             if(_this.message.third.name == ""){
               bomb.first("请填写姓名");
               return false;
             }
             if(!androidIos.idCardCheck(_this.message.third.idCode)){
               bomb.first("请填写正确的身份证号");
               return false;
             }
           }
           if(_this.nowStep < 3){
             if(_this.nowStep == 2){
               androidIos.first("请确认公司名称和社会信用代码");
               $(".tanBox-yes").html("已确认");
               $(".tanBox-yes").unbind('click').click(function(){
                 $(".tanBox-bigBox").remove();
                 _this.nowStep ++ ;
                 _this.showBefore();
               });
             }else{
               var json = {
                 "companyName":_this.message.first.companyName,
                 "userCode":sessionStorage.getItem("token"),
                 "source": sessionStorage.getItem("source")
               }
               $.ajax({
                 type: "POST",
                 url: androidIos.ajaxHttp()+"/company/findStatusAndNameByName",
                 data: JSON.stringify(json),
                 contentType: "application/json;charset=utf-8",
                 dataType: "json",
                 timeout:30000,
                 success: function(findStatusAndNameByName){
                   if(findStatusAndNameByName.success=="1"){
                     _this.nowStep ++ ;
                     _this.showBefore();
                     _this.message.first.companyType = findStatusAndNameByName.status;
                     _this.message.first.creator =  findStatusAndNameByName.isYourSelf;
                    }else if(findStatusAndNameByName.success=="-1"){
                     androidIos.second(findStatusAndNameByName.message);
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
           }else if(_this.nowStep == 3){
             androidIos.loading("正在上传");
             var json = {
               companyName :_this.message.first.companyName,
               bank :  _this.message.second.bank,
               bankAccount : _this.message.second.banknumber,
               userName : _this.message.third.name,
               idCardPos :_this.message.third.idCardZ.http,
               idCardNeg : _this.message.third.idCardF.http,
               certification : _this.message.first.authorization.http,
               socialCreditCode:_this.message.second.creditcode,
               transType:_this.message.second.tranTypeNumber,
               businessLicense :_this.message.second.businesslicense.http,
               roadTransLicense : _this.message.second.roadtransport.http,
               type:2,
               companyStatus:_this.message.first.companyType,
               isYourSelf:_this.message.first.creator,
               idCardNum:_this.message.third.idCode,
               source :sessionStorage.getItem("source"),
               userCode:sessionStorage.getItem("token"),
               photo:_this.message.third.people.http
             };
             $.ajax({
               type: "POST",
               url: androidIos.ajaxHttp() + "/uploadCarrCertification" ,
               data:  JSON.stringify(json),
               contentType: "application/json;charset=utf-8",
               dataType: "json",
               timeout:20000,
               success: function(data){
                 if(data.success=="1"){
                   _this.$cjj("上传成功");
                   localStorage.removeItem("CARRIERSSETMESSAGE");
                   setTimeout(function () {
                     var type = _this.$route.query.type;
                     if(type != undefined){
                       var addPageList = sessionStorage.getItem("addPageList");
                       var number = addPageList * 1 - 2;
                       sessionStorage.setItem("addPageList", number);
                       window.history.go(-2);
                     }else{
                       androidIos.gobackFrom(_this);
                     }
                   },500)
                 }else if(data.success=="-1"){
                   androidIos.second(data.message);
                 }
               },
               complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                 $("#common-blackBox").remove();
                 bomb.addClass("submit", "letgo");
                 if(status=='timeout'){//超时,status还有success,error等值的情况
                   androidIos.second("当前状况下网络状态差，请检查网络！")
                 }else if(status=="error"){
                   androidIos.errorwife();
                 }
               }
             });
           }
         },
         tranTypeClosed:function () {
           var _this = this;
           _this.tranTypeBox = false;
         },
         choosetranType:function (number) {
           var _this = this;
           _this.tranTypeList[number].choose = !_this.tranTypeList[number].choose;
         },
         tranTypeSure:function () {
           var _this = this;
           var list = [];
           var list2 = [];
           for(var x = 0 ; x < _this.tranTypeList.length ; x++){
             if(_this.tranTypeList[x].choose){
               list.push(_this.tranTypeList[x].value);
               list2.push(_this.tranTypeList[x].displayName);
             }
           }
           _this.message.second.tranType = list2.join(",");
           _this.message.second.tranTypeNumber = list.join(",");
           _this.tranTypeBox = false;
         },
         fileImgUp:function (e,type) {
           var _this = this;
           for (var i = 0; i < e.target.files.length; i++) {
             _this.compress(_this.getObjectURL(e.target.files[i]),"1000","1000",type);
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
             androidIos.loading("正在上传");
             $.ajax({
               type: "POST",
               url: androidIos.ajaxHttp() + "/uploadFile",
               data:JSON.stringify({
                 type: type == 0 ? "SQH" : type == 1 ? "YY" : type == 2 ? "PP" : type == 3 ? "SFZZ" : type == 4 ? "SFZF": type == 5 ? "DL" :"",
                 name:"",
                 file: base64.substr(23),
                 userCode:sessionStorage.getItem("token"),
                 source:sessionStorage.getItem("source")
               }),
               contentType: "application/json;charset=utf-8",
               dataType: "json",
               timeout: 30000,
               success: function (json) {
                 if (json.success == "1") {
                   if(type == 0){
                     _this.message.first.authorization.bendi = base64;
                     _this.message.first.authorization.http = json.path;
                   }else if(type == 1){
                     _this.message.second.businesslicense.bendi = base64;
                     _this.message.second.businesslicense.http = json.path;
                   }else if(type == 2){
                     _this.message.third.people.bendi = base64;
                     _this.message.third.people.http = json.path;
                   }else if(type == 3){
                     _this.message.third.idCardZ.bendi = base64;
                     _this.message.third.idCardZ.http = json.path;
                     _this.ajaxnumber = androidIos.getbaidunumber();
                     $.ajax({
                       type: "POST",
                       url: "https://aip.baidubce.com/rest/2.0/ocr/v1/idcard?access_token=" + _this.ajaxnumber,
                       data:{
                         "detect_direction":"true",
                         "detect_risk":"true",
                         "id_card_side": "front",
                         "image":base64.substr(23),
                       },
                       contentType: "application/x-www-form-urlencoded",
                       dataType: "json",
                       timeout: 30000,
                       success: function (json) {
                         _this.message.third.name = json.words_result.姓名.words;
                         _this.message.third.idCode = json.words_result.公民身份号码.words;
                       },
                       complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                         if (status == 'timeout') { //超时,status还有success,error等值的情况
                           androidIos.second("当前状况下网络状态差，请检查网络！")
                         } else if (status == "error") {
                           androidIos.second("当天使用次数用尽，请明日再上传");
                           _this.baiduhuotiBox  = false;
                           _this.baidudumaBox = false;
                           clearInterval(_this.setTime);
                           _this.baidudumaHaoma = "";
                           _this.daojishi = 0;
                         }
                       }
                     });
                   }else if(type == 4){
                     _this.message.third.idCardF.bendi = base64;
                     _this.message.third.idCardF.http = json.path;
                   }else if(type == 5){
                     _this.message.second.roadtransport.bendi = base64;
                     _this.message.second.roadtransport.http = json.path;
                   }
                 } else{
                   androidIos.second(json.message);
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
           }
         },
       }
    }
</script>

<style scoped>
#authentication{
  position: absolute;
  top:1.3rem;
  bottom:0;
  background: #f6f6f6;
  height: auto;
  width:100%;
  overflow-y: scroll;
}
  #step{
    width:9.12rem;
    margin:0.56rem auto 0.48rem auto;
  }
#step li{
   width:3.04rem;
   float: left;
  text-align: center;
  color:#999;
  font-size: 0.35rem;
}
.stepNumber{
  margin-bottom: 0.467rem;
}
  #step .line{
     width:1.12rem;
     height:0.05rem;
     background: #e7e6e7;
     float: left;
     margin-top: 0.225rem;
  }
#step .circle{
  width:0.5rem;
  height:0.5rem;
  line-height: 0.5rem;
  background: #e7e6e7;
  color:white;
  border-radius: 50%;
  float: left;
  margin:0 0.1rem;
}
  .stepNow{
     background: #2c9cff!important;
  }
  .stepBefore{
    background: #90caf6!important;
  }
  .stepAfter{
    background: #e7e6e7!important;
  }
.stepNowColor{
  color: #2c9cff!important;
}
.stepBeforeColor{
  color: #90caf6!important;
}
.stepAfterColor{
  color: #999!important;
}
  .stepFtop,.stepStop,.stepTtop{
    width:76%;
    padding: 0.5rem 12%;
    background: white;
  }
  .stepFtop p,.stepFbottom  h5,.stepStop p,.stepTtop p{
    color:#999999;
    font-size:0.4rem ;
  }
  .fileup,.fileup2,.fileup3{
    width:2.53rem;
    height:3.67rem ;
    background:#F4F5F6 ;
    margin-top: 0.467rem;
    border:1px solid #fff;
    float: left;
    position: relative;
  }
  .fileImg{
    width:2.53rem!important;
    height:3.67rem ;
    position: relative;
    margin: 0 !important;
  }
  .fileImg3{
    width:2.53rem!important;
    height:2.53rem!important ;
    position: relative;
    margin: 0 !important;
  }
  .fileImg2{
    width:4.14rem!important;
    height:2.53rem!important ;
    position: relative;
    margin: 0 !important;
  }
.fileup input,.fileup2 input,.fileup3 input{
  position: absolute;
  width:100%;
  height: 100%;
  opacity: 0;
  top:0;
  left:0;
  z-index: 11;
}
  .fileup2{
    width:4.14rem;
    height:2.53rem ;
  }
.fileup3{
  width:2.53rem;
  height:2.53rem ;
}
.borderno{
  border:none!important;
}
.fileup img{
  width:1.17rem;
  margin:1.25rem auto 0 auto;
}
.fileup2 img,.fileup3 img{
  width:1.17rem;
  margin:0.6rem auto 0 auto;
}
.fileup h6{
  text-align: center;
  color:#999;
  font-size:0.3125rem ;
  margin-top: 0.47rem;
}
.fileup2 h6,.fileup3 h6{
  text-align: center;
  color:#999;
  font-size:0.3125rem ;
  margin-top: 0.21rem;
}
  .YYZZLook{
     float: left;
     width:2rem;
     margin-left: 0.56rem;
     margin-top:1.28rem;
    position: relative;
  }
.YYZZLook img{
  width:100%;
}
.YYZZLook span{
  position: absolute;
  top:0;
  right:0;
  background: black;
  color:white;
  padding: 0.04rem 0.1rem;
  font-size: 0.3125rem;
  border-bottom-left-radius: 0.1rem;
}
  .SFZLook{
    float: left;
    width:2rem;
    margin-left: 0.56rem;
    margin-top:1.28rem;
    position: relative;
  }
.SFZLook img{
  width:100%;
}
.SFZLook span{
  position: absolute;
  top:0;
  right:0;
  background: black;
  color:white;
  padding: 0.04rem 0.1rem;
  font-size: 0.3125rem;
  border-bottom-left-radius: 0.1rem;
}
  .SFZFLook{
    float: left;
    width:2.84rem;
    margin-left: 0.56rem;
    margin-top:1.0rem;
    position: relative;
  }
.SFZFLook img{
  width:100%;
}
.SFZFLook span{
  position: absolute;
  top:0;
  right:0;
  background: black;
  color:white;
  padding: 0.04rem 0.1rem;
  font-size: 0.3125rem;
  border-bottom-left-radius: 0.1rem;
}
  .calltel{
    font-size: 0.3125rem;
    text-align: center;
    color:#546C98;
    width: 2.7rem;
    padding-right: 0.5rem;
    display: block;
    margin: 0.21rem auto 0 auto;
    background-repeat: no-repeat;
    background-size: 0.4rem 0.4rem;
    background-position: 100% 50%;
    background-image: url("../../images/kefuicon.png");
    line-height: 0.5rem;
  }
  button{
    width:9.1rem;
    display: block;
    color:white;
    border-radius: 0.2rem;
    margin:0.4rem auto;
    background: -webkit-linear-gradient(left, #00C4FF , #0074FF); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #00C4FF, #0074FF); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #00C4FF, #0074FF); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #00C4FF , #0074FF); /* 标准的语法 */
    font-size: 0.427rem;
    line-height: 1.08rem;
  }
.stepSbottom,.stepTbottom,.stepFbottom{
   width:100%;
  background: white;
  margin-top: 0.24rem;
}
  .stepSbottom ul,.stepTbottom ul,.stepSbottom ul{
     width:100%;
  }
.stepSbottom ul li,.stepTbottom ul li,.stepFbottom ul li{
    height: 1.33rem;
   width:100%;
  border-bottom: 1px solid #e5e5e5;
}
.stepSbottom ul li span,.stepTbottom ul li span,.stepFbottom ul li span{
  float: left;
  line-height: 1.33rem;
   font-size:0.426rem ;
  color:#333;
  margin-left: 0.56rem;
}
.stepSbottom ul li input,.stepTbottom ul li input,.stepFbottom ul li input{
  float: right;
  line-height: 0.45rem;
  margin-top:0.4rem ;
  font-size:0.426rem ;
  color:#333;
  width:6.15rem;
  margin-right: 0.2rem;
}
  #X00{
    float: right;
    line-height: 0.45rem;
    margin-top:0.44rem ;
    font-size:0.426rem ;
    color:#BCBCBC;
    width:6.15rem;
    margin-right: 0.2rem;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .classCompanyName{
    float: right;
    line-height: 1.33rem;
    font-size:0.426rem ;
    color:#333;
    width:6.15rem;
    margin-right: 0.2rem;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  #tranTypeBigBox{
    float: right;
    line-height: 1.33rem;
    font-size:0.426rem ;
    color:#BCBCBC;
    width:6.15rem;
    margin-right: 0.2rem;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .blackColor{
    color: #333333!important;
  }
#tranTypeBox{
  position: fixed;
  width:100%;
  top:0;
  bottom:0;
  height: auto;
  z-index: 44;
  background: rgba(0,0,0,0.3);
}
#tranType{
  width: 100%;
  background: white;
  position: absolute;
  bottom:0;
}
#tranType button{
  width:90%;
  line-height: 1rem;
  background: #2c9cff;
  color:white;
  display: block;
  margin: 0.8rem auto 0.3rem auto;
  font-size: 0.375rem;
  border-radius: 0.2rem;
}
#tranType p{
  text-align: center;
  font-size: 0.375rem;
  color:#333;
  line-height: 1rem;
  border-bottom: 1px solid #e6e6e6;
}
.tranTypeBox{
  width:93%;
  margin: 0 auto;
  max-height: 10rem;
}
.tranType{
  margin-top: 0.3rem;
}
.chooseTrue{
  background:#2C9CFF!important;
  color:white!important;
}
.chooseLicType{
  float: right;
  font-size: 0.375rem;
  color:#333;
}
.tranTypeBox h6{
  font-size: 0.375rem;
  color:#333;
}
.tranTypeBox h6 span{
  color:#999;
  font-size: 0.35rem;
}
.tranType li{
  float: left;
  display: block;
  width: 18.5%;
  padding:0 1.375% ;
  text-align: center;
  line-height: 0.8rem;
  font-size: 0.35rem;
  background-color: #f3f3f3;
  color:#666;
  border-radius: 0.2rem;
  margin-top: 0.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 3%;
}
.chooseTrue{
  background-color: #2c9cff!important;
  color:white!important;
}
#tranType img{
  position: absolute;
  width:1rem;
  z-index: 1;
}
#baiduhuotiBox{
  position: fixed;
  top:0;
  bottom:0;
  z-index: 122;
  height: auto;
  width:100%;
  background: rgba(0,0,0,0.2);
}
#baiduhuoti{
  width:90%;
  margin: 1.3rem auto 0 auto;
  background: #f6f6f6;
  border-radius: 0.2rem;
  box-shadow: 0 0 10px #d2d2d2;
}
#baiduhuoti img{
  width:50%;
  margin:0 auto;
}
#baiduhuotiTop{
  position: relative;
}
.closedBaidu{
  position: absolute;
  top:0;
  right:0;
  width:1rem!important;
}
#baiduhuotiTop h6{
  font-size: 0.35rem;
  color: #999;
  letter-spacing: 0;
  line-height: 0.6rem;
  text-align: center;
}
#baiduhuotiBottom{
  width:100%;
  background: white;
}
.prompt-box {
  padding: 1.33rem 0;
}
.prompt-box-text {
  margin: 0 auto 0.85312rem;
  height: 0.42688rem;
  line-height:0.42688rem;
  width: 7.52rem;
}
.prompt-box-text-number {
  -webkit-border-radius: 0.3rem;
  -moz-border-radius: 0.3rem;
  border-radius:  0.3rem;
  border: 1px solid #0073eb;
  text-align: center;
  color: #0073eb;
  display: inline-block;
  width: 0.42688rem;
  height:0.42688rem;
  line-height: 0.42688rem;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 0.3125rem;
  margin-right: .26656rem;
  letter-spacing: 0;
  vertical-align: top;
}
.prompt-box-text-content {
  color: #333;
  letter-spacing: 0;
  white-space: nowrap;
  display: inline-block;
  font-size: 0.4rem;
}
.prompt-box-text-border {
  height:0.608rem;
  margin: .13344rem 0 .13344rem .1888rem;
  width: 0;
  border-left: 1px dotted #0073eb;
  display: block;
}
#baiduhuoti button{
  width:90%;
  display: block;
  color:white;
  border-radius: 0.2rem;
  margin:0.4rem auto;
  background: -webkit-linear-gradient(left, #00C4FF , #0074FF); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right, #00C4FF, #0074FF); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right, #00C4FF, #0074FF); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #00C4FF , #0074FF); /* 标准的语法 */
  font-size: 0.427rem;
  line-height: 1.08rem;
}
#fileVideo{
  width:90%;
  margin:0.4rem auto;
  position: relative;
}
#baiduduma  input{
  width:100%;
  height:1.08rem;
  position: absolute;
  top:0;
  left:0;
  opacity: 0;
}
#baiduduma  button{
  width:100%;
  display: block;
  color:white;
  border-radius: 0.2rem;
  background: -webkit-linear-gradient(left, #00C4FF , #0074FF); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right, #00C4FF, #0074FF); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right, #00C4FF, #0074FF); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #00C4FF , #0074FF); /* 标准的语法 */
  font-size: 0.427rem;
  line-height: 1.08rem;
}
#baidudumaBox{
  position: fixed;
  top:0;
  bottom:0;
  z-index: 133;
  height: auto;
  width:100%;
  background: rgba(0,0,0,0.2);
}
#baiduduma{
  width:80%;
  margin: 1.3rem auto 0 auto;
  background: white;
  border-radius: 0.2rem;
  box-shadow: 0 0 10px #d2d2d2;
  border:1px solid white;
}
#baiduduma p{
  font-size: 0.4rem;
  color: #333;
  height: 0.42656rem;
  line-height: 0.42656rem;
  text-align: center;
  margin: 0.98656rem 0 0.4rem;
}
#baiduduma h1{
  font-size: 0.37312rem;
  color: #666;
  text-align: center;
  margin-bottom: 0.5472rem;
  letter-spacing: 0;
}
#baiduduma h2{
  font-size: 0.45rem;
  color: #333;
  text-align: center;
  margin-bottom: 0.5472rem;
  letter-spacing: 0;
}
#baidudumaBox img{
  width:1rem;
  margin:0.3rem auto 0 auto
}
#baiduduma h1 span{
  font-size: 0.37312rem;
  color: #666;
}
</style>
