const User = require('../models/User');

const login = async (req, res) => {
    try {
        const { firebaseUid, email, displayName, photoURL } = req.user;

        let user = await User.findOne({ firebaseUid });

        if (!user) {
            user = await User.create({
                firebaseUid,
                email,
                displayName,
                photoURL
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                firebaseUid: user.firebaseUid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                preferences: user.preferences
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.userId });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { login, getProfile };
