<template>
    <view v-if="!scrollStop" class='etcMask' :style="{zIndex:zIndex}" :class='{"opacity1":showFlag,"maskfalse":!mask,"nocolor":maskColor}' @click='closeFlag'>
        <view class='wrap' :style="{[`${direction}`]:bottom+'px'}" :class='changcls' @click.stop='rf'>
            <slot></slot>
        </view>
    </view>
    <view v-if="scrollStop" :disable-scroll="true" class='etcMask' :style="{zIndex:zIndex}" :class='{"opacity1":showFlag,"maskfalse":!mask,"nocolor":maskColor}' @touchmove.stop="rf" @click='closeFlag'>
        <view class='wrap' :style="{[`${direction}`]:bottom+'px'}" :class='changcls' @click.stop='rf'>
            <slot></slot>
        </view>
    </view>
</template>

<script setup>
import {computed} from "vue";
let props = defineProps({
    showFlag:{
        type:Boolean,
        default:false
    },
    direction:{
      type:String,
      default:'bottom'
    },
    scrollStop:{
        type:Boolean,
        default:false
    },
    mask:{
        type:Boolean,
        default:true
    },
    maskColor:{
        type:Boolean,
        default:false
    },
    bottom:{
      type:Number,
      default:0
    },
    zIndex:{
        default:3,
        type:Number
    }
});
let changcls = computed(()=>{
  return {
    wrapshow:props.showFlag,
    [props.direction]:true
  }
});
const emits = defineEmits(['Showpop']);
function closeFlag() {
    props.mask && emits('Showpop',false)
}
function rf() {
    return false;
}

</script>

<style scoped>
.etcMask{
  position:fixed;
  z-index: 10;
  width:100%;
  height:100%;
  background-color:rgba(0,0,0,0.4);
  top:0;
  left:0;
  opacity: 0;
  transition: opacity 0.3s linear;
  -webkit-transition: opacity 0.2s linear;
  pointer-events: none;
}
.nocolor{
    background-color:rgba(0,0,0,0);
}
.maskfalse{
  pointer-events: none!important;
  background-color:rgba(0,0,0,0);
}
.opacity1{
  opacity: 1;
  pointer-events: initial;
  transition: opacity 0.1s linear;
  -webkit-transition: opacity 0.1s linear;
}
.wrap{
  pointer-events: initial;
  width:100%;
  position:absolute;
  left:0;
  transform: translateY(100%);
  -webkit-transform: translateY(100%);
  transition: transform 0.1s linear;
  -webkit-transition: transform 0.1s linear;
}
.bottom{
  transform: translateY(100%);
  -webkit-transform: translateY(100%);
  bottom:0;
}
.top{
  transform: translateY(-100%);
  -webkit-transform: translateY(-100%);
  top:0;
}
.wrapshow{
  transform: translateY(0);
  -webkit-transform: translateY(0);
}
</style>
