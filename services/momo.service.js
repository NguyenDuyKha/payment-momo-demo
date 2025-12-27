const https = require("https");
const crypto = require("crypto");
const config = require("../config/momo.config");

function createPayment(amount) {
  return new Promise((resolve, reject) => {
    const requestId = config.partnerCode + Date.now();
    const orderId = requestId;
    const orderInfo = "Pay with MoMo";
    const requestType = "captureWallet";
    const extraData = "";

    const rawSignature =
      `accessKey=${config.accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&ipnUrl=${config.ipnUrl}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&partnerCode=${config.partnerCode}` +
      `&redirectUrl=${config.redirectUrl}` +
      `&requestId=${requestId}` +
      `&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", config.secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode: config.partnerCode,
      accessKey: config.accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl: config.redirectUrl,
      ipnUrl: config.ipnUrl,
      extraData,
      requestType,
      signature,
      lang: "en"
    });

    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody)
      }
    };

    const req = https.request(options, res => {
      let data = "";

      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(JSON.parse(data)));
    });

    req.on("error", err => reject(err));
    req.write(requestBody);
    req.end();
  });
}

module.exports = { createPayment };
