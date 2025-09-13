# MovieMeter 🎬

A full-stack movie rating web application that allows users to discover, rate, and track their favorite movies with a beautiful glassmorphism UI design.

![MovieMeter Banner](https://via.placeholder.com/800x300/667eea/ffffff?text=MovieMeter+Movie+Rating+App)

## ✨ Features

- **Modern UI Design** - Beautiful glassmorphism interface with smooth animations
- **User Authentication** - Secure JWT-based signup and login system
- **Movie Discovery** - Browse through a curated collection of popular movies
- **Interactive Rating System** - Rate movies from 1-5 stars with instant visual feedback
- **Personalized Experience** - Each user maintains their own rating history
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Real-time Updates** - Ratings update immediately and persist across sessions
- **Enhanced UX** - Loading states, error handling, and success notifications
- **Keyboard Navigation** - Full keyboard accessibility support
- **Loading Animations** - Smooth transitions and staggered card animations
- **Secure Data Storage** - All user data and ratings stored securely in MongoDB

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with glassmorphism effects and responsive design
- **Vanilla JavaScript** - Client-side logic and API interactions
- **Fetch API** - HTTP requests to backend services

### Backend
- **Node.js** (v22.18.0) - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** (v8.2.0) - NoSQL database for data persistence
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT (jsonwebtoken)** - Secure user authentication
- **bcrypt** - Password hashing and security
- **CORS** - Cross-origin resource sharing configuration

### Development Tools
- **npm** (v10.9.3) - Package management
- **nodemon** - Development server with auto-restart
- **dotenv** - Environment variable management

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **MongoDB** (v5.0.0 or higher)
- **Git** (for cloning the repository)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd moviemeter
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install MongoDB (macOS)
```bash
# Install MongoDB using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community
```

### 4. Environment Configuration
Create a `.env` file in the root directory:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/moviemeter

# JWT Secret (change this to a secure random string in production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Configuration
PORT=3001

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:8000
```

### 5. Seed the Database
```bash
npm run seed
```

### 6. Start the Application

**Start the Backend Server:**
```bash
npm start
```
The backend API will be available at `http://localhost:3001`

**Start the Frontend Server (in a new terminal):**
```bash
python3 -m http.server 8000
```
The frontend will be available at `http://localhost:8000`

## 📱 Usage

### Getting Started
1. **Sign Up**: Navigate to `http://localhost:8000/signup.html` to create a new account
2. **Login**: Use your credentials at `http://localhost:8000/login.html`
3. **Browse Movies**: Explore our collection of 30 popular movies from different decades
4. **Search & Filter**: Use the search bar to find specific movies or filter by decade
5. **Rate Movies**: Browse movies on the main dashboard and click stars to rate them
6. **Keyboard Shortcuts**: Use number keys (1-5) to quickly rate movies when hovering over them
7. **Logout**: Use the logout button in the top navigation

### API Endpoints

#### Authentication
- `POST /api/signup` - Create a new user account
- `POST /api/login` - Authenticate user and receive JWT token

#### Movies
- `GET /api/movies` - Fetch all movies (requires authentication)

#### Ratings
- `POST /api/ratings` - Submit or update a movie rating
- `GET /api/ratings/:movieId` - Get user's rating for a specific movie

## 📁 Project Structure

```
moviemeter/
├── models/
│   ├── User.js                 # User schema definition
│   ├── models/
│   │   └── Movie.js           # Movie schema definition
│   └── models/models/
│       └── Rating.js          # Rating schema definition
├── public/
│   ├── index.html             # Main dashboard page
│   ├── login.html             # User login page
│   ├── signup.html            # User registration page
│   ├── script.js              # Frontend JavaScript logic
│   └── style.css              # Application styling
├── server.js                  # Express server and API routes
├── seedMovies.js              # Database seeding script
├── package.json               # Project dependencies and scripts
├── .env                       # Environment variables (create this)
└── README.md                  # Project documentation
```

## 🎨 Design Features

- **Modern Glassmorphism UI** - Frosted glass effects with backdrop blur
- **Gradient Backgrounds** - Beautiful multi-color gradients with texture overlay
- **Smooth Animations** - Hover effects, loading states, and page transitions
- **Staggered Animations** - Movie cards animate in sequence for visual appeal
- **Interactive Elements** - Enhanced buttons with loading states and hover effects
- **Typography** - Clean, modern font stack with proper hierarchy
- **Color Palette** - Carefully chosen colors for contrast and accessibility
- **Responsive Grid** - Adaptive layout that works on all screen sizes
- **Visual Feedback** - Success notifications and error messages
- **Accessibility** - Keyboard navigation and focus states for screen readers

## 🔒 Security Features

- **Password Hashing** - All passwords encrypted using bcrypt
- **JWT Authentication** - Secure token-based authentication system
- **Input Validation** - Client and server-side validation
- **CORS Protection** - Configured cross-origin resource sharing
- **Environment Variables** - Sensitive data stored in environment files

## 📝 Available Scripts

```bash
# Start the production server
npm start

# Start development server with auto-restart
npm run dev

# Seed the database with sample movies
npm run seed

# Install all dependencies
npm install
```

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Check what's using the port
lsof -i :3001

# Kill the process if needed
pkill -f "node server.js"
```

**MongoDB Connection Issues:**
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Start MongoDB if not running
brew services start mongodb/brew/mongodb-community
```

**CORS Errors:**
- Ensure both frontend (port 8000) and backend (port 3001) are running
- Check that CORS is configured for the correct frontend URL

## 🚀 Deployment

### Environment Variables for Production
Update your `.env` file for production:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/moviemeter
JWT_SECRET=your_production_jwt_secret_key
PORT=3001
NODE_ENV=production
```

### Security Considerations
- Use strong, unique JWT secrets
- Enable HTTPS in production
- Use MongoDB Atlas or secure MongoDB deployment
- Implement rate limiting for API endpoints
- Add input sanitization and validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- Movie poster images are for demonstration purposes
- Design inspiration from modern glass morphism trends
- Built with modern web technologies and best practices

## 📧 Contact

For questions or support, please open an issue in the repository or contact the development team.

---

**Happy Movie Rating! 🍿✨**