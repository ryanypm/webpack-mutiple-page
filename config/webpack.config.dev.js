const webpackBase = require('./webpack.config.base');
const config = require('./config');

const webpack = require('webpack');
// 用于合并配置文件
const webpackMerge = require('webpack-merge');

const webpackDev = {
    output: {
        filename: 'js/[name].[hash:8].bundle.js', // 开发环境用hash
    },
    devtool: 'cheap-module-eval-source-map', // 开发环境设置sourceMap，生产环境不使用
    devServer: {
        // 启动server 不会在本地生成文件，所有文件会编译在内存中
        contentBase: './build/',
        overlay: true, // 错误信息直接显示在浏览器窗口中
        inline: true, // 实时重载的脚本被插入到你的包(bundle)中，并且构建消息将会出现在浏览器控制台
        hot: true, // 热更新
        host: '0.0.0.0',
        index: 'index.html', // 默认启动页
        useLocalIp: true, // 使用本机ip打开server, 而不是localhost
    },
    plugins: [
        new webpack.NamedModulesPlugin(), // 开发环境用于标识模块id
        new webpack.HotModuleReplacementPlugin(), // 热替换插件
    ]
}

module.exports = webpackMerge(webpackBase, webpackDev);
