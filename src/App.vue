<script>
import {
  getSystemInfoS,
  alertMsg
} from "@/utils/util/utils.js";

export default {
  onLaunch: function ({query={}}) {
    //[启动]
    let {ShareTimelineCode} = query;
   
    // #ifndef H5
    this.autoUpdate();
    // #endif
    this.getLogin();
    this.getSystemInfo();
  },

  
  globalData:{
    
  },
  methods:{
    getLogin(ShareTimelineCode){
      
    },
    getSystemInfo(){
      getSystemInfoS().then(res=>{
        let {windowWidth,windowHeight,pixelRatio,platform} = res;
        this.globalData.ratio = windowWidth/750;
        this.globalData.windowHeight=windowHeight;
        this.globalData.pixelRatio = pixelRatio;
        this.globalData.isIos=/ios/i.test(platform);
      })
    },
    // #ifndef H5
    autoUpdate(){
      const updateManager = uni.getUpdateManager && uni.getUpdateManager();
      if (!updateManager){
        return
      }
      updateManager.onUpdateReady(function () {
        alertMsg('更新提示','新版本已经准备好，请重启应用',false,'我知道了').then(res=>{
          updateManager.applyUpdate()
        })
      })
    }
    // #endif
  }
}
</script>

<style>
/*每个页面公共css */
.clickcls{
  opacity: .7;
}
.oneline {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.twoline {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-break: break-all;
  text-overflow: ellipsis;
}
.threeline {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  word-break: break-all;
  text-overflow: ellipsis;
}
.disnone{
  display: none!important;
}
</style>
