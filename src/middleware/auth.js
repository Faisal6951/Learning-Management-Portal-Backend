const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Access denied.'
      })
    }

    // 2. Extract token
    const token = authHeader.split(' ')[1]

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 4. Attach user info to request
    req.user = decoded

    next()

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    })
  }
}

module.exports = { authenticate }