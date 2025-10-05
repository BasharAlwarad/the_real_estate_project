import formidable from 'formidable';
import type { Fields, Files, Part } from 'formidable';

//10MB
const maxFileSize = 10 * 1024 * 1024;

const filter = ({ mimetype }: Part) => {
  if (!mimetype || !mimetype.includes('image')) {
    const error = new Error('Only images are allowed');
    (error as any).status = 400;
    throw error;
  }
  return true;
};

const formMiddleWare = (req, res, next) => {
  // Check if this is a JSON request (URL-only) or multipart form data (file upload)
  const contentType = req.headers['content-type'] || '';

  // If it's JSON, skip form parsing and let the request continue
  if (contentType.includes('application/json')) {
    return next();
  }

  // If it's multipart/form-data, parse the form
  if (contentType.includes('multipart/form-data')) {
    const form = formidable({ filter, maxFileSize });

    form.parse(req, (err: any, fields: Fields, files: Files) => {
      if (err) {
        return next(err);
      }

      // Convert formidable fields (arrays) to strings
      const processedFields = {};
      for (const [key, value] of Object.entries(fields)) {
        // formidable returns arrays, so we take the first element
        if (Array.isArray(value) && value.length > 0) {
          processedFields[key] = value[0];
        } else {
          processedFields[key] = value;
        }
      }

      // Set the processed fields to req.body
      req.body = processedFields;

      // If there's an image file, set it to req.image
      if (files && files.image) {
        req.image = files.image[0];
      }

      next();
    });
  } else {
    // If it's neither JSON nor form-data, continue
    next();
  }
};

export default formMiddleWare;
