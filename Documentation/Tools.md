Here's comprehensive documentation in Markdown format for your project:

```markdown
# Growth Tools Platform Documentation

## Project Overview
A React-based platform for managing productivity tools with:
- React + TypeScript frontend
- Express.js + MongoDB backend
- Dynamic routing for tools
- Responsive UI with Tailwind CSS

## Project Structure
```
├── client/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/
│   │   │   ├── Tools.tsx     # Main tools directory
│   │   │   ├── ToolDetail.tsx # Generic tool view
│   │   │   └── TimeBlocking.tsx # Specific tool component
│   │   ├── models/           # TypeScript interfaces
│   ├── .env                  # Frontend environment variables
│
├── server/
│   ├── models/
│   │   └── Tool.js           # MongoDB schema
│   ├── routes/
│   │   └── tools.js          # API endpoints
│   ├── .env                  # Backend environment variables
```

## Adding New Tools

### 1. Create New Tool Component
1. Create new file in `pages/tools/`:
   ```tsx
   // PomodoroTimer.tsx
   import React from 'react';
   
   const PomodoroTimer = () => {
     return (
       <div className="p-6 bg-white rounded-lg">
         <h2>Pomodoro Timer</h2>
         {/* Add tool content */}
       </div>
     );
   };
   
   export default PomodoroTimer;
   ```

### 2. Update Icon Mapping
Add new icon to `Tools.tsx`:
```tsx
const iconMap = {
  // ...
  Timer: Clock, // Use existing icon or import new one
};
```

### 3. Update Tool Router
Modify `ToolRouter.tsx`:
```tsx
switch(tool.component) {
  case 'TimeBlocking':
    return <TimeBlocking />;
  case 'Pomodoro':
    return <PomodoroTimer />;
  // ...
}
```

### 4. Create MongoDB Document
```json
{
  "title": "Pomodoro Timer",
  "description": "Time management technique",
  "category": "Productivity",
  "icon": "Timer",
  "slug": "pomodoro",
  "component": "Pomodoro"
}
```

## Tool Schema Reference
```javascript
const toolSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["Productivity", "Creativity", "Planning", "Communication"]
  },
  icon: {
    type: String,
    required: true,
    enum: ["Calendar", "Clock", "Brain", /*...*/]
  },
  slug: { type: String, required: true, unique: true },
  component: String, // Match component file names
  createdAt: { type: Date, default: Date.now }
});
```

## API Endpoints
| Method | Endpoint                | Description                     |
|--------|-------------------------|---------------------------------|
| GET    | /api/tools              | Get all tools                   |
| GET    | /api/tools/slug/:slug   | Get single tool by slug         |
| POST   | /api/tools              | Create new tool                 |
| DELETE | /api/tools/:id          | Delete tool                     |

## Environment Variables
`.env` (Frontend):
```env
VITE_API_URL=http://localhost:5000
```

`.env` (Backend):
```env
MONGO_URI=mongodb://localhost:27017/growth-tools
PORT=5000
```

## Development Workflow

### Running Locally
1. Start backend:
   ```bash
   cd server && npm install && npm start
   ```
2. Start frontend:
   ```bash
   cd client && npm install && npm run dev
   ```

### Creating New Tools
1. Create component in `pages/tools/`
2. Add icon mapping in `Tools.tsx`
3. Update ToolRouter with new component
4. Create MongoDB document with proper slug/component fields
5. Test at `/tools/[your-slug]`

## Troubleshooting Guide

### Common Issues
1. **Tool not found**
   - Verify slug matches MongoDB document
   - Check network requests in browser devtools

2. **Icon not displaying**
   - Confirm icon name matches enum in schema
   - Check icon mapping in `Tools.tsx`

3. **API Errors**
   - Ensure backend is running
   - Verify CORS configuration
   - Check server logs for errors

## Version Control
- Ignore `.env` files
- Maintain separate branches for features
- Use descriptive commit messages

## Deployment Notes
1. Production environment variables must include:
   - `MONGO_URI` with production database URL
   - `VITE_API_URL` with production API URL
2. Build frontend before deployment:
   ```bash
   npm run build
   ```

## Contact
For support contact: [your-team@company.com](mailto:your-team@company.com)  
GitHub Repository: [github.com/your-repo](https://github.com/your-repo)
```

This documentation provides:
1. Clear project structure overview
2. Step-by-step tool creation guide
3. API reference
4. Environment setup instructions
5. Troubleshooting common issues
6. Deployment guidelines
