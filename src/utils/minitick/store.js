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

 let uuidKeyname = 'lq-track-identity'
 function setUuid(data){
     return setLocal(uuidKeyname,data);
 }
 function getUuid(){
     return getLocal(uuidKeyname)
 }

 export {
    setUuid,
    getUuid
 }