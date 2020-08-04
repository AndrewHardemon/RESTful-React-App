//Check Auth Middleware Requirements
const jwt = require('jsonwebtoken');
const yenv = require('yenv');
const env = yenv('env.yaml');

//Puts token in header instead of body
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];//splits Bearer <token> into just <token>
    const decoded = jwt.verify(token, env.JWT) //verify verifies and then decodes
    req.userData = decoded; //added new field
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed'
    });
  }
  next() //if authenticated
}