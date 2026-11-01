# StockPilot — Inventory Management System

StockPilot is a browser-based inventory management application using Firebase Authentication and per-user Cloud Firestore storage.

## Vercel deployment (no `.env` file required)

1. Push this project to a GitHub repository. Make sure you do **not** commit a real `.env` file.
2. In Vercel, select **Add New → Project** and import the repository.
3. In the project settings, open **Environment Variables** and add these names and values from your Firebase project's Web App configuration:

   | Name | Value from Firebase |
   |---|---|
   | `FIREBASE_API_KEY` | `apiKey` |
   | `FIREBASE_AUTH_DOMAIN` | `authDomain` |
   | `FIREBASE_PROJECT_ID` | `projectId` |
   | `FIREBASE_STORAGE_BUCKET` | `storageBucket` |
   | `FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
   | `FIREBASE_APP_ID` | `appId` |
   | `FIREBASE_MEASUREMENT_ID` | `measurementId` (optional) |

4. Select the environments (Production, Preview, and/or Development) where each variable should apply.
5. Deploy the project. If you add or change variables later, redeploy for the changes to take effect.
6. In Firebase Console, add your deployed Vercel domain under **Authentication → Settings → Authorized domains**.

The frontend requests `/api/config`; the Vercel serverless function reads the environment variables and returns only the Firebase Web App configuration required by the Firebase browser SDK. No `.env` file is needed on Vercel.

## Local development (optional)

1. Install Node.js 18+.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and fill it with your Firebase Web App values.
4. Enable **Authentication → Email/Password** and create a Cloud Firestore database in Firebase Console.
5. Run `npm start` and open `http://localhost:3000`.

## Project structure

```text
stockpilot/
├── api/
│   ├── config.js
│   └── firebase-config.js
├── public/
│   ├── css/style.css
│   ├── js/app.js
│   ├── js/firebase-auth.js
│   └── index.html
├── legacy/
├── .env.example
├── .gitignore
├── package.json
├── server.js
├── vercel.json
└── README.md
```

## Firebase security notes

- Firebase Web App configuration is intended for browser use; it is not an Admin SDK private key. The values are still visible to a browser user after the app loads.
- Protect user data with Firestore Security Rules. Do not use open/public rules in production. Users should only read/write their own `users/{uid}` document.
- Never add Firebase Admin service-account JSON, private keys, passwords, or other server secrets to frontend code or Vercel's public responses.
- The previous `abc.js` LocalStorage/demo-login implementation is retained under `legacy/` and is not part of the active application.
