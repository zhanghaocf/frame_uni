const axios = require('axios');
const path = require('path');
const FormData = require('form-data')
const fs = require('fs');
const absolutePath = fs.realpathSync(process.cwd());
const argv = process.argv.slice(2);
const package_info = require('../package.json')
async function sendMsg() {
    let [url,type='wx'] = argv;
    let typeParams = {
        wx:async ()=>{
            let key = await getImgKey('wx');
            return {
                msg_type:'post',
                content: {
                    post:{
                        zh_cn:{
                            title:'微信小程序——乐其爱结婚登记照预览版',
                            content:[
                                [
                                    {
                                        tag:'text',
                                        text:package_info.description
                                    }
                                ],
                               [
                                   {
                                       tag:'text',
                                       text:'乐其爱结婚登记照小程序上传到后台了，扫码测试ok去后台提审'
                                   }
                               ],
                               [
                                    {
                                        tag:'img',
                                        image_key:key,
                                        width:300,
                                        height:300
                                    }
                               ]
                            ]
                        } 
                    }
                }
            }
        },
        alipay:async ()=>{
            let key = await getImgKey('alipay');
            return {
                msg_type:'post',
                content: {
                    post:{
                        zh_cn:{
                            title:'支付宝小程序-乐其爱结婚登记照预览版',
                            content:[
                                [
                                    {
                                        tag:'text',
                                        text:package_info.description
                                    }
                                ],
                               [
                                   {
                                       tag:'text',
                                       text:'乐其爱结婚登记照小程序上传到后台了，扫码测试ok去后台提审'
                                   }
                               ],
                               [
                                    {
                                        tag:'img',
                                        image_key:key,
                                        width:300,
                                        height:300
                                    }
                               ]
                            ]
                        } 
                    }
                }
            }
        }
    }
    let d = await typeParams[type]()||{}
    return axios({
        headers: {'Content-Type': 'application/json'},
        method: 'post',
        url,
        data: d
    });
}

async function getImgKey(type) {
    let pathname = type==='wx'?'weixin':"alipay"
    try{
        let res = await axios('https://operating.applet.leqi.us/fly/getToken')
        let url = path.resolve(absolutePath,'./tools/'+pathname+'/ercode.jpg')
        let da = new FormData()
        da.append('image_type','message')
        da.append('image',fs.createReadStream(url))
        let result = await axios.post('https://open.feishu.cn/open-apis/im/v1/images',da,{
            headers:{
                ...da.getHeaders(),
                "Authorization": "Bearer "+ res.data.token
            }
        });
        return result.data.data.image_key
    }catch(err){
        console.log(err)
    }
    
}

(async () => {
    try {
        let res = await sendMsg();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();