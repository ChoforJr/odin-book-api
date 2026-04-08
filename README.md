# Odin-Book API

This is the backend API for the Odin-Book social media application. Odin-Book is a full-stack social media platform where users can create profiles, post content, comment on posts, and interact with other users.

## Features

- User authentication and authorization (JWT-based)
- User profiles with bio, display name, and profile photos
- Create, read, update, and delete posts
- Comment on posts
- Like posts and comments
- File uploads (images) via Cloudinary
- Follow/unfollow users
- Guest accounts for demo purposes
- Database seeding with fake data

## Tech Stack

- **Backend Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Passport.js with JWT and local strategies
- **File Storage**: Cloudinary
- **Validation**: Express-validator
- **Password Hashing**: bcryptjs
- **CORS**: Configured for specific origins
- **Language**: JavaScript (ES Modules)

## Prerequisites

- Node.js (version 16 or higher)
- PostgreSQL database
- npm

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ChoforJr/odin-book-api.git
   cd odin-book-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/odin_book_db"
   JWT_SECRET=your_jwt_secret_here
   CLOUDINARY_URL=cloudinary://cloud_name:api_key:api_secret@

   ```

   To generate a secure JWT secret:

   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

4. Set up the database:

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. (Optional) Seed the database with fake data:
   ```bash
   npx prisma db seed
   ```

## Usage

### Development

Start the development server with auto-reload:

```bash
npm run dev
```

### Production

Build and start the application:

```bash
npm run build
npm start
```

The server will start on the port specified in your environment or default to 3001.

## Troubleshooting

### Multer-Storage-Cloudinary Conflict

If you encounter peer dependency issues with `multer-storage-cloudinary`, install with legacy peer deps:

```bash
npm install multer-storage-cloudinary --legacy-peer-deps
npm audit fix --legacy-peer-deps
```

## Roadmap / Future Enhancements

- **WebSocket Integration**: "Transitioning from RESTful polling to bidirectional communication using Socket.io for instant post, comment, and likes delivery with real-time live notifications."

- **Real-time Presence**: "Implementing user 'Online/Offline' status indicators via socket connection tracking."

- **Add Typescript**: "This allows me to define the "shape" of incoming and outgoing data, helping catch errors during development rather than at runtime when users encounter them"

## Author

**Forsakang Chofor Junior**

- [GitHub](https://github.com/ChoforJr)
- [LinkedIn](https://www.linkedin.com/in/choforforsakang/)

## Related Projects

- [Odin-Book Client](https://github.com/ChoforJr/odin-book) - Frontend React application
