# cp3-es6
## 分支代码简介
- master 主分支, 2D版本
- Cesium分支，基于cesium库构建的3d版本，已弃用
- Earthsdk分支，3d版本分支，除了地图部分，其他代码与2d版本一致（可能有部分代码未同步）
- etc分支，2d版本带etc功能
该项目使用vue-cli 3.0构建，请参考vue项目安装及运行方法

## Project setup
```
请先确认安装nodejs，
然后cd 到当前目录，执行
npm install
```

### project config
配置mqtt服务器及流媒体服务器
public/js/config.js
```

惠州环境：
window.EnvConfig = {
  MQTT: { //mqtt服务器地址及端口
    ip: '120.24.34.198',
    port: '20003'
  },
  H5SS: { //流媒体服务器地址及端口
    ip: '120.24.34.198',
    port: '18080'
  }
}

```

配置接口代理
vue.config.js
```
    devServer: {
        proxy: {
            '/api/v1': {
                target: 'http://120.24.34.198:18080/',
                // target: 'http://127.0.0.1:89/',
                // target: 'http://192.168.3.130:89/',
                changeOrigin: true,
                // ws: true,
                pathRewrite: {
                    '^/api/v1': '/api/v1'
                }
            },
            '/api': {
                // target: 'http://192.168.3.67/',
                // target: 'http://192.168.3.183/',
                target: 'http://120.24.34.198/',
                // target: 'http://192.168.3.130:89/',
                changeOrigin: true,
                // ws: true,
                pathRewrite: {
                    '^/api': '/api'
                }
            }
        }
    },
```

## 运行命令
### Compiles and hot-reloads for development
```
npm run serve
```

### 打包命令
```
npm run build
```
以上命令执行成功后，会产出dist目录，需要发布到生产环境的内容都在该目录下

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```
