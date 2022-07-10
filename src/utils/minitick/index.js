import {
    replaceCallback
} from "@/utils/util/base.js";
import {UUID} from "./tools.js";
import {
    setUuid,
    getUuid
} from "./store.js";
import pkg from '../../../package.json';
let MiniObj = null;
let appKey="couple";
let sdkType = "";
// #ifdef MP-WEIXIN
sdkType="wechat_applet";
// #endif
// #ifdef MP-ALIPAY
sdkType="alipay_applet";
// #endif
let eventArr = [];
let lqtickTimer = null;


async function getInstanceFn(){
    MiniObj={
        uuid:await getUuidAsync(),
        app_version:pkg.version,
        sdk_version:1,
        device:await getDevice(),
        url:`https://big-data.leqi.us/api/${appKey}/event/${sdkType}`
    }
}

const MiniTick= replaceCallback(getInstanceFn);

async function getUuidAsync(){
    let {data} = await getUuid();
    if(!data){
        data = UUID();
        console.log("{:::,",data)
        setUuid(data);
    }
    return data;
}

async function getDevice(){
    let res = await uni.getSystemInfo();
    let {
        SDKVersion,
        brand,
        platform,
        system,
        model,
        screenHeight,
        screenWidth
    } = res;
    return {
        sdk_version:SDKVersion,
        lib:platform,
        model,
        screen_width:screenWidth,
        screen_height:screenHeight,
        os_version:system,
        manufacturer:brand
    }
}

function trackCustom(event_type="",event_name="",event_params={}){
    try{
        MiniTick().then(res=>{
            let dataobj = {
                ...MiniObj,
                event_type,
                event_name,
                event_params,
                nonce_str:UUID(),
                time:new Date().getTime(),
                path:getCurrentPages().slice(-1)[0]?getCurrentPages().slice(-1)[0].route:"pages/index/index",
            }
            eventArr.push(dataobj);
            if(event_type==='START'){
                startSendData();
            }
        })
    }catch(err){
        console.log("err:::",err)
    }
    
}

function CustomTrackCustom(event_name="",event_params={}){
    trackCustom('CUSTOM',event_name,event_params);
}

function startSendData(){
    sendRequest();
    lqtickTimer=setInterval(()=>{
        sendRequest();
    },5000)
}
function sendRequest(){
    if(eventArr.length===0||!MiniObj.url){
        return;
    }
    let dataarr = eventArr.slice(0);
    eventArr.length=0;
    uni.request({
        url:MiniObj.url,
        method:'POST',
        data:dataarr
    })
}

function loginFn(openid){
    MiniObj.app_user_id=openid;
}

function setupFn(){
    trackCustom('START','启动事件');
}
function CustomTrackCustom_click(type,name){
    CustomTrackCustom('BURIED_POINT_CLICK',{type,name});
}

function CustomTrackCustom_upload(KEY,name){
    CustomTrackCustom('UPLOAD_PICTURES',{KEY,name});
}
export {
    MiniTick,
    trackCustom,
    CustomTrackCustom,
    loginFn,
    setupFn,
    CustomTrackCustom_click,
    CustomTrackCustom_upload
}