import { Routes, Route } from "react-router-dom"
import { SignIn, useUser } from "@clerk/clerk-react"
import Navbar from "./components/navbar"
import ImageGenerator from "./components/image"
import Spinner from "./components/loader"

const App = () => {
  return (
    <Routes>
      <Route
        path="/sign-in"
        element={
          <div>
            <SignIn redirectUrl="/" />
          </div>
        }
      />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Navbar />
            <ImageGenerator />
          </RequireAuth>
        }
      />
    </Routes>
  )
}

export default App

// 👇 Wrapper to protect routes
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useUser()

  if (!isLoaded) return <Spinner />

  return isSignedIn ? (
    <>{children}</>
  ) : (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-slate-200">
      <SignIn redirectUrl="/sign-in" />
    </div>
  )
}
