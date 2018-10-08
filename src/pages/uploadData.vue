<template>
  <div id="uploadData">
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    name: 'uploadData',
    data () {
      return {
      }
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
