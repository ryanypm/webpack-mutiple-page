// browsers: ["android >= 4.0", "ios>=7.0", "ie>=8", "> 1% in CN"],
module.exports = {
    plugins: {
        'autoprefixer': {
            browsers: ["android >= 4.0", "ios>=8.0"],
            //是否美化属性值 默认：true
            // cascade: true,
            //是否去掉不必要的前缀 默认：true
            remove: false
        }
    }
};
