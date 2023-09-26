import { diskStorage } from "multer";
import { extname } from "path";

/**
 * Uploading Storage Config
 */
export const storage = diskStorage({
    destination: "./upload",
    filename: (req, file, callback) => {
        callback(null, generateFilename(file));
    }
});

/**
 * Check Uploaded File Extention
 * @param req Http Request
 * @param file Uploaded File
 * @param callback Resume Call Back Function
 */
export const filter = (req, file, callback) => {
    var ext = extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        req.fileValidationError = "Forbidden extension";
               return callback(null, false, req.fileValidationError);
    }
    callback(null, true)
}

/**
 * Generate a file name
 * @param file Uploaded File
 * @returns File Name
 */
function generateFilename(file) {
    return `${Date.now()}${extname(file.originalname)}`;
}
