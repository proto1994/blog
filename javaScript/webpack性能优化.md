1. 优化开发体验

   - 缩小文件的搜索范围

     - 优化loader配置，通过include和exclude配置

     - 优化resolve.modules配置，默认配置都是先从当前目录./node_modules查找，可通过下面配置直接从项目目录查找

       ```js
       modules.exports = {
       	resolve: {
       		modules: [path.resolve(__dirname, 'node_modules')]
       	}
       }
       ```

     - 优化module.noParse配置，让webpack忽略对没有采用模块化的文件进行递归解析处理

2. 优化输出质量

   - 使用HappyPack&thread-loader，多线程打包
   - 使用缓存，HardSourceWebpackPlugin&cache-loader



常用webpack插件：

1. #### webpack-bundle-analyzer & webpack-dashboard 查看模块大小

2. speed-measure-webpack-plugin 分析打包速度