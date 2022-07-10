const ci = require('miniprogram-ci');
const path = require('path');
const fs = require("fs");
const argv = process.argv.slice(2);
const packageInfo = require('../../package.json');
const absolutePath = fs.realpathSync(process.cwd());
const projectConfig = require("../../dist/build/mp-weixin/project.config.json");
(async () => {
  try {
    const project = new ci.Project({
      appid: projectConfig.appid,
      type: 'miniProgram',
      projectPath: path.resolve(absolutePath,'./dist/build/mp-weixin'),
      privateKeyPath: path.resolve(absolutePath,'./tools/weixin/private.key'),
    })
    const uploadResult = await ci.upload({
      project,
      version: packageInfo.version,
      desc: packageInfo.description,
      setting: {
        ...projectConfig.setting
      }
    })
    const previewResult = await ci.preview({
      project,
      desc: packageInfo.description,
      setting: {
        ...projectConfig.setting
      },
      qrcodeFormat: 'image',
      qrcodeOutputDest: path.resolve(absolutePath,'./tools/weixin/ercode.jpg'),
    })
  } catch(e){
    process.exit(1);
  }
})()
