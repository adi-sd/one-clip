# ![One-Clip Logo](public/one-clip-logo.jpg)

### A simple and fast text-saving app for quick copy-pasting.

![GitHub Stars](https://img.shields.io/github/stars/adi-sd/one-clip?style=social) ![GitHub License](https://img.shields.io/github/license/adi-sd/one-clip)

---

## 🚀 **Overview**

One-Clip is a **modern, lightweight web application** that helps you save and quickly copy-paste text snippets with a single click. It is designed for efficiency and accessibility, ensuring your saved text is always available whenever needed.

## 🎯 **Key Features**

-   ✅ **One-click Copy**: Click on any saved text to copy it instantly.
-   ✅ **Google Authentication**: Secure sign-in with your Google account.
-   ✅ **Auto-Save**: All text entries are saved automatically.
-   ✅ **Search Bar**: Quickly find saved snippets.
-   ✅ **Recycle Bin**: Restore or permanently delete text entries.
-   ✅ **Export/Import**: Backup or transfer your saved snippets as a JSON file.
-   ✅ **MongoDB Atlas**: Secure, scalable NoSQL database.
-   ✅ **Prisma ORM**: Efficient, type-safe data management.
-   ✅ **Mobile Responsive**: Works smoothly on desktops, tablets, and mobile devices.

---

## 🛠 **Tech Stack**

-   **Frontend**: Next.js (App Router), React.js, TypeScript, Tailwind CSS
-   **Authentication**: NextAuth.js (Google Sign-In)
-   **Database**: MongoDB Atlas with Prisma ORM
-   **UI Components**: ShadCN-UI
-   **Deployment**: Free hosting service

---

## 🚀 **Getting Started**

### 1️⃣ **Clone the Repository**

```sh
  git clone https://github.com/adi-sd/one-clip.git
  cd one-clip
```

### 2️⃣ **Install Dependencies**

```sh
  npm install
```

### 3️⃣ **Set Up Environment Variables**

Create a `.env.local` file in the root directory and add:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=http://localhost:3000

DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/one-clip?retryWrites=true&w=majority"
```

> 🔹 Replace `<username>`, `<password>`, and `<cluster>` with your actual **MongoDB Atlas credentials**.

---

### 4️⃣ **Set Up Prisma & Migrate Database**

Run the following commands to set up Prisma ORM and apply migrations:

```sh
  npx prisma generate
  npx prisma migrate dev --name init
```

This initializes Prisma and creates the necessary tables in **MongoDB Atlas**.

---

### 5️⃣ **Run the Development Server**

```sh
  npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📸 **Screenshots**

### **Login Modal**

![Login Modal](./public/screenshots/login-modal.png)

### **Dashboard**

![Dashboard](./public/screenshots/dashboard.png)

---

## 🛠 **Deployment**

To deploy, configure environment variables for your hosting provider and push the project.

If using **Vercel**, set environment variables in **Vercel Dashboard** and deploy:

```sh
  vercel deploy
```

---

## 📝 **Contributing**

1. Fork the repo
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a pull request

---

## 🛡 **License**

This project is licensed under the **MIT License**.

---

## 📬 **Contact**

For any issues or feature requests, feel free to [open an issue](https://github.com/adi-sd/one-clip/issues) or connect with me on GitHub: [@adi-sd](https://github.com/adi-sd)

---

⭐ **If you like this project, don’t forget to star the repository!** ⭐

---

### ✅ **Changes Made**

-   **Replaced Firebase Firestore** with **MongoDB Atlas & Prisma ORM**.
-   **Updated environment variables** to reflect MongoDB connection.
-   **Added Prisma migration commands** to initialize the database.
-   **Updated the deployment section** for MongoDB compatibility.
