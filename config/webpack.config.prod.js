const webpackBase = require('./webpack.config.base');
const config = require('./config');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpack = require('webpack');
// 用于合并配置文件
const webpackMerge = require('webpack-merge');
// 用于重新构建时清除原来的构建内容
const CleanWebpackPlugin = require('clean-webpack-plugin');
// 压缩
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const webpackProd = {
    output: {
        filename: 'js/[name].[chunkhash:8].bundle.js',
    },
    plugins: [
        // 生产环境用于标识模块id
        new webpack.HashedModuleIdsPlugin(),
        new CleanWebpackPlugin(['./build/'], {
            root: config.PROJECT_PATH,
        }),
        new webpack.optimize.CommonsChunkPlugin({
            // 抽取公共文件
            name: 'vendor',
            filename: 'js/vendor.[chunkhash:8].bundle.js'
        }),
        new UglifyJSPlugin()
    ]
}

module.exports = webpackMerge(webpackBase, webpackProd);
