# Deployment Guide for newAnimes Feature

## Problem
When deploying to platforms like Vercel, the `node_modules` directory is not included in the repository, so any direct modifications to third-party packages are lost during deployment.

## Solution: Using patch-package

We've implemented a solution using `patch-package` that automatically applies our modifications to the `aniwatch` package after installation.

### What's Been Set Up

1. **patch-package installed**: Added as a dev dependency
2. **Patch file created**: `patches/aniwatch+2.24.0.patch` contains our modifications
3. **postinstall script**: Automatically applies patches after `npm install`

### Files Modified

- `package.json`: Added `"postinstall": "patch-package"` script
- `patches/aniwatch+2.24.0.patch`: Contains the newAnimes modifications
- `node_modules/aniwatch/dist/index.js`: Modified with newAnimes functionality
- `node_modules/aniwatch/dist/index.d.ts`: Updated TypeScript definitions

### Deployment Steps

1. **Commit all changes** to your repository:
   ```bash
   git add .
   git commit -m "Add newAnimes feature with patch-package"
   git push
   ```

2. **Deploy to Vercel** (or any platform):
   - The deployment process will run `npm install`
   - The `postinstall` script will automatically run `patch-package`
   - Our modifications will be applied to the aniwatch package
   - The newAnimes feature will be available

### Verification

After deployment, test the API endpoint:
```bash
curl https://your-deployment-url.vercel.app/api/v2/hianime/home
```

The response should include the `newAnimes` section:
```json
{
  "success": true,
  "data": {
    "spotlightAnimes": [...],
    "newAnimes": [
      {
        "id": "anime-id",
        "name": "Anime Name",
        "jname": "Japanese Name",
        "poster": "poster-url",
        "type": "Movie",
        "duration": "120m",
        "episodes": { "sub": 1, "dub": null }
      }
    ],
    ...
  }
}
```

### Troubleshooting

If the newAnimes section is missing:

1. **Check build logs** for patch-package errors
2. **Verify patch file exists** in the repository
3. **Ensure postinstall script runs** during deployment
4. **Check aniwatch version** matches the patch (2.24.0)

### Alternative: Fork the aniwatch Package

For a more permanent solution, consider:

1. Fork the [aniwatch repository](https://github.com/ghoshRitesh12/aniwatch)
2. Add the newAnimes functionality to the source code
3. Update `package.json` to use your fork:
   ```json
   {
     "dependencies": {
       "aniwatch": "github:yourusername/aniwatch#main"
     }
   }
   ```

This approach provides better long-term maintainability but requires more setup.

## Summary

The patch-package solution ensures that your newAnimes feature will work in production deployments. The modifications are automatically applied during the installation process, making the deployment seamless and reliable.