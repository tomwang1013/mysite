/**
 * 加密解密的一些工具函数
 */

const crypto = require('crypto');

// 生成salt
function genSalt() {
  return crypto.randomBytes(16).toString('hex');
}

function hashIt(text, salt) {
  const sha256 = crypto.createHmac('sha256', salt);

  sha256.update(text);

  return sha256.digest('hex');
}

function saltHashPassword(plainPassword) {
  const salt = genSalt();

  return {
    salt,
    hashedPassword: hashIt(plainPassword, salt)
  }
}

function validatePassword(plainPassword, hashedPassword, salt) {
  return hashIt(plainPassword, salt) === hashedPassword;
}

module.exports = {
  genSalt, saltHashPassword, validatePassword, hashIt
};