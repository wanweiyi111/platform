// vue.config.js
module.exports = {
    devServer: {
        proxy: {
           /*'/api/v1': {
                // target: 'http://new.uvcity.cn:8888/',
                target: 'http://192.168.3.183/',
                // target: 'http://127.0.0.1:89/',
                // target: 'http://192.168.3.130:89/',
                changeOrigin: true,
                // ws: true,
                pathRewrite: {
                    '^/api/v1': '/api/v1'
                }
            },*/
            '/api/report': {
				target: 'http://127.0.0.1:91/',
                //target: 'http://iot.uvcity.cn/',
                 //target: 'http://new.uvcity.cn:8888/',
                // target: 'http://120.24.34.198/',
                changeOrigin: true,
                // ws: true,
                pathRewrite: {
                    '^/api/report': '/api/report'
                }
            },
            '/api/token': {
				target: 'http://127.0.0.1:89/',
                //target: 'http://192.168.3.183/',
                // target: 'http://new.uvcity.cn:8888/',
                // target: 'http://120.24.34.198/',
                changeOrigin: true,
                // ws: true,
                pathRewrite: {
                    '^/api/token': '/api/token'
                }
            },

        },
    },
    configureWebpack: {
        module: {
            rules: [{
                test: /\.worker\.js$/, // 以 .worker.js 结尾的文件将被 worker-loader 加载
                use: {
                    loader: 'worker-loader',
                    options: {
                        inline: true
                        // fallback: false
                    }
                }
            }]
        }

    },
    chainWebpack: config => {
        // glb Loader
        config.module
            .rule('glb')
            .test(/\.(glb|gltf)$/)
            .use('url-loader')
            .loader('url-loader')
            .end()
    },
    css: {
        loaderOptions: {
            less: {
                modifyVars: {
                    'btn-border-radius-base': '5px',
                    'btn-default-bg': 'transparent',
                    'primary-color': '#111853',
                    'primary-5': '#3BF9FB',
                    'primary-7': '#DDFDFF',
                    'heading-color': '#DDFDFF',
                    'heading-color-dark': '',
                    'text-color': '#DDFDFF',
                    'text-color-secondary': '#BACEE4',
                    'text-color-dark': '#BACEE4',
                    'border-width-base': '1px',
                    // 'text-color-secondary-dark': '',
                    // 'link-color': '#1DA57A',
                    'link-color': 'rgba(251,185,65,5)',
                    'link-hover-color': 'rgba(251,185,65,.6)',
                    // 'link-active-color': '',
                    'border-color-base': '#93AFCF',
                    'border-color-split': '#93AFCF',
                    'border-radius-base': '2px',
                    'normal-color': '#BACEE4',
                    'body-background': 'transparent',
                    'background-color-light': 'transparent',
                    'component-background': 'transparent',
                    'item-active-bg': 'transparent',
                    'item-hover-bg': 'transparent',
                    'collapse-header-padding': '10px',
                    'collapse-header-bg': 'transparent',
                    'collapse-content-padding': '5px 20px',
                    'collapse-content-bg': 'transparent',
                    'table-header-bg': 'rgba(2,22,82,0.40)',
                    'table-header-color': '#BACEE4',
                    'table-row-hover-bg': 'rgba(138,199,247,0.10)',
                    'table-selected-row-bg': 'rgba(138,199,247,0.10)',
                    'table-expanded-row-bg': 'rgba(138,199,247,0.00)',
                    'table-padding-vertical': '14px',
                    'table-padding-horizontal': '10px',
                    'table-border-radius-base': '0',
                    'tabs-title-font-size': '16px',
                    'tabs-ink-bar-color': '#DDFDFF',
                    'input-color': '#BACEE4',
                    'input-border-color': '#93AFCF',
                    'input-bg': 'transparent',
                    'checkbox-check-color': 'transparent'
                },
                // 解决antD   'Inline JavaScript is not enabled'  问题
                javascriptEnabled: true
            }
        }
    },
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    // publicPath: './'  //路由hash可用
    publicPath: '/'  //路由histroy可用
}