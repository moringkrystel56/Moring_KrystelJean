# React Native Android App — Four-Screen Screenshot Sample

This Expo Router / TypeScript project follows the four screenshots provided in the assignment, rather than a redesigned social-media interface.

## Screens and exact paths

1. `src/app/(unauthenticated)/login.tsx` — white rounded login card on pale-lavender background, ✨ icon, email/password, purple **Sign In**, and **Create Account** link.
2. `src/app/(unauthenticated)/register.tsx` — matching card, 🚀 icon, full name/email/password/confirm password, purple **Sign Up**, and **Sign In** link.
3. `src/app/(authenticated)/(tabs)/home.tsx` — lowercase **home** title, settings icon, gray background, blue **ADD POST** button, two sample photo posts with **EDIT**/**DELETE** buttons, scrolling feed.
4. `src/app/(authenticated)/(tabs)/profile.tsx` — lowercase **profile** title, settings icon, circular photo, user's name/username/email, blue **EDIT PROFILE**, red **LOGOUT**.

The two post images and profile photo have been cropped from the screenshots supplied with the assignment. The first post is **Kanin** and the second is **MaPrisoKa**.

## Run on an Android phone

Install Node.js and Expo Go. Extract this ZIP, open the folder in VS Code, and run:

```bash
npm install
npx expo install --fix
npx expo start
```

Use Expo Go to scan the QR code from the terminal. You can also use an Android emulator via `npm run android`.

### Demo login

- Email: `demo@socially.app`
- Password: `Demo1234!`

You can also tap **Create Account** to register a local demo user.

## Functionality

- Login and registration with basic validation.
- Home/Profile bottom tab navigation.
- Add posts, edit posts and delete posts. Existing demo photos also appear in the post editor.
- Edit your own profile and choose a new avatar image.
- Logout.

## Important

The app is a **classroom prototype**, not a backend social network. Accounts, passwords, session, and posts live on the device in AsyncStorage, with locally salted password hashes. This is not production-safe user authentication. Replace it with a backend authentication and storage system before publication.

The delivered archive contains the source project, **not a compiled Android APK**.
