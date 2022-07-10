//todo 直接在自定义loading组件中放该方法
import { onUnload } from "@dcloudio/uni-app";
import {reactive} from "vue";
import {
    heartfn
} from "@/utils/util/base.js";
export default function useCommon(){
    let loadingTxt = reactive([]);
    onLoadingPages();
    onUnload(()=>{
        let path = getCurrentPages().slice(-1)[0].route;
        uni.$off(`loading:${path}`,setLoadingfn);
    })
    function onLoadingPages(){
        let path = getCurrentPages().slice(-1)[0].route;
        uni.$on(`loading:${path}`,setLoadingfn);
    }
    function setLoadingfn(data){
        if(data){
            loadingTxt.push(data);
        }else{
            loadingTxt.shift();
        }
    }

    function loadingTxtAni(txtarr){
        let txt = txtarr.shift();
        loadingTxt[0]=txt;
        console.log({txtarr})
        return Promise.resolve(txtarr);
    }
    const loadingTxtAniH = heartfn(loadingTxtAni,(arr)=>arr.length===0,800)

    return {
        loadingTxt,
        loadingTxtAniH,
        setLoadingfn
    }
}