<template>
  <div id="footer">
    <ul>
      <li v-for='(item,index) in items' :class='[{on:index === idx} ]' @click="rout(item)">
        <div class="imgBox"  :class='[ item.cls , {imgSure:index === idx} ]'><div :style="{marginRight:item.marginRight}" class="corner" v-show=" item.number > 0">{{item.number}}</div></div>
        <div id="footerUserTX" v-if="index == 2" :style="{display: item.show ? 'block' : 'none'}"></div>
        {{item.name}}
      </li>
      <div class="clearBoth"></div>
    </ul>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
    export default {
        name: "footer",
        data() {
          return {
            items: [
              {
                number:0,
                marginRight:0,
                cls: "robbing",
                name: "抢单",
                push: "/robbingList"
              },
              {
                number:0,
                marginRight:0,
                cls: "track",
                name: "订单",
                push: "/trackList"
              },
              {
                number:0,
                marginRight:0,
                cls: "user",
                show:false,
                name: "我的",
                push: "/user"
              }
            ]
          }
        },
        props: ['idx'],
        mounted:function () {
          var _this = this;
          var driverBottomIcon = sessionStorage.getItem("driverBottomIcon");
          if(driverBottomIcon != undefined){
            _this.items = JSON.parse(driverBottomIcon);
          }
          androidIos.bridge(_this);

        },
      methods:{
          go:function () {
            var _this = this;
            var SCREENROBBING = localStorage.getItem("SCREENROBBING");
            if(SCREENROBBING != null){
              SCREENROBBING = JSON.parse(SCREENROBBING);
            }else{
              SCREENROBBING = "";
            }
            androidIos.judgeIphoneX("footer",1);
            if(sessionStorage.getItem("token") != undefined){
              $.ajax({
                type: "POST",
                url: androidIos.ajaxHttp() + "/carrier/bottomIcon",
                data:JSON.stringify({
                  userCode:sessionStorage.getItem("token"),
                  source:sessionStorage.getItem("source"),
                  startCity:SCREENROBBING != "" ? SCREENROBBING.startAdd : "",
                  endCity:SCREENROBBING != "" ? SCREENROBBING.endAdd : "",
                  range:SCREENROBBING != "" ? SCREENROBBING.distance : "",
                  pkTransType:SCREENROBBING.zeroload && SCREENROBBING != "" ? 1 :"",
                  transType:"",
                }),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                timeout: 30000,
                success: function (driverBottomIcon) {
                  if (driverBottomIcon.success == "1") {
                    _this.items[0].number = driverBottomIcon.grabOrderCount*1;
                    _this.items[1].number = driverBottomIcon.orderCount*1 + driverBottomIcon.schedulingCount*1;
                    if(driverBottomIcon.myFlag == 1){
                      _this.items[2].show = true;
                    }else{
                      _this.items[2].show = false;
                    }
                    _this.$nextTick(function () {
                      _this.marginWidth();
                      sessionStorage.setItem("driverBottomIcon",JSON.stringify(_this.items));
                    })
                  }else{
                    androidIos.second(driverBottomIcon.message);
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
            }

          },
        rout:function (item) {
          var _this = this;
          var cookie = 11111;
          if(cookie == ""){
            androidIos.first("尚未登录,请登录!");
            $(".tanBox-yes").unbind('click').click(function(){
              $(".tanBox-bigBox").remove();
              _this.$router.push({ path: '/login'});
            });
          }else{
            _this.$router.push(item.push);
          }
        },
        marginWidth:function () {
          var _this = this;
          var corner = document.getElementsByClassName("corner");
          for(var i = 0; i< corner.length;i++){
            var width = corner[i].scrollWidth;
            _this.items[i].marginRight = - width / (2*(_this.htmlSize())) + 0.05+ "rem";
            corner[i].style.marginRight = - width / (2*(_this.htmlSize())) + 0.05+ "rem";
          }
        },
        htmlSize:function () {
          return document.getElementsByTagName("html")[0].style.fontSize.replace("px","");
        }
      }

    }
</script>

<style scoped>
     #footer{
       position:fixed;
       bottom: 0;
       left:0;
       width:100%;
       background: white;
     }
     #footer ul{
       width:100%;
     }
     .imgBox{
       width:0.58rem;
       height: 0.58rem;
       margin: 0.28rem  auto 0.03rem auto;
       background-position: 0 0;
       background-size: 0.58rem 1.16rem;
       background-repeat: no-repeat;
       position: relative;
     }
     .corner{
       background: #fc4243;
       font-size: 0.24rem;
       color:white;
       position: absolute;
       top:-0.15rem;
       right:0rem;
       padding: 0.05rem 0.15rem;
       border-radius: 0.3rem;
     }
     .robbing{
       background-image: url("../../images/homePage.png");
     }
     .track{
       background-image: url("../../images/track.png");
     }
     .dispatch{
       background-image: url("../../images/dispatch.png");
     }
     .user{
       background-image: url("../../images/user.png");
     }
     .imgSure{
       background-position: 0 100%!important;
     }
     .on{
       color:#2c9cff!important;
     }
    #footer ul li {
      float: left;
      width:33.333333%;
      text-align: center;
      height: 1.3rem;
      color:#999;
      font-size:  0.2667rem;
      background: white;
      line-height: 0.35rem;
      position: relative;
    }
     #footerUserTX{
       position: absolute;
       width:0.18rem;
       height: 0.18rem;
       border-radius: 50%;
       background: #E1473C;
       top:0.2rem;
       right:40%;
     }
</style>
