<template>
  <div id="uploadData" style="top:1.3rem">
    <router-view></router-view>
  </div>
</template>
<script>
  import {androidIos} from "../js/app";
  export default {
    name: 'uploadData',
    data () {
      return {
      }
    },
    mounted:function () {
      androidIos.judgeIphoneX("uploadData",2);
    }
  }
</script>
<style scoped>
  #uploadData{
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
