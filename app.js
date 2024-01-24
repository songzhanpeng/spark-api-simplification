import YAML from 'yaml'
import fs from 'fs'
import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import sparkdemo from './model/spark.js'
import WebSocket from 'ws'
import rateLimit from 'express-rate-limit'

if(!fs.existsSync(`./config/spark.yaml`)){
    fs.mkdirSync(`./config`)
    let data = fs.readFileSync(`./defSet/spark.yaml`, `utf-8`)
    fs.writeFileSync(`./config/spark.yaml`, data, `utf-8`)
    console.log(`请在config/spark.yaml中填写参数`)
    process.exit()
}

const app = express()
let cfg = fs.readFileSync(`./config/spark.yaml`, `utf-8`)
try {
    cfg = YAML.parse(cfg)
} catch(err) {
    console.log(`配置文件存在格式错误！\n${err}`)
    process.exit()
}

const port = cfg.port || 3033;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { code: 429, message: '请求过于频繁，请稍后再试。' },
  });

app.post(`/msg/post`, limiter, async (req, res) => {
    let msg = req.body.msg
    console.log(`收到的消息:` + msg)
    const spark = new sparkdemo(cfg.appId, cfg.apiKey, cfg.apiSecret, cfg.domain, cfg.version)
    let finalUrl = await spark.generateFinalUrl()
    const sparkMsg = new WebSocket(finalUrl)
    let requestPayload = {
        header: {
            app_id: cfg.appId,
            uid: '123'
        },
        parameter: {
            chat: {
                domain: cfg.domain,
                temperature: 0.5,
                max_tokens: 1024
            }
        },
        payload: {
            message: {
                text: [
                    { role: 'user', content: msg }
                ]
            }
        }
    }
    sparkMsg.on('open', () => {
        sparkMsg.send(JSON.stringify(requestPayload))
    })
    let completeMessage = '';
    let ai_msg
    sparkMsg.on('message', async (data) => {
        const partialMessage = JSON.parse(data);
        if (partialMessage.payload.usage) {
            let myArray = partialMessage.payload.choices.text
            completeMessage += myArray[0].content;
            console.log('Ai的消息:', JSON.stringify(completeMessage));
            ai_msg = completeMessage
            completeMessage = '';
            res.json({ code: 200, message: ai_msg })
          } else {
            let myArray = partialMessage.payload.choices.text
            completeMessage += myArray[0].content;
          }
    })
})

app.get(`/msg/get/:msg`, async (req, res) => {
    let msg = req.params.msg
    console.log(`收到的消息:` + msg)
    const spark = new sparkdemo(cfg.appId, cfg.apiKey, cfg.apiSecret, cfg.domain, cfg.version)
    let finalUrl = await spark.generateFinalUrl()
    const sparkMsg = new WebSocket(finalUrl)
    let requestPayload = {
        header: {
            app_id: cfg.appId,
            uid: '123'
        },
        parameter: {
            chat: {
                domain: cfg.domain,
                temperature: 0.5,
                max_tokens: 1024
            }
        },
        payload: {
            message: {
                text: [
                    { role: 'user', content: msg }
                ]
            }
        }
    }
    sparkMsg.on('open', () => {
        sparkMsg.send(JSON.stringify(requestPayload))
    })
    let completeMessage = '';
    let ai_msg
    sparkMsg.on('message', async (data) => {
        const partialMessage = JSON.parse(data);
        if (partialMessage.payload.usage) {
            let myArray = partialMessage.payload.choices.text
            completeMessage += myArray[0].content;
            console.log('Ai的消息:', JSON.stringify(completeMessage));
            ai_msg = completeMessage
            completeMessage = '';
            res.json({ code: 200, message: ai_msg })
          } else {
            let myArray = partialMessage.payload.choices.text
            completeMessage += myArray[0].content;
          }
    })
})

// 创建一个返回随机图片信息的接口
app.get('/random-image', (req, res) => {
    const data = fs.readFileSync(`./output.json`, `utf-8`)
    const images = JSON.parse(data);
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImage = images[randomIndex];
  
    // 拼接图片的完整路径
    const imagePath = path.join(`http://localhost:${port}`, randomImage.filename);
  
    // 返回随机图片的信息
    res.json({
      filename: randomImage.filename,
      path: imagePath,
      size: randomImage.size,
      last_modified: randomImage.last_modified,
    });
  });

app.listen(port, () => {
    console.log(`星火Api简化 已在 http://localhost:${port} 启动`);
});