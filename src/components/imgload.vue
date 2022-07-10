<template>
    <view class="zhbigwrap" :class="{bgcls:!loadbol}">
        <view class="bbwrap">
            <view class="imgcls" :class="{vishidden:!loadbol}">
                <image class="imgcls"
                :src="src"
                :mode="mode"
                :lazy-load="lazyload"
                @load="loadFn"
                @error="errorfn"></image>
            </view>
            <view v-if="!loadbol" class="zhwrap">
                <image class="defaultimg"
                :src="defaultSource"
                mode="aspectFit"
                :lazy-load="lazyload"></image>
            </view>
        </view>
    </view>
</template>
<script setup>
import {ref} from "vue";
const props = defineProps({
    defaultSource:{
        type:String,
        default:'/static/components/imgload/white.png'
    },
    src:{
        type:String,
        default:''
    },
    mode:{
        type:String,
        default:'aspectFill'
    },
    lazyload:{
        type:Boolean,
        default:false
    }
})
let loadbol = ref(false);
function loadFn(){
    loadbol.value=true
}
function errorfn(e){
    console.log("图片错误信息:::",e)
}
</script>
<style scoped>
.zhbigwrap{
  overflow: hidden;
  width:100%;
  height:100%;
}
.bbwrap{
    position: relative;
    height:100%;
    width:100%;
    pointer-events: none;
}
.zhwrap{
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width:100%;
  height:100%;
  position: absolute;
  z-index: 0;
  left:0;
  top:0;
  background-color: rgb(227,233,245);
}
.bgcls{
  background-color: rgb(227,233,245);
}
.imgcls{
  width:100%;
  height:100%;
  display: block;
}
.defaultimg{
  width: 100%;
  height:100%;
}
.vishidden{
    visibility: hidden;
}
</style>
