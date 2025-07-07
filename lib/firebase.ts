import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"

// Firebase configuration with fallback to demo mode
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:demo",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-DEMO",
}

// Check if we're in demo mode (no valid Firebase config)
const isDemoMode =
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "demo-api-key" ||
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.includes("demo")

let app: any = null
let auth: any = null
let db: any = null
let analytics: any = null

if (isDemoMode) {
  console.log("🚀 Running in Demo Mode - Firebase disabled")

  // Create mock Firebase services for demo
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback: any) => {
      // Check for stored demo user
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("trademind-user")
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser)
            setTimeout(() => callback(user), 100)
          } catch (error) {
            setTimeout(() => callback(null), 100)
          }
        } else {
          setTimeout(() => callback(null), 100)
        }
      }
      return () => {}
    },
    signInWithEmailAndPassword: async (email: string, password: string) => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Demo mode - accept any valid email/password combination
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long")
      }

      // Create user object for any valid credentials
      const user = {
        uid: email === "demo@trademind.ai" ? "demo-user-123" : `user-${Date.now()}`,
        email,
        displayName: email.split("@")[0],
        photoURL: null,
        phoneNumber: null,
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("trademind-user", JSON.stringify(user))
      }
      return { user }
    },
    createUserWithEmailAndPassword: async (email: string, password: string) => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long")
      }

      const user = {
        uid: `user-${Date.now()}`,
        email,
        displayName: email.split("@")[0],
        photoURL: null,
        phoneNumber: null,
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("trademind-user", JSON.stringify(user))
      }
      return { user }
    },
    signOut: async () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("trademind-user")
      }
      return Promise.resolve()
    },
    signInWithPopup: async (provider: any) => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const user = {
        uid: `oauth-user-${Date.now()}`,
        email: "oauth@trademind.ai",
        displayName: "OAuth User",
        photoURL: "https://via.placeholder.com/40",
        phoneNumber: null,
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("trademind-user", JSON.stringify(user))
      }
      return { user }
    },
  }

  // Mock Firestore
  db = {
    collection: (name: string) => ({
      add: async (data: any) => ({
        id: `doc-${Date.now()}`,
        data: () => data,
      }),
      addDoc: async (data: any) => ({
        id: `doc-${Date.now()}`,
        data: () => data,
      }),
      get: async () => ({
        exists: () => false,
        data: () => null,
      }),
      getDocs: async () => ({
        docs: [],
        forEach: (callback: any) => {},
        size: 0,
        empty: true,
      }),
      doc: (id?: string) => ({
        get: async () => ({
          exists: () => false,
          data: () => null,
        }),
        set: async () => {},
        update: async () => {},
        delete: async () => {},
      }),
    }),
    doc: (path: string) => ({
      get: async () => ({
        exists: () => false,
        data: () => null,
      }),
      set: async () => {},
      update: async () => {},
      delete: async () => {},
    }),
  }
} else {
  try {
    // Initialize Firebase with real config
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
    db = getFirestore(app)

    // Initialize Analytics (only in browser)
    if (typeof window !== "undefined") {
      analytics = getAnalytics(app)
    }

    console.log("✅ Firebase initialized successfully")
  } catch (error) {
    console.error("❌ Firebase initialization error:", error)

    // Fallback to demo mode if Firebase fails
    console.log("🔄 Falling back to Demo Mode")

    // Use the same mock services as demo mode
    auth = {
      currentUser: null,
      onAuthStateChanged: (callback: any) => {
        if (typeof window !== "undefined") {
          const storedUser = localStorage.getItem("trademind-user")
          if (storedUser) {
            try {
              const user = JSON.parse(storedUser)
              setTimeout(() => callback(user), 100)
            } catch (error) {
              setTimeout(() => callback(null), 100)
            }
          } else {
            setTimeout(() => callback(null), 100)
          }
        }
        return () => {}
      },
      signInWithEmailAndPassword: async (email: string, password: string) => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (!email || !password) {
          throw new Error("Email and password are required")
        }

        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long")
        }

        // Accept any valid credentials in fallback mode
        const user = {
          uid: email === "demo@trademind.ai" ? "demo-user-123" : `user-${Date.now()}`,
          email,
          displayName: email.split("@")[0],
          photoURL: null,
          phoneNumber: null,
        }

        if (typeof window !== "undefined") {
          localStorage.setItem("trademind-user", JSON.stringify(user))
        }
        return { user }
      },
      createUserWithEmailAndPassword: async (email: string, password: string) => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (!email || !password) {
          throw new Error("Email and password are required")
        }

        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long")
        }

        const user = {
          uid: `user-${Date.now()}`,
          email,
          displayName: email.split("@")[0],
          photoURL: null,
          phoneNumber: null,
        }

        if (typeof window !== "undefined") {
          localStorage.setItem("trademind-user", JSON.stringify(user))
        }
        return { user }
      },
      signOut: async () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("trademind-user")
        }
        return Promise.resolve()
      },
      signInWithPopup: async (provider: any) => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const user = {
          uid: `oauth-user-${Date.now()}`,
          email: "oauth@trademind.ai",
          displayName: "OAuth User",
          photoURL: "https://via.placeholder.com/40",
          phoneNumber: null,
        }

        if (typeof window !== "undefined") {
          localStorage.setItem("trademind-user", JSON.stringify(user))
        }
        return { user }
      },
    }

    db = {
      collection: (name: string) => ({
        add: async (data: any) => ({
          id: `doc-${Date.now()}`,
          data: () => data,
        }),
        addDoc: async (data: any) => ({
          id: `doc-${Date.now()}`,
          data: () => data,
        }),
        get: async () => ({
          exists: () => false,
          data: () => null,
        }),
        getDocs: async () => ({
          docs: [],
          forEach: (callback: any) => {},
          size: 0,
          empty: true,
        }),
        doc: (id?: string) => ({
          get: async () => ({
            exists: () => false,
            data: () => null,
          }),
          set: async () => {},
          update: async () => {},
          delete: async () => {},
        }),
      }),
      doc: (path: string) => ({
        get: async () => ({
          exists: () => false,
          data: () => null,
        }),
        set: async () => {},
        update: async () => {},
        delete: async () => {},
      }),
    }
  }
}

// Export the services
export { auth, db, analytics, isDemoMode }
export default app
