exports.uploadFile = async (req, res, next) => {
    try {
        if (req.file.mimetype !== 'text/csv') {
            res.status(400).json({ message: "File must be in CSV format" });
        } else {
            next();
        }
    } catch (error) {
        next(error);
    }
};
