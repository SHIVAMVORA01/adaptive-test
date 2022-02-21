var CryptoJS = require("crypto-js");
const secretKey = process.env.REACT_APP_SECRET_KEY_FOR_ENCRYPTION;

function encryptVal(val) {
  let ciphertext = CryptoJS.AES.encrypt(val.toString(), secretKey).toString();
  return ciphertext;
}
function decryptVal(val) {
  let bytes = CryptoJS.AES.decrypt(val, secretKey);
  let originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}
export default { encryptVal, decryptVal };
