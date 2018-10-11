const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const os = require('os');
const config = require('./config');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader')
const isProd = process.env.NODE_ENV === 'production';

// 提取css，提取多个来源时，需要实例化多个，并用extract方法
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const cssExtracter = new ExtractTextWebpackPlugin({
    // 直接导入的css, 提取时添加-css标识
    filename: '[name]-css.[contenthash:8].css',
    allChunks: true,
});

const sassExtracter = new ExtractTextWebpackPlugin({
    filename: '[name]-sass.[contenthash:8].css', // 直接导入的sass文件，提取时添加-sass标识
    allChunks: true,
});

// 获取html 文件名
const getFileNameList = (oPath) => {
    let fileList = [];
    const getFile = (nextPath) => {
        const files = fs.readdirSync(nextPath);
        if(!files.length)return;

        files.forEach(item => {
            const _p = path.join(nextPath, `./${item}`);
            const stat = fs.statSync(_p);

            if (stat.isDirectory()) {
                return getFile(_p);
            }

            if (/\.html$/.test(item) && stat.isFile()) {
                const pagePath = _p.substr(0, _p.lastIndexOf('.'));
                const isMac =  process.platform.indexOf('darwin') !== -1;
                const srcRoot = pagePath.substr(pagePath.lastIndexOf(!isMac ? 'src\\' : 'src/')+4);
                const enterName = srcRoot.split(!isMac ? '\\' : '/').join('_');
                fileList.push({
                    name: srcRoot,
                    path: _p,
                    pagePath,
                    enterName,
                    isEnter: fs.existsSync(`${pagePath}.js`)
                });
            }
        });
    }
    getFile(oPath);
    return fileList;
}

const htmlDirs = getFileNameList(config.HTML_PATH);
let HTMLPlugins = []; // 保存HTMLWebpackPlugin实例
let Entries = { // 保存入口列表
    // 公共模块
    vendor: [
        'core-js/shim', // es5
    ]
};

// 生成HTMLWebpackPlugin实例和入口列表
htmlDirs.forEach((page) => {

    let htmlConfig = {
        filename: `${page.name}.html`, // 文件名
        template: `${page.path}`, // 模板文件
        minify: isProd ? { // 压缩html
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            html5: true,
            minifyCSS: true,
            removeComments: true,
            removeEmptyAttributes: true,
        } : false,
    }

    let found = config.ignorePages.findIndex((val) => {
        return val === page.name;
    });

    if (found === -1 && page.isEnter) {
        // 有入口js 的html， 添加当前页的js 和公共js, 并将入口js写入Entries
        Entries[page.enterName] = `${page.pagePath}.js`;
        htmlConfig.chunks = ['vendor',  page.enterName];
    } else {
        // 默认加上vendor
        htmlConfig.chunks = ['vendor'];
    }

    const htmlPlugin = new HTMLWebpackPlugin(htmlConfig);
    HTMLPlugins.push(htmlPlugin);
});

const postcssPlugins = () => {
    let plugins = [
        require('autoprefixer')(),
    ];

    return plugins;
}

module.exports = {
    entry: Entries,
    output: {
        path: config.BUILD_PATH, // 打包路径， 本地物理路径
    },
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.js',
            'assets': path.resolve(__dirname, '../src/assets'),
        }
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    'scss': [
                        'vue-style-loader',
                        'css-loader',
                        'sass-loader'
                    ],
                    'sass': [
                        'vue-style-loader',
                        'css-loader',
                        'sass-loader?indentedSyntax'
                    ],
                    'html': [
                        'html-loader'
                    ],
                }
            }
        }, {
            test: /\.(png|jpg|gif|svg|jpge|mp3|woff|woff2|eot|ttf|otf)$/,
            include: [config.SRC_PATH],
            exclude: [config.NODE_MODULES_PATH],
            use: [{ // 图片文件小于8k时编译成dataUrl直接嵌入页面，超过8k回退使用file-loader
                loader: 'url-loader',
                options: {
                    limit: 8192, // 8k
                    name: '[name].[hash:8].[ext]',// 回退使用file-loader时的名称
                    publicPath: '/',
                    fallback: 'file-loader', // 当超过8192byte时，会回退使用file-loader
                }
            }],
        }, {
            test: /\.js$/,
            include: [config.SRC_PATH],
            exclude: [config.NODE_MODULES_PATH],
            use: ['babel-loader'],
        },{
            test: /\.(html)$/,
            use: [{
                loader: 'html-loader',
                options: {
                    root: './',
                }
            }]
        }, {
            test: /\.css$/,
            include: [config.SRC_PATH],
            exclude: [config.NODE_MODULES_PATH],
            use: cssExtracter.extract({
                fallback: 'style-loader',
                use: [ 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: postcssPlugins,
                    },
                }]
            })
        }, {
            test: /\.scss$/,
            include: [config.SRC_PATH],
            exclude: [config.NODE_MODULES_PATH],
            use: sassExtracter.extract({
                fallback: 'style-loader',
                use: [ 'css-loader',{
                    loader: 'postcss-loader',
                    options: {
                        plugins: postcssPlugins,
                    },
                }, 'sass-loader' ]
            })
        }]
    },
    plugins: [
        cssExtracter,
        sassExtracter,
        new VueLoaderPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        }),
        ...HTMLPlugins
    ]
};
