# 🚀 Quick Deployment Checklist

## Before Deployment

- [ ] MongoDB Atlas cluster is set up and running
- [ ] Database connection string is ready
- [ ] JWT secret is generated (use a secure random string)
- [ ] Project is pushed to GitHub repository

## Vercel Environment Variables

Set these in your Vercel project settings:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/moviemeter
JWT_SECRET=your_super_secure_random_string_here  
NODE_ENV=production
PORT=3001
```

## After Deployment

1. ✅ **Test the deployment** - Visit your Vercel URL
2. ✅ **Seed the database** - Go to `/api/seed` endpoint
3. ✅ **Test registration** - Create a new user account
4. ✅ **Test login** - Login with your credentials
5. ✅ **Test movie features** - View and rate movies

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot find module" error | Check file paths in imports |
| Database connection fails | Verify MongoDB URI and whitelist IPs |
| CORS errors | Update CORS origin with your Vercel domain |
| API not working | Check `/api/*` routes are properly configured |

## Your Deployment Status

- [ ] Environment variables configured
- [ ] GitHub repository connected
- [ ] Deployment successful
- [ ] Database seeded
- [ ] App fully functional

## Next Steps

1. **Update CORS** with your actual Vercel URL
2. **Test all features** thoroughly
3. **Monitor logs** for any issues
4. **Add custom domain** (optional)

---

**Need help?** Check the full [DEPLOYMENT.md](./DEPLOYMENT.md) guide.