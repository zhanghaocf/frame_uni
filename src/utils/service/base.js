import {
    simpleDebounce,
    composeFn,
    cacheFn,
    replaceCallback,
    heartfn,
    stopClick
} from '../util/base'
import {
    loadingShow,
    errorHandle,
    exportAbort
} from "../util/utils"

function handleApi(fn,
    {
        loadingTxt = '', //是否有loading
        needError = true, // true弹错误信息false不弹
        needDebance = false, //是否防抖
        stopClickBol = false, //是否防连点
        cacheBol = false, //是否缓存
        simpleBol = false,
        exportAbortBol = true, //是否暴露abort方法的requestObj
    } = {}) {
    let arr = []
    loadingTxt && arr.unshift(loadingShow(loadingTxt))
    needDebance && arr.unshift(simpleDebounce)
    simpleBol && arr.unshift(replaceCallback)
    needError && arr.unshift(errorHandle)
    //composeFnCache中的函数参数有顺序要求错误处理总是第一个,后期开发添加其他处理方法用arr.push
    cacheBol && arr.push(cacheFn)
    exportAbortBol && arr.push(exportAbort)
    stopClickBol && arr.push(stopClick)
    return composeFn.apply(this, arr)(fn)
}

export {
    handleApi
}
