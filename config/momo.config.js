module.exports = {
  partnerCode: "MOMO",
  accessKey: "F8BBA842ECF85",
  secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",

  endpoint: "https://test-payment.momo.vn/v2/gateway/api/create",

  // Must be public URL when deployed
  redirectUrl: "http://localhost:5500/frontend/index.html",
  ipnUrl: "http://localhost:3000/api/payment/momo/ipn"
};
