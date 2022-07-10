<template>
    <cover-view class='loadingMusk' @click.stop="returnfalse" @touchmove="returnfalse">
      <cover-view :class="[isHorizontalScreen?'loadingWrapH':'loadingWrap']">
        <cover-image src="/static/components/loading/loading.gif" :class="[isHorizontalScreen?'loadingclsH':'loadingcls']"></cover-image>
        <cover-view :class="[isHorizontalScreen?'fsH':'fs']">{{txt}}</cover-view>
      </cover-view>
    </cover-view>
</template>
<script setup>
const props = defineProps({
    txt:{
        type:String,
        default:''
    },
    isHorizontalScreen:{
      type:Boolean,
      default:false
    }
})
function returnfalse(){
    return false
}
</script>
<style scoped>
.loadingMusk{
  position:fixed;
  left:0;
  top:0;
  width:100%;
  height:100%;
  z-index: 99999;
  background-color: transparent;
}
.loadingWrap{
  width:220rpx;
  padding:0 10rpx 30rpx;
  border-radius: 10rpx;
  background-color: rgba(0,0,0,.5);
  overflow: hidden;
  position:absolute;
  left:50%;
  top:50%;
  transform: translate(-50%,-50%);
  -webkit-transform:translate(-50%,-50%);
  color:white;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  font-size: 30rpx;
}
.mb20{
  margin-bottom: 20rpx!important;
}
.loadingcls{
  width:150rpx;
  height:150rpx;
  display: block;
  margin: 0 auto;
}
.fs{
  font-size: 24rpx;
  background-color: transparent;
}
/* 横屏样式 */

.loadingWrapH{
  width:calc(110rpx * 750 / 812);
  padding:0 calc(5rpx * 750 / 812) calc(15rpx * 750 / 812);
  border-radius: calc(5rpx * 750 / 812);
  background-color: rgba(0,0,0,.5);
  overflow: hidden;
  position:absolute;
  left:50%;
  top:50%;
  transform: translate(-50%,-50%);
  -webkit-transform:translate(-50%,-50%);
  color:white;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  font-size: calc(15rpx * 750 / 812)
}
.mb20H{
  margin-bottom: calc(10rpx * 750 / 812)!important;
}
.loadingclsH{
  width:calc(80rpx * 750 / 812);
  height:calc(80rpx * 750 / 812);
  display: block;
  margin: 0 auto;
}
.fsH{
  font-size: calc(12rpx * 750 / 812);
  background-color: transparent;
}
</style>
