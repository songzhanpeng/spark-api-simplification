# 星火Api简化 后端

### 简介
  - 该后端主要以简化星火接口请求为目的编写的，不支持上下文。不出意外后续不会更新

### 准备材料
  - 一个会转圈的脑子(我代码写的很烂，脑子不转圈会出现各种奇怪的报错)
  - 星火API接口应用(没有就去官网申请，有免费额度)

### 安装
  1. 安装nodejs 需支持ES6 (推荐nodejs版本 > 16)
  2. 打包该仓库，解压后安装依赖
   ```bash
   npm install
   ```
  3. 启动后端
   ```bash
   node app
   ```

### Api 请求格式
  - POST请求 接口：`http://localhost:3033/msg/post`
  ```JSON
  {
    "msg": "对话内容"
  }
  ```

  - GET请求 接口: `http://localhost:3033/msg/get/` (注:该请求方式目前不完善，建议使用POST)
  ```
  http://localhost:3033/msg/get/对话内容
  ```
### Api 返回格式
- 正常返回
```JSON
{
  "code": 200,
  "message": "你好，有什么可以帮助你的吗？" //Ai回复的内容
}
```
 - 429 请求频繁 (触发条件:1分钟内请求5次)
```JSON
{
  "code": 429,
  "message": "请求过于频繁，请稍后再试。"
}
```
### 其他
[我的个人博客，欢迎光临](https://blog.moqy.top)