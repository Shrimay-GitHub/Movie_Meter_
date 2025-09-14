# 🚀 MovieMeter Vercel Deployment Guide

## Prerequisites

1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **MongoDB Atlas** - Cloud database (free tier available)

## Step-by-Step Deployment

### 1. Setup MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/moviemeter`)
5. Whitelist all IP addresses (0.0.0.0/0) for Vercel access

### 2. Push to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit for MovieMeter deployment"

# Add GitHub remote (replace with your repository URL)
git remote add origin https://github.com/yourusername/moviemeter.git

# Push to GitHub
git push -u origin main
```

### 3. Deploy to Vercel

1. **Import Project**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**:
   In Vercel project settings, add these environment variables:
   
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/moviemeter
   JWT_SECRET=your_super_secure_random_string_here
   NODE_ENV=production
   PORT=3001
   ```

3. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - You'll get a URL like: `https://moviemeter-abc123.vercel.app`

### 4. Update CORS Settings

After deployment, update the CORS configuration in `server.js`:

```javascript
app.use(cors({
    origin: ['https://your-actual-vercel-url.vercel.app'],
    credentials: true
}));
```

Then redeploy by pushing to GitHub.

### 5. Seed Database (After Successful Deployment)

After your app is deployed successfully:

1. **Visit the seeding endpoint**:
   - Go to: `https://your-vercel-url.vercel.app/api/seed`
   - This will populate your database with 30 movies
   - You should see a success message

2. **Alternative - Manual seeding**:
   ```bash
   # If you need to seed locally first
   npm run seed
   ```

## Project Structure for Vercel

```
moviemeter/
├── api/
│   └── index.js          # Serverless API handler
├── public/               # Static frontend files
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── script.js
│   ├── style.css
│   ├── logo.svg
│   └── favicon.ico
├── models/              # Database models
├── server.js           # Express server
├── seedMovies.js       # Database seeding
├── vercel.json         # Vercel configuration
├── package.json
└── .env.example

```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/moviemeter` |
| `JWT_SECRET` | Secret key for JWT tokens | `super_secure_random_string_123` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3001` |

## Troubleshooting

### Common Issues:

1. **Database Connection Fails**:
   - Check MongoDB Atlas IP whitelist includes 0.0.0.0/0
   - Verify connection string format
   - Ensure database user has proper permissions

2. **API Routes Not Working**:
   - Check `vercel.json` configuration
   - Verify API endpoints in frontend match `/api/*` pattern

3. **CORS Errors**:
   - Update CORS origin to match your Vercel domain
   - Ensure credentials are properly configured

4. **Environment Variables**:
   - Double-check all required variables are set in Vercel
   - No trailing spaces or special characters

## Post-Deployment

1. **Test all functionality**:
   - User registration/login
   - Movie display and rating
   - Search and filtering

2. **Monitor logs**:
   - Check Vercel function logs for errors
   - Monitor database connections

3. **Custom Domain** (optional):
   - Add custom domain in Vercel settings
   - Update CORS accordingly

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test API endpoints directly
4. Review MongoDB Atlas connection logs

Your MovieMeter app will be live at: `https://your-project-name.vercel.app`

## Security Notes

- Never commit `.env` files to GitHub
- Use strong JWT secrets in production
- Regularly rotate database credentials
- Monitor for unusual activity