const crypto = require("crypto");
const config = require("../config/momo.config");

function verifyMoMoSignature(body) {
  const {
    partnerCode,
    accessKey,
    requestId,
    amount,
    orderId,
    orderInfo,
    orderType,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    extraData
  } = body;

  const rawSignature =
    `accessKey=${config.accessKey}` +
    `&amount=${amount}` +
    `&extraData=${extraData}` +
    `&message=${message}` +
    `&orderId=${orderId}` +
    `&orderInfo=${orderInfo}` +
    `&orderType=${orderType}` +
    `&partnerCode=${partnerCode}` +
    `&payType=${payType}` +
    `&requestId=${requestId}` +
    `&responseTime=${responseTime}` +
    `&resultCode=${resultCode}` +
    `&transId=${transId}`;

  const signature = crypto
    .createHmac("sha256", config.secretKey)
    .update(rawSignature)
    .digest("hex");

  return signature === body.signature;
}

module.exports = { verifyMoMoSignature };
