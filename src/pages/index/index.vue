<template>
  <view>模板</view>
  <view v-show="loadingTxt.length>0">
    <ZhLoading :txt="loadingTxt[0]"></ZhLoading>
  </view>
  
</template>

<script setup>
import ZhLoading from "@/components/zhloading.vue";

import useCommon from "@/utils/commonHooks/useCommon.js";


let {loadingTxt,loadingTxtAniH,setLoadingfn} = useCommon();


</script>

<style scoped>

</style>
