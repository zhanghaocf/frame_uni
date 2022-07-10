import {
	replaceCallback,
	performTimes
} from "./base.js"
import {
	//#ifdef MP-ALIPAY
	appid,
    pid
	//#endif
} from "@/utils/config.js"

//这里放uniapp多处地方用的函数
function getCode() {
	return new Promise((resolve, reject) => {
		uni.login({
			success: res => {
				resolve(res.code)
			}
		})
	})
}

function alertMsg(title, content, showCancel = false, confirmtxt = '确定', cancelText = '取消') {
	return new Promise((resolve, reject) => {
		uni.showModal({
			title,
			content,
			showCancel,
			cancelText,
			confirmText: confirmtxt,
			success(res) {
				res.confirm && resolve('');
				res.cancel && reject('')
			}
		});
	});
}

function toastMsg(title, icon = 'none') {
	return new Promise((resolve, reject) => {
		uni.showToast({
			title,
			icon
			// #ifdef MP-WEIXIN
			, mask: true
			//#endif
		})
		setTimeout(() => {
			resolve()
		}, 1000)
	})
}

function loadingShow(txt) {
	return (fn) => {
		return (...list) => {
			let pageArr = getCurrentPages();
			let page = pageArr.slice(-1)[0];
			page&&uni.$emit(`loading:${page.route}`,txt)
			return fn.apply(this, list).then(res => {
				page&&uni.$emit(`loading:${page.route}`,'')
				return res
			}).catch(err => {
				page&&uni.$emit(`loading:${page.route}`,'')
				throw err
			})
		}
	}
}


let showErrorFlag = true;//防止一瞬间出现多次错误提示
function errorHandle(fn) {
	return (...args) => {
		return fn.apply(this, args).catch(msg => {
			console.log({msg})
			//自己取消abort时不报错
			if(msg.errMsg==='request:fail abort'){
				throw '自己取消';
			}
			let warning = typeof msg === 'string' ? msg : '系统繁忙，请稍后重试'
			showErrorFlag&&uni.showModal({
				title: '提示',
				showCancel: false,
				content: warning,
			}).then(res=>{
				showErrorFlag=true;
			});
			showErrorFlag=false;
			throw warning
		})
	}
}

function exportAbort(fn){
	let obj = {};
	const ha = (...args) => {
		let t = fn.apply(this, args);
		t.requestObj&&(obj.requestObj=t.requestObj);
		return t;
	}
	ha.abort=()=>{
		obj.requestObj&&obj.requestObj.abort();
	}
	return ha;
}

function getImageInfo(src) {
	
	return new Promise((resolve, reject) => {
		uni.getImageInfo({
			src,
			success(res) {
				console.log("获取图片信息:::",res);
				resolve(res)
			},
			fail(err) {
				console.log("err::", err)
				reject('获取文件信息失败')
			}
		})
	})
}

function getSystemInfo() {
	return new Promise((resolve, reject) => {
		uni.getSystemInfo({
			success(res) {
				resolve(res)
			}
		})
	})
}

function chooseImage(sourceType) {
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count:1,
			sizeType:['compressed','original'], //有点小问题暂且不提供原图
			...sourceType&&{sourceType},
			success: (chooseImageRes) => {
				const tempFilePaths = chooseImageRes.tempFilePaths;
				resolve(tempFilePaths[0])
			},
			fail(err) {
				handleimageerror(err, reject)
			  }
		});
	})
}

function getProvider() {
	return new Promise((resolve, reject) => {
		uni.getProvider({
			service: 'payment',
			success: function (res) {
				resolve(res.provider[0])
			}
		});
	})
}

function requestPayment(obj) {
	return new Promise((resolve, reject) => {
		uni.requestPayment({
			...obj,
			success:function(res) {
				resolve(res)
			},
			fail:function(err){
				console.log('支付fail',err)
				reject(err)
			},
			
		})
	})
}

function payway(obj) {
	let provider = ''
	return getProvider().then(res => {
		let { pay_params } = obj
		provider = res
		console.log("提供商：：：",{res,obj})
		let pobj = {
			provider: res,
			...res === 'alipay' && {
				orderInfo: pay_params.trade_no
			},
			...res === 'wxpay' && {
				...pay_params
			}
		}
		return requestPayment(pobj)
	}).then(res => {
		console.log("支付之后的参数:::", res, provider)
		let { resultCode } = res
		if (provider === 'alipay' && resultCode !== '9000') {
			return Promise.reject('支付失败')
		}
		return res
	}).catch((err)=>{
	
		return Promise.reject(err)
	})
}
function handlePhotoerror(msg, reject) {
	if (typeof msg === 'string') {
		reject(msg)
		return
	}
	let { errMsg } = msg
	switch (errMsg) { //uniapp错误处理
		case 'saveImageToPhotosAlbum:fail user does not allow authorization': //永久不允许授权
		case 'saveImageToPhotosAlbum:fail auth deny':
		alertMsg('提示', '由于您未授权保存图片到相册该功能，导致该功能不可用', false, '去授权').then(res => {
			uni.openSetting()
		})
		break;
		default:
		break;
	}
	reject(errMsg)
}
function handleimageerror(msg, reject) {
	if (typeof msg === 'string') {
	  reject(msg)
	  return
	}
	let { errMsg } = msg
	switch (errMsg) { //uniapp错误处理
	  case 'chooseImage:fail User cancel select video.':
	  case 'chooseImage:fail User cancel take picture.':
	  case 'chooseImage:fail 用户取消操作':
	  case 'chooseImage:fail cancel':
		break;
	  case 'chooseImage:fail user does not allow authorization': //永久不允许授权
	  case 'chooseImage:fail 用户不允许授权':
		alertMsg('提示', '由于您未授权该功能，导致该功能不可用', false, '去授权').then(res => {
		  uni.openSetting()
		})
		break;
	  default:
		alertMsg('提示', errMsg)
		break;
	}
	reject(errMsg)
	// errMsg!=='chooseImage:fail cancel' && reject('图片上传失败')
  }
function saveFile(filePath) {
	return new Promise((resolve, reject) => {
		uni.saveImageToPhotosAlbum({
			filePath,
			success(res) {
				resolve(res)
			},
			fail(err){
				console.log("lalalla:::",err)
				handlePhotoerror(err,reject)
			}
		})
	})
}

function uploadPic({url,filePath,formData}){
    return new Promise((resolve,reject)=>{
        uni.uploadFile({
            url,
            fileType:'image',
            filePath,
			// #ifdef MP-ALIPAY
			hideLoading:true,
			// #endif
            name:'file',
            formData,
            success(res){
                resolve(res)
            }
        })
    })
}

function downloadImg(url){
	return new Promise((resolve,reject)=>{
		uni.downloadFile({
			url,
			success(res){
				if (!res.statusCode||res.statusCode === 200) {
					resolve(res)
				}
			},
			fail(err){
				console.log("errrrr:::",err)
			}
		})
	})
}

function saveLocalPhoto(url) {
	// #ifdef MP-ALIPAY
	return saveFile(url)
	// #endif
	// #ifndef MP-ALIPAY
	return getImageInfo(url).then(res => {
		let { path } = res
		return saveFile(path)
	})
	// #endif 
}
//#ifdef MP-ALIPAY
function testImgRisk(url) {
	// return Promise.resolve(key);
	return new Promise((resolve, reject) => {
	  my.ap.imgRisk({
		pid,
		appId: appid,
		bizContext: {
			"risk_type": "img_risk",
			"content": url
		},
		success: (result) => {
		  let apply_id = JSON.parse(result.riskResult).apply_id
		  const getImgRiskLun = performTimes(3,getImgRiskResult)
		  setTimeout(()=>{
			return getImgRiskLun(apply_id).then(res=>{
			  if(res==='REJECTED'){
				reject('含有违规图片')
			  }else{
				resolve('');
			  }
			}).catch(err=>{
			  resolve('');
			})
		  },500)
		},
		fail: () => {
		  reject("发生错误")
		}
	  })
	})
  }
  
  function getImgRiskResult(apply_id){
	return new Promise((resolve,reject)=>{
		my.ap.imgRiskCallback({
		  pid,
		  appId: appid,
		  bizContext: {
			"risk_type": "img_risk_result",
			"apply_id": apply_id
		  },
		  success: (res3) => {
			let action = JSON.parse(res3.riskResult).action
			if (action === '') {
			  reject("")
			} else {
			  resolve(action);
			}
		  }, fail: () => {
			resolve('');
		  }
		})
	})
  }
// function testImgRisk(url) {
// 	return new Promise((resolve, reject) => {
// 		my.ap.imgRisk({
// 			pid,
// 			appId: appid,
// 			bizContext: {
// 				"risk_type": "img_risk",
// 				"content": url
// 			},
// 			success: (result) => {
// 				setTimeout(() => {
// 					my.ap.imgRiskCallback({
// 						pid,
// 						appId: appid,
// 						bizContext: {
// 							"risk_type": "img_risk_result",
// 							"apply_id": JSON.parse(result.riskResult).apply_id
// 						},
// 						success: (res3) => {
// 							if (JSON.parse(res3.riskResult).action == 'REJECTED') {
// 								reject("含有违规图片")
// 							} else {
// 								resolve('');
// 							}
// 						}, fail: () => {
// 							resolve('');
// 						}
// 					})
// 				}, 500)
// 			},
// 			fail: () => {
// 				reject("发生错误")
// 			}
// 		})
// 	})
// }
//#endif
// #ifdef MP-WEIXIN
function getVideoAd(){
	return new Promise((resolve,reject)=>{
		let videoAd = null
		// 在页面onLoad回调事件中创建激励视频广告实例
		if (wx.createRewardedVideoAd) {
			videoAd = wx.createRewardedVideoAd({
				adUnitId: 'adunit-9b607230bfe2b814'
			})
			videoAd.onLoad(() => {})
			videoAd.onError((err) => {
				alertMsg('友情提示',err.errMsg)
			})
		}
		resolve(videoAd)
	})
	
}
const getVideoAdS = replaceCallback(getVideoAd)
function ShowVideo(){
	// 在页面中定义激励视频广告
	uni.showLoading({
		title: '广告加载中'
	});
	function oprfn(res,resolve,reject){
		if(res.isEnded){
			resolve('看完了')
		}else{
			reject('没看完')
		}
	}
	let videoAd = null
	return getVideoAdS().then(res=>{
		videoAd =res
		return new Promise((resolve,reject)=>{
			if(!videoAd){
				reject('无广告')
			}
			videoAd.show().then(res=>{
				uni.hideLoading();
			}).catch(() => {
				// 失败重试
			videoAd.load()
				.then(() => {
					videoAd.show();
					uni.hideLoading();
				})
				.catch(err => {
					console.log("广告err:::",err)
					reject('失败')
				})
			})
			videoAd.onClose((res) => {
				oprfn(res,resolve,reject)
			})
		})
	}).then(res=>{
		videoAd.offClose()
		return res
	}).catch(err=>{
		videoAd.offClose()
		uni.hideLoading();
		throw err
	})
}
// #endif
function alertError(err) {
	console.log("err:::",err)
	err = typeof err === 'string' ? err : '发生错误啦，请稍后重新操作哟～'
	if(err==='chooseImage:fail cancel' || err==='chooseImage:fail 用户取消操作'||err==='chooseImage:fail User cancel take picture.'||err==='chooseImage:fail User cancel select video.'||err==='saveImageToPhotosAlbum:fail auth deny'){
		return
	}
	return alertMsg('提示', err)
}
const getSystemInfoS = replaceCallback(getSystemInfo)

function imageLoadHelp(url,needwh=false){
	// #ifndef H5
	let {globalData:{urlToTemp}} = getApp()
	let val = urlToTemp[url]
	if(val){
		if(typeof val === 'string' && needwh){
			console.log('需要获取宽高');
			return getImageInfo(url).then(res=>{
				return ({
					...res,
					path:val
				})
			})
		}
		val = typeof val === 'string'?{path:val}:val;
		return Promise.resolve(val)
	}else{
		return getImageInfo(url).then(res=>{
			urlToTemp[url] = res
			return res
		})
	}
	
	// #endif
	// #ifdef H5
	return new Promise((resolve,reject)=>{
		let {globalData,globalData:{h5LoadedUrl={}}} = getApp()
		let val = h5LoadedUrl[url]
		if(val){
			console.log("拿了加载好的图片")
			return resolve({path:val})
		}
		let img=new Image();
		img.onload=function(){
			h5LoadedUrl[url]=this
			globalData.h5LoadedUrl=h5LoadedUrl
			resolve({path:this})
		}
		img.crossOrigin="anonymous"; //关键
		img.src=url;
	})
	// #endif
}
function getDotLong(left,right){
    return Math.sqrt(Math.pow(right[0]-left[0],2)+Math.pow(right[1]-left[1],2));
}

function joinUrl_s(obj, needEncode = true) {
	let urlarr = [];
	Object.keys(obj).forEach(item => {
		let val = obj[item];
		typeof val === 'object' && (val = JSON.stringify(val))
		if (needEncode) {
			urlarr.push(`${item}=${encodeURIComponent(val)}`)
		} else {
			urlarr.push(`${item}=${val}`)
		}
	});
	return urlarr.join('&');
}

function joinUrl(obj, url, needEncode = true) {
	url += joinUrl_s(obj, needEncode);
	return url
}

export {
	getCode,
	alertMsg,
	alertError,
	loadingShow,
	errorHandle,
	getImageInfo,
	imageLoadHelp,
	getSystemInfoS,
	chooseImage,
	payway,
	saveLocalPhoto,
	toastMsg,
	getDotLong,
	//#ifdef MP-ALIPAY
	testImgRisk,
	//#endif
	// #ifdef MP-WEIXIN
	ShowVideo,
	getVideoAdS,
	// #endif
	joinUrl,
	uploadPic,
	exportAbort
}