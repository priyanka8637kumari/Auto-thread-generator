# Twitter Posting Debug Guide

## Potential Issues and Solutions

### 1. **Session Access Token Missing**

**Issue**: The `session.accessToken` might be undefined or expired.

**Check**: Open browser console and add this to your `handlePostEntireThread` function:
```javascript
console.log('Session data:', session);
console.log('Access Token:', session?.accessToken);
```

**Solution**: If access token is missing, the user needs to re-authenticate.

### 2. **Environment Variables Missing**

**Required Environment Variables**:
```
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
TWITTER_REDIRECT_URI=http://localhost:3000/api/auth/callback/twitter
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. **Twitter API Rate Limits**

Twitter has strict rate limits:
- 50 tweets per 24 hours for new accounts
- 300 tweets per 24 hours for verified accounts

### 4. **Duplicate Content Error**

Twitter blocks posting identical content within a short timeframe.

### 5. **Authentication Flow Issues**

The Twitter OAuth 2.0 flow might be broken if:
- Callback URL is incorrect
- App permissions are insufficient
- Client credentials are wrong

## Quick Debug Steps

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try posting and check for errors

### Step 2: Check Network Tab
1. Open DevTools → Network tab
2. Try posting a thread
3. Look for the `/api/twitter/post` request
4. Check the response status and body

### Step 3: Check Server Logs
Look in your terminal where you run `npm run dev` for any server-side errors.

### Step 4: Test Authentication
Try logging out and logging back in to refresh the access token.

## Common Error Messages and Solutions

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Authentication required" | No session | Re-login |
| "Twitter access token is required" | Missing access token | Re-authenticate with Twitter |
| "Rate limit exceeded" | Too many requests | Wait 15 minutes |
| "Duplicate content" | Same tweet posted recently | Modify content slightly |
| "Forbidden" | Invalid credentials | Check environment variables |

## Immediate Actions to Try

1. **Clear browser cookies and re-login**
2. **Check if environment variables are set**
3. **Try posting a single tweet instead of a thread**
4. **Check Twitter Developer Portal for any API issues**
5. **Verify your Twitter app has the correct permissions**

## Code Changes to Add Better Error Handling

I'll create an improved version of the posting function with better debugging.
