const { minidev, useDefaults } = require('minidev');

const path = require('path');
const fs = require("fs");
const argv = process.argv.slice(2);
const request = require("request");
const packageInfo = require('../../package.json');
const absolutePath = fs.realpathSync(process.cwd());

function getfileByUrl(url,fileName,dir){ 
  console.log('------------------------------------------------');
  console.log(url);
  console.log(fileName);
  console.log(dir);
  let stream = fs.createWriteStream(path.join(dir, fileName));
  request(url).pipe(stream).on("close", function (err) {
    console.log("文件" + fileName + "下载完毕");        
  });
}

(async () => {
  try {
    let [toolId,...privateKey] = argv
    //需要授权拿到toolid和私钥，文档去获取，过期也需要去获取
    useDefaults({
      config: {
        defaults: {
          'alipay.authentication.privateKey': privateKey.join(' ').replace(/\\n/g,'\n'),
          'alipay.authentication.toolId': toolId,
        }
      }
    });
    const uploadResult = await minidev.upload({
      appId: '2021003111611216',
      project: path.resolve(absolutePath,'./dist/build/mp-alipay'),
      version: packageInfo.version
    }, {
      onLog: (data) => {
        // 输出日志
        console.log(data);
      }
    })
    const { qrcodeUrl } = await minidev.preview({
      appId: '2021003111611216',
      project: path.resolve(absolutePath,'./dist/build/mp-alipay'),
    })
    console.log(qrcodeUrl)
    await getfileByUrl(qrcodeUrl,"ercode.jpg",path.resolve(absolutePath,'./tools/alipay'))
  } catch(e){
    process.exit(1);
  }
})()
