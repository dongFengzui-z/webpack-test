const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    // 打包的入口配置 ""打包的路径
    entry: './src/index.js',
    // 打包之后存放的位置
    output: {
        filename: 'build.js', //打包之后的名字 [name]是原先的名字 index-bundel.js
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader"
                ]
            },
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                    "less-loader"
                ]
            },
            // 处理图片
            {
                // 问题：默认处理不了html中img图片
                // 处理图片资源
                test: /\.(jpg|png|gif)$/,
                // 使用一个loader
                // 下载 url-loader file-loader
                loader: 'url-loader',
                options: {
                    // 图片大小小于8kb，就会被base64处理
                    // 优点: 减少请求数量（减轻服务器压力）
                    // 缺点：图片体积会更大（文件请求速度更慢）
                    limit: 8 * 1024,
                    // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
                    // 解析时会出问题：[object Module]
                    // 解决：关闭url-loader的es6模块化，使用commonjs解析
                    esModule: false,
                    // 给图片进行重命名
                    // [hash:10]取图片的hash的前10位
                    // [ext]取文件原来扩展名
                    name: '[hash:10].[ext]'
                }
            },
            // {
            //     test: /\.html$/,
            //     // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
            //     loader: 'html-loader'
            // }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            // 要注意：相对路径是从项目根路径出发的，！！！！！！！！！！！
            // template: "./public/index.html",
        })
    ],
    mode: 'development',

    devServer: {
        // disableHostCheck: true,
        // historyApiFallback: true,
        // noInfo: true,
        hot: true,
        // inline: true,
        host: "0.0.0.0",
        // useLocalIp: true, // 使用本地Ip打开页面
        port: 8099,
        open: true,
        compress: true, // 开启 gzip压缩 传输速率提高(一般html这种文件不会压缩)
        // 配置 proxy 代理 解决跨域问题
        proxy: {
            // 相当于在项目中请求 /api地址 就是请求后面配置的地址
            "/api": {
                target: "http://www.baidu.com",
                // 路径重写 将 /api开头的请求地址的 /api 给替换为 "" 空字符串
                pathRewrite: {
                    "^/api": ""
                },
                // 默认不支持 转发到https的服务器上，如果需要，设置 secure为false
                secure: false,
                // 是否更新代理后请求的headers中的host地址
                changeOrigin: true
            }
        }
    },
}