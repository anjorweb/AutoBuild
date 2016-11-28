# AutoBuild

前端构建工具。

主要功能：自动刷新、Less解析、私有前缀补全、图片Base64、css JS 压缩合并

## 命令行

`gulp watch`

调试使用，创建本地服务器并打开一个http://localhost:3030，自动刷新。

**这时候只会对less操作，不进行压缩合并，前缀补全等等操作**

`gulp publish`

发布代码。