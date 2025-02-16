# Project Documentation

## Project Overview

This project serves as the backend for a website where users can access **articles**, **resources**, **tools**, and **techniques**. The backend is built with **Node.js** and **Express.js**, and it interacts with a **MongoDB** database using **Mongoose**. Users can view and download resources (such as PDFs) and read articles, with embedded images for better content representation.

### Key Features
- Article management (CRUD operations)
- Resource management (CRUD operations for downloadable content)
- Technique and tool management
- Image handling (through external storage like Cloudinary)
- File upload functionality (handled by Multer)

---

## Tech Stack
- **Backend Framework**: Node.js + Express.js
- **Database**: MongoDB with Mongoose
- **File Uploading**: Multer (file handling)
- **File Storage**: Cloudinary (for images) / S3 / Google Cloud Storage (depending on future implementation)
- **Environment Variables**: dotenv (for configuration)

---

## Project Setup

### 1. Initial Setup
1. **Clone the Repository**:  
   ```bash
   git clone <repository_url>
   cd <project_folder>
   ```

2. **Install Dependencies**:  
   In the root folder, run the following command to install all the dependencies:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory.
   - Add the following content:

   ```bash
   MONGO_URI=your-mongodb-connection-string
   PORT=5000
   CLOUDINARY_URL=your-cloudinary-url  # Optional for Cloudinary Image Storage
   ```

4. Run the Development Server:
   ```bash
   npm start
   ```

---

## Folder Structure

```
/project
│
├── /models
│   ├── Article.js
│   ├── Resource.js
│   ├── Technique.js
│   └── Tool.js
│
├── /routes
│   ├── articles.js
│   ├── resources.js
│   ├── techniques.js
│   ├── tools.js
│   └── upload.js
│
├── /uploads (optional, for local file storage during development)
│
├── .env
├── package.json
├── server.js
```

- **/models**: Contains Mongoose schemas for each resource type (Article, Resource, Technique, Tool).
- **/routes**: Contains Express routes to handle CRUD operations for the models.
- **/uploads**: (Optional) Temporary local file storage for file uploads if you aren't using an external service like Cloudinary or AWS.
- **server.js**: The entry point of the app, setting up the Express server and MongoDB connection.

---

## Database Models

### 1. Article Model (`models/Article.js`)
Stores articles with content, images, and metadata.

```javascript
const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, // HTML or Markdown
  images: [{ type: String }], // Array of image URLs
  category: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', ArticleSchema);
```

### 2. Resource Model (`models/Resource.js`)
Stores downloadable resources like PDFs, DOCs, etc.

```javascript
const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, required: true },  // PDF, DOC, etc.
  size: { type: String },  // File size (e.g., 245 KB)
  fileUrl: { type: String, required: true } // URL to the hosted file
});

module.exports = mongoose.model('Resource', ResourceSchema);
```

### 3. Technique Model (`models/Technique.js`)
Stores techniques categorized by their respective areas (e.g., study, development, etc.).

```javascript
const mongoose = require('mongoose');

const TechniqueSchema = new mongoose.Schema({
  category: { type: String, required: true },
  icon: { type: String },  // URL or identifier for the icon
  techniques: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String },
    timeNeeded: { type: String }
  }]
});

module.exports = mongoose.model('Technique', TechniqueSchema);
```

### 4. Tool Model (`models/Tool.js`)
Stores information about tools available for users to explore.

```javascript
const mongoose = require('mongoose');

const ToolSchema = new mongoose.Schema({
  icon: { type: String },  // URL to the icon
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String }
});

module.exports = mongoose.model('Tool', ToolSchema);
```

---

## Routes

### 1. Articles Routes (`routes/articles.js`)

Handles CRUD operations for **Articles**.

```javascript
const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// Get all articles
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single article by ID
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new article
router.post('/', async (req, res) => {
  const { title, content, images, category } = req.body;
  try {
    const newArticle = new Article({ title, content, images, category });
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an article
router.put('/:id', async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedArticle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an article
router.delete('/:id', async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

### 2. Resources Routes (`routes/resources.js`)

Handles CRUD operations for **Resources**.

```javascript
const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

// Get all resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new resource
router.post('/', async (req, res) => {
  const { title, description, type, size, fileUrl } = req.body;
  try {
    const newResource = new Resource({ title, description, type, size, fileUrl });
    await newResource.save();
    res.status(201).json(newResource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

### 3. Upload Route (`routes/upload.js`)

Handles file upload functionality for images.

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Handle file upload
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;
```

---

## File Hosting

- **Cloudinary** is used for storing images, and the URLs are saved in the database.
- Use **S3** or **Google Cloud Storage** for robust, scalable file storage.

For image uploads, we use Multer to handle files locally before uploading them to Cloudinary.

---

## Security and Best Practices
- **JWT Authentication** can be added if the app requires user authentication.
- **Validation Middleware** (e.g., `express-validator`) should be used for input validation.
- **Rate Limiting** should be implemented to prevent abuse of the APIs.
- **CORS** middleware should be configured if the frontend is on a different domain.

---

## Future Considerations
- **File Storage Optimization**: Switch to more scalable storage solutions like Cloudinary, AWS S3, or Google Cloud Storage.
- **User Authentication**: Implement JWT for user login and role-based access control.
- **Pagination for Articles and Resources**: Consider adding pagination to large datasets for better performance.
.