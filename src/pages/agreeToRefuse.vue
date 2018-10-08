<template>
  <div id="agreeToRefuse">
     <router-view/>
  </div>
</template>

<script>
    export default {
        name: "agree-to-refuse"
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
