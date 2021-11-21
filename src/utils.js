import jwt from 'jsonwebtoken';
import Config from 'config';

function getDataJwtToken(bearerToken) {
  const token = bearerToken.split(' ')[1];
  const decodedToken = jwt.verify(token, Config.secretConfig.jwtSecret);
  return decodedToken;
}

function generateJwtToken(userToRegister) {
  return jwt.sign(
    userToRegister,
    Config.secretConfig.jwtSecret,
  );
}

export default {
  getDataJwtToken,
  generateJwtToken,
};
