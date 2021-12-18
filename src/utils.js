import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Config from 'config';

async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

async function comparePassword(rawPassword, hashedPassword) {
  const res = await bcrypt.compare(rawPassword, hashedPassword);
  return res;
}

function getDataJwtToken(bearerToken) {
  const token = bearerToken.split(' ')[1];
  const decodedToken = jwt.verify(token, Config.secretConfig.jwtSecret);
  return decodedToken;
}

function generateJwtToken(userToRegister) {
  return jwt.sign(userToRegister, Config.secretConfig.jwtSecret);
}

export default {
  hashPassword,
  comparePassword,
  getDataJwtToken,
  generateJwtToken,
};
