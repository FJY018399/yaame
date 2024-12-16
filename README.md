# Yaame-H5

该项目为yaame应用的内嵌h5项目

### 1、本地运行

* 使用git将项目clone到本地

  ```
  git clone http://gitlab.etouch.cn/yaame/yaame-h5.git
  ```

* npm install 安装依赖

* 下载依赖的时候，注意node版本，跟着Eone部署的版本安装node版本

* Mac可以使用n模块去管理不同版本的node依赖以供进行开发、学习

* 由于项目使用了内网部署的NPM的包，所以在install时需加入额外的命令 

  ```
  npm install --registry=http://npm.etouch.cn
  ```

* npm run start 或 npm run dev打开前端页面
* npm run dev --page=Thanksgiving 本地构建某单一页面



### 2、项目文档

* 该项目由vue + vue-cli + webpack构建

* webpack线上打包

* git分支有两个，测试分支是test，上线分支是master

* gitLab仓库地址: http://gitlab.etouch.cn/yaame/yaame-h5.git

* 测试地址: http://test-yaame.yaame.net/

* 正式地址: https://yaame.yaame.net/

  

#### 页面概述    

| 页面标题                     | 文件名             | 测试项目地址                                                 | 生产项目地址                                                 | 参数 |
| ---------------------------- | ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ---- |
| 我的访客                     | saw                | http://test-yaame.yaame.net/saw.html?is_full_screen=1        | https://yaame.yaame.net/saw.html?is_full_screen=1            |      |
| airwallex支付 接入第三方页面 | airwallex_payment  | http://test-yaame.yaame.net/airwallex_payment.html?is_full_screen=1 | https://yaame.yaame.net/airwallex_payment.html?is_full_screen=1 |      |
| 万圣节页面                   | AllSaintsDay       |                                                              |                                                              |      |
| 万圣节奖励页面               | AllSaintsDayReward |                                                              |                                                              |      |
| 公会所属 => 联系我们         | ContactUs          |                                                              |                                                              |      |
| 用户排行榜                   | contribution       |                                                              |                                                              |      |

不同产品入口文件在src目录下的pages目录里



#### Git 提交规范

```
BugFix: 修复bug
Enhancement: 功能的迭代，修改等
NewFeature：新的功能
Revert：版本回退等
```

新项目预备规范

```
'feat', // 新功能（feat）
'bug', // 此项特别针对bug号，用于向测试反馈bug列表的bug修改情况
'fix', // 修补bug
'ui', // 更新 ui
'docs', // 文档（documentation）
'style', // 格式（不影响代码运行的变动）
'perf', // 性能优化
'release', // 发布
'deploy', // 部署
'refactor', // 重构（即不是新增功能，也不是修改bug的代码变动）
'test', // 增加测试
'chore', // 构建过程或辅助工具的变动
'revert', // feat(pencil): add ‘graphiteWidth’ option (撤销之前的commit)
'merge', // 合并分支， 例如： merge（前端页面）： feature-xxxx修改线程地址
'build', // 打包
```



#### 项目发布流程

EONE (https://eone.etouch.cn/eone/#/workshop/pipeline/pipelineList)

- yaame（应用）
- 测试流水线：yaame-h5-w3c项目 => test-h5-w3c
- 正式流水线：yaame-h5-peanut项目 => prod-h5-peanut



### 3、国际化

```javascript
import Vuei18n from "vue-i18n";
Vue.use(Vuei18n);
import en from "./locale/en-US";
import id from "./locale/in-ID";
import zh from "./locale/zh-CN";
import tw from "./locale/zh-TW";
import ar from "./locale/ar-SA";
import { getLanguage } from '../../lib/device';
import { getQueryString } from '../../lib/utils';
let locale = getLanguage() || 'en';

if (getQueryString('language')) {
    locale = getQueryString('language');
}
if (['zh-hk', 'zh-tw', 'zh-mo', 'zh-cn'].indexOf(locale) > -1) {
    let localEnum = {
        'zh-hk': 'tw',
        'zh-tw': 'tw',
        'zh-mo': 'tw',
        'zh-cn': 'zh',
    };

    locale = localEnum[locale];
}
const i18n = new Vuei18n({
	locale, // 语言
	messages: {
		en, // 文案的英文版
        id,
        zh,
        tw,
        ar
	},
});
new Vue({
    i18n,
    render: h => h(App)
}).$mount('#app');
```



url中传入的国际化参数权重最重。





### 4、项目升级改版

```
git clone http://gitlab.etouch.cn/yaame/yaame-frontend.git
```

新项目使用了Vue3、TypeScript、Vite、Pinia、TailWindCSS等关键库，SPA架构，未开发MPA版本，MPA版本开发完成之后正式投入使用.
