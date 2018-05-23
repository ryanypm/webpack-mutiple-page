const path = require('path');

const PROJECT_PATH = process.cwd();

const config = {
    PROJECT_PATH, // 项目目录
    CONFIG_PATH: path.join(__dirname), // 配置文件目录
    SRC_PATH: path.join(PROJECT_PATH, './src/'), // 原文件目录
    BUILD_PATH: path.join(PROJECT_PATH, './build/'), // 打包目录
    PUBLIC_PATH: path.join(PROJECT_PATH, './src/assets/'), // 资源目录
    HTML_PATH: path.join(PROJECT_PATH, './src/'), // html
    NODE_MODULES_PATH: path.join(PROJECT_PATH, './node_modules/'),
    ignorePages: [], // 没有入口js文件的html
}

module.exports = config;
