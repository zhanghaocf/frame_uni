//这里面只放所有地方都能通用的函数

function curryN(length,fn){
    let arr = []
    return function c(...args){
      arr = arr.concat(args)
      if(arr.length<length){
        return c
      }else{
        return fn.apply(this,arr)
      }
    }
  }
  
  function composeFn(...args){
   return function(fn){
      let disposeFnArr = [];
      let abortFnArr = [];
      let newFn = args.reduceRight((s,f)=>{
        let resFn = f(s)
        let {dispose,abort} = resFn;
        dispose && disposeFnArr.push(dispose)
        abort && abortFnArr.push(abort)
        return resFn
      },fn)

      newFn.dispose=()=>{
        disposeFnArr.forEach(fn=>fn())
        // disposeFnArr=[];
      }
      newFn.abort=()=>{
        console.log({abortFnArr})
        abortFnArr.forEach(fn=>fn())
        // abortFnArr=[];
      }
      return newFn;
    }
  }
  
  function cacheFn(fn){
    let obj = {}
    const ha = (...args) => {
      console.log('看看缓存：：',obj)
      let key = JSON.stringify(args);
      let val = obj[key];
      if(val){
        return Promise.resolve(JSON.parse(JSON.stringify(val)))
      }else{
        let v = fn.apply(this,args)
        if(v.then){
          return v.then(res=>{
            obj[key] = res
            return Promise.resolve(JSON.parse(JSON.stringify(res)))
          })
        }else{
          obj[key] = v
          return Promise.resolve(JSON.parse(JSON.stringify(v)))
        }
      }
    }
    ha.dispose = function(){
      console.log("清掉缓存啦");
      obj = {};
    }
    return ha;
  }
  function heartfn(fn,statefn=(param)=>true,time=1000){
    let timer = null
    return function settingfn(...args){
        settingfn.stoptimer=false
        function heartfn(...args){
            return new Promise((resolve,reject)=>{
                fn.apply(this,args).then(res=>{
                    if(statefn(res)){
                        resolve(res)
                    }else{
                        if(settingfn.stoptimer){
                            return reject('阻止了')
                        }
                        timer = setTimeout(()=>{
                          if(settingfn.stoptimer){
                              return reject('阻止了')
                          }
                          resolve(heartfn(...args))
                        },time)
                    }
                }).catch(err=>{
                    if(settingfn.stoptimer){
                        return reject('阻止了')
                    }
                    timer = setTimeout(()=>{
                      if(settingfn.stoptimer){
                        return reject('阻止了')
                      }
                      resolve(heartfn(...args))
                    },time)
                })
            })
        }
        return heartfn(...args)
    }
  }
  
  //fn失败执行几次问题
  function performTimes(count,fn){
    let t = count
    return function haha(...args){
      return fn.apply(this,args).catch(err=>{
        if(--count>0){
          return new Promise((resolve,reject)=>{
            setTimeout(()=>{
              return resolve(haha(...args))
            },(t-count)*500)
          })
        }else{
          throw err
        }
      })
    }
  }
  
  function replaceCallback(fn){
    let p = null
    function callback(...args){
      return p?p:(p=fn.apply(this,args))
    }
    callback.dispose=()=>{
      p=null;
    }
    return callback
  }
  
  function simpleDebounce(fn,time=300){
    let timer = null
    return (...args)=>{
      clearTimeout(timer)
      return new Promise((resolve,reject)=>{
        timer=setTimeout(()=>{
          resolve(fn.apply(this,args))
        },time)
      })
    }
  }

  function simpleThrottle(fn,time=100){
    let timer = null
    return (...args)=>{
      if(timer){
        return
      }
      return new Promise((resolve,reject)=>{
        timer=setTimeout(()=>{
          resolve(fn.apply(this,args))
          timer=null
        },time)
      })
    }
  }
  
  const zerofn = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  
  function getImgExt(url='') {
    return url.match(/\w+$/)[0]
  }
  
  //_______________________________________________________
  
  function perform2Times(fn){
    return performTimes(2,fn)
  }
  
  //对promise的fn设置执行失败最多可执行2次然后再去解决异步回调问题
  function set_2times_callback(fn){
    return composeFn(replaceCallback,perform2Times)(fn)
  }
  
  function dataURLtoFile(dataurl, filename) {//将base64转换为文件
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime});
  }
  
  //参数为一个函数，作用就是在若干时间内可以执行该函数，也提供了返回函数是清除计时器
  function helpMakeDelay(fn,time=1000){
    let timer = null
    return function(...args){
    clearTimeout(timer)
      timer = setTimeout(()=>{
        fn.apply(undefined,args)
      },time)
      return ()=>{
        console.log("清除了")
        clearTimeout(timer)
      }
    }
  }

  function deepCopy(obj){
    return JSON.parse(JSON.stringify(obj))
  }

  //根据容器的宽高与原图的宽高生成最大容的宽高
  function getMaxContainWh(sw,sh,ow,oh){
    let w=0,h=0;
    let obj = {
      'wh'(){
        h=sh
        w=ow/oh*h
        if(w>sw){
          return obj['hw']()
        }
        return [w,h]
      },
      'hw'(){
        w=sw
        h=oh/ow*w
        if(h>sh){
          return obj['wh']()
        }
        return [w,h]
      }
    }
    let typeName = sw>=sh?"wh":"hw";
    return obj[typeName]()
  }

  function dblclickFn(sfn,dfn,time = 300){
    let count=2;
    let timer = null;
    return function(...args){
      count--;
      if(timer){
        return
      }
      timer=setTimeout(()=>{
        if(count<=0){
          dfn.apply(undefined,args)
        }else{
          sfn.apply(undefined,args)
        }
        timer=null;
        count=2;
      },time);
    }
  }

function enumFn(obj){
  Object.keys(obj).forEach(key=>{
    obj[obj[key]]=key;
  })
  return obj;
}

function Lru_simple(num,arr,item){
  if(!item){return;}
  let idx = arr.indexOf(item);
  if (idx >= 0) {
    arr.splice(idx, 1)
  }
  arr.unshift(item)
  if (arr.length > num) {
    arr.pop()
  }
  return arr
}

function stopClick(fn){
  let clickBol = false
  return async (...args)=>{
    if(clickBol){
      console.log('点击过了');
      throw '点击过了';
      return
    }
    clickBol=true
    try{
      let res = await fn.apply(undefined,args)
      clickBol=false;
      return res;
    }catch(err){
      clickBol=false;
      throw err;
    }

  }
}

export {
    composeFn,
    replaceCallback,
    set_2times_callback,
    simpleDebounce,
    simpleThrottle,
    zerofn,
    getImgExt,
    cacheFn,
    curryN,
    heartfn,
    dataURLtoFile,
    performTimes,
    helpMakeDelay,
    deepCopy,
    getMaxContainWh,
    dblclickFn,
    enumFn,
    Lru_simple,
    stopClick
  }