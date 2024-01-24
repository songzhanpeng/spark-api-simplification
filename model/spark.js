import crypto from 'crypto';
import querystring from 'querystring';

class sparkdemo {
  constructor(appId, apiKey, apiSecret, domain, version) {
    this.appId = appId;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.domain = domain;
    this.version = version;
  }

  async generateAuthorization(date, path) {
    const requestLine = `GET ${path} HTTP/1.1`;
    const tmp = `host: spark-api.xf-yun.com\ndate: ${date}\n${requestLine}`;

    const hmac = crypto.createHmac('sha256', this.apiSecret);
    hmac.update(tmp);

    const signature = hmac.digest('base64');
    const authorizationOrigin = `api_key="${this.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;

    return Buffer.from(authorizationOrigin).toString('base64');
  }

  async generateAuthParams(path) {
    const date = new Date().toUTCString();
    const authorization = await this.generateAuthorization(date, path);

    return {
      authorization,
      date,
      host: 'spark-api.xf-yun.com',
    };
  }

  async generateFinalUrl() {
    const authParams = await this.generateAuthParams(`/v${this.version}.1/chat`);
    const queryString = querystring.stringify(authParams);

    return `wss://spark-api.xf-yun.com/v${this.version}.1/chat?${queryString}`;
  }
}

export default sparkdemo;
