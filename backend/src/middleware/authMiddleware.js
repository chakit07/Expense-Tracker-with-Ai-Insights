const admin = require('../config/firebase');
const User = require('../models/User');

exports.verifyToken = async (req, res, next) => {
  // Check if the Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      const token = req.headers.authorization.split(' ')[1];

      // Verify token with Firebase
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Check if user exists in our DB, if not, create them
      let user = await User.findOne({ firebaseUid: decodedToken.uid });

      if (!user) {
        user = await User.create({
          firebaseUid: decodedToken.uid,
          email: decodedToken.email,
          displayName: decodedToken.displayName || decodedToken.email,
        });
      }

      // Attach user object to the request. We use the MongoDB _id.
      req.user = user;
      // Attach firebaseUid for convenience
      req.userId = user.firebaseUid;

      next(); // Proceed to the next middleware or the controller
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};
