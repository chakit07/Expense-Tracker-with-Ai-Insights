const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            error: errors
        });
    }

    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            error: 'Duplicate field value'
        });
    }

    res.status(500).json({
        success: false,
        error: 'Server Error'
    });
};

module.exports = errorHandler;
