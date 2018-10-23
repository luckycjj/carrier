<template>
  <div id="agreeToRefuse" style="top:1.3rem">
     <router-view/>
  </div>
</template>

<script>
  import {androidIos} from "../js/app";
  export default {
        name: "agree-to-refuse",
    mounted:function () {
      var _this = this;
      androidIos.judgeIphoneX("agreeToRefuse",2);
    }
    }
</script>

<style scoped>
  #agreeToRefuse{
    width:100%;
    height:auto;
    top:1.3rem;
    bottom:0;
    position: absolute;
    overflow: scroll;
    margin-top: 0.03125rem;
    background: #f6f6f6;
  }
</style>
