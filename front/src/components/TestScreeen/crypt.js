import keys from "./keys";
var CryptoJS = require("crypto-js");
const secretKey = keys.secretKey();

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
