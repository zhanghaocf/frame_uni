//todo 401需要处理下
import {
    domain
} from "@/utils/config.js";
let token = '';
function request(options) {
    let { header, noNeedToken } = options
    options.header = {
        ...header && { header },
        ...token && !noNeedToken && { 'Token':token },
    }
    let requestObj={};
    let promiseobj = new Promise((resolve, reject) => {
        requestObj=uni.request({
            timeout: 180000,
            ...options,
            success: (res) => {
                let {statusCode} = res
                if (statusCode >= 400) {
                    let msg = (res.data&&res.data.error) ||'系统繁忙，请稍后重试'
                    if(statusCode===401){
                        //用户信息过期
                        reject(401);
                        return
                    }
                    return reject(msg)
                }
                let dt = res.data;
                if(dt.code&&dt.code>=400){
                    return reject(dt.error)
                }
                resolve(dt)
            },
            fail: (err) => {
                console.log({err})
                if (err && err.errMsg) {
                    switch (err.errMsg) {
                        case 'request:fail timeout':
                            err = "网络不稳定，请稍后重试"
                            break;
                        case 'request:fail 网络连接错误':
                            err = "网络有点问题，建议重新操作，或是切换更快网络"
                            break;
                    }
                }
                if (err && err.msg) {
                    err = err.msg
                }
                // #ifdef MP-ALIPAY
                if(err && err.data && err.data.error){
                    err = err.data.error
                }
                // #endif
                reject(err)
            }
        });
    })
    promiseobj.requestObj=requestObj
    return promiseobj;
}

function Get(options) {
    let opt = {
        ...options,
        method: 'GET'
    }
    return request(opt)
}

//url,headers,data
function Post(options) {
    let opt = {
        ...options,
        method: 'POST'
    }
    return request(opt)
}

function setToken(tk){
    token=tk;
}


// let singleFlag = true
// let handleLogin401 = function(){
//     if(!singleFlag){
//         console.log("以及在处理了")
//         return
//     }
//     singleFlag=false
//     setTimeout(()=>{
//         !singleFlag&&(singleFlag=true)
//     },2000)
//     uni.showModal({
//         title:'提示',
//         content:'您的用户信息已经过期了哟～请重新登录下',
//         showCancel:false,
//         confirmText:'我知道了',
//         success:(res)=>{
//             token=''
//             singleFlag=true
//             return loginS('',true).then(res=>{
//                 uni.reLaunch({
//                     url: '/pages/index/index',
//                 })
//             })
//         }
//     })
// }

export {
    Get,
    Post,
    login,
    setToken
}