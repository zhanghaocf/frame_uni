// 凡事用localstorage存储信息的是解决部分手机浏览器支付成功跳转的页面是新开了tab的render进程导致sessionstorage存储的信息没拿到
function setLocal(key,param){
   return uni.setStorage({
       key,data:param
   });
}

function getLocal(key){
    return uni.getStorage({key}).catch(err=>({data:undefined}));
}

function removeLocal(key){
    return uni.removeStorage({key});
}



export {
    setLocal,
    getLocal,
    removeLocal,
}