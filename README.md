# Real Estate Project - Image Upload Tutorial

This repository is designed to teach students how to implement **image upload functionality** using **Cloudinary** and **Formidable** in a full-stack TypeScript application.

## 🎯 Learning Objectives

By completing this tutorial, students will learn:

- How to handle file uploads on the backend using Formidable
- How to integrate Cloudinary for cloud-based image storage
- How to create middleware for form processing and cloud uploading
- How to build a frontend interface that supports multiple image input methods
- How to handle different image sources (file upload, URL, default)

## 📚 Tutorial Overview

This tutorial covers the complete implementation of image upload functionality in a real estate application where users can:

1. Upload profile images from their computer
2. Provide an image URL
3. Use a default avatar image

---

## 🔧 Backend Implementation

### Step 1: Install Required Dependencies

First, install the necessary packages for handling file uploads and Cloudinary integration:

```bash
cd server
npm install formidable cloudinary
npm install --save-dev @types/formidable
```

### Step 2: Environment Configuration

Create/update your `.env` file with Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 3: Update User Model

Modify the User model to handle different image sources:

```typescript
// server/src/models/User.ts
image: {
  type: String,
  default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAACUCAMAAAD...',
  // Default base64 avatar image
},
```

### Step 4: Create Form Middleware

Create `server/src/middlewares/formMiddleware.ts`:

```typescript
import formidable from 'formidable';
import { Request, Response, NextFunction } from 'express';

export const formMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const form = formidable({
    multiples: false,
    maxFileSize: 5 * 1024 * 1024, // 5MB limit
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'File upload failed' });
    }

    req.body = { ...fields };
    req.files = files;
    next();
  });
};
```

### Step 5: Create Cloudinary Uploader Middleware

Create `server/src/middlewares/cloudUploader.ts`:

```typescript
import { v2 as cloudinary } from 'cloudinary';
import { Request, Response, NextFunction } from 'express';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudUploader = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.files && req.files.image) {
      const file = Array.isArray(req.files.image)
        ? req.files.image[0]
        : req.files.image;

      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: 'real_estate_users',
        transformation: [
          { width: 400, height: 400, crop: 'fill' },
          { quality: 'auto' },
        ],
      });

      req.body.image = result.secure_url;
    }
    next();
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
};
```

### Step 6: Update User Controller

Modify the user controller to handle different image types:

```typescript
// server/src/controllers/UsersControllers.ts
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    httpErrors.badRequest('Invalid user ID');
  }

  const existingUser = await User.findById(id);
  if (!existingUser) {
    httpErrors.notFound('User not found');
  }

  // Handle empty image field (use default)
  if (updates.image === '') {
    delete updates.image; // Let default value handle it
  }

  const updatedUser = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({
    message: 'User updated successfully',
    user: updatedUser,
  });
};
```

### Step 7: Update User Routes

Apply the middlewares to your user routes:

```typescript
// server/src/routes/UsersRoutes.ts
import { formMiddleware } from '../middlewares/formMiddleware.js';
import { cloudUploader } from '../middlewares/cloudUploader.js';

router.put('/:id', formMiddleware, cloudUploader, updateUser);
router.post('/', formMiddleware, cloudUploader, createUser);
```

---

## 🎨 Frontend Implementation

### Step 8: Update User Component State

Add new state variables for handling different image input methods:

```typescript
// client/src/pages/User.tsx
const [imageOption, setImageOption] = useState<'default' | 'url' | 'upload'>(
  'default'
);
const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string>('');
const [imageUrl, setImageUrl] = useState<string>('');
const fileInputRef = useRef<HTMLInputElement>(null);
```

### Step 9: Add Image Handling Functions

```typescript
// Handle image option change
const handleImageOptionChange = (option: 'default' | 'url' | 'upload') => {
  setImageOption(option);
  setImageFile(null);
  setImagePreview('');
  setImageUrl('');
  setFormData((prev) => ({ ...prev, image: '' }));
};

// Handle file selection and preview
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }
};

// Handle URL input
const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const url = e.target.value;
  setImageUrl(url);
  setFormData((prev) => ({ ...prev, image: url }));
};
```

### Step 10: Update Form Submission

Modify the form submission to handle different content types:

```typescript
const handleUpdateUser = async () => {
  if (!validateForm() || !user) return;

  try {
    setIsUpdating(true);
    let response;

    if (imageOption === 'upload' && imageFile) {
      // Use FormData for file upload
      const formDataPayload = new FormData();
      formDataPayload.append('userName', formData.userName);
      formDataPayload.append('email', formData.email);
      formDataPayload.append('image', imageFile);

      response = await axios.put(
        `http://localhost:3000/users/${user._id}`,
        formDataPayload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
    } else {
      // Use JSON for URL or default image
      const payload = {
        userName: formData.userName,
        email: formData.email,
        image:
          imageOption === 'default'
            ? ''
            : imageOption === 'url'
            ? imageUrl
            : '',
      };

      response = await axios.put(
        `http://localhost:3000/users/${user._id}`,
        payload
      );
    }

    setUser(response.data.user);
    setIsEditModalOpen(false);
    // Reset states...
  } catch (error) {
    // Error handling...
  } finally {
    setIsUpdating(false);
  }
};
```

### Step 11: Create Dynamic Image Input UI

Build a flexible UI that switches between input methods:

```tsx
{
  /* Image Option Selector */
}
<div className="flex gap-2 mb-4">
  <button
    type="button"
    className={`btn btn-sm ${
      imageOption === 'default' ? 'btn-primary' : 'btn-outline'
    }`}
    onClick={() => handleImageOptionChange('default')}
  >
    Default
  </button>
  <button
    type="button"
    className={`btn btn-sm ${
      imageOption === 'url' ? 'btn-primary' : 'btn-outline'
    }`}
    onClick={() => handleImageOptionChange('url')}
  >
    URL
  </button>
  <button
    type="button"
    className={`btn btn-sm ${
      imageOption === 'upload' ? 'btn-primary' : 'btn-outline'
    }`}
    onClick={() => handleImageOptionChange('upload')}
  >
    Upload File
  </button>
</div>;

{
  /* Conditional Input Rendering */
}
{
  imageOption === 'url' && (
    <input
      type="url"
      value={imageUrl}
      onChange={handleImageUrlChange}
      className="input input-bordered"
      placeholder="Enter image URL"
    />
  );
}

{
  imageOption === 'upload' && (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="btn btn-secondary btn-block"
      >
        Choose Image File
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      {imagePreview && (
        <div className="flex justify-center">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-full border-4 border-primary"
          />
        </div>
      )}
    </div>
  );
}
```

---

## 🚀 Testing Your Implementation

### Test Cases:

1. **Default Image**: Select default option and update user
2. **URL Image**: Provide a valid image URL and update
3. **File Upload**: Select and upload an image file from computer
4. **Validation**: Test with invalid URLs and oversized files

---

## 🔍 Key Learning Points

- **Middleware Pattern**: Understanding how Express middleware works
- **File Handling**: Working with multipart/form-data
- **Cloud Services**: Integrating third-party APIs (Cloudinary)
- **Frontend Forms**: Handling different input types and file uploads
- **Error Handling**: Proper error management in async operations

---

## 📚 Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Formidable Library](https://github.com/node-formidable/formidable)
- [MDN File API](https://developer.mozilla.org/en-US/docs/Web/API/File)
- [React File Upload Best Practices](https://react.dev/reference/react-dom/components/input#reading-the-selected-files)

---

**Happy Coding! 🎉**
