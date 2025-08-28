# Nexus Backend API

Backend API for the Nexus investor-entrepreneur platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
copy .env.example .env
```

3. Update `.env` with your MongoDB URI and JWT secret

4. Start development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Profile
- `GET /api/profile` - Get user profile (authenticated)
- `PUT /api/profile` - Update user profile (authenticated)

### Meetings
- `POST /api/meetings` - Create meeting
- `GET /api/meetings` - Get user meetings
- `PUT /api/meetings/:id` - Update meeting
- `DELETE /api/meetings/:id` - Cancel meeting

### Video Calling
- `GET /api/video/room/:meetingId` - Create/get video room
- `GET /api/video/join/:roomId` - Join video room

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get user documents
- `GET /api/documents/:id` - Get document details
- `POST /api/documents/:id/sign` - Sign document

### Health Check
- `GET /api/health` - Server health status

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRE` - JWT expiration time
- `NODE_ENV` - Environment (development/production)
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret