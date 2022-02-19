import HomePage from "./pages/home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProfilePage from "./pages/user/profile";
import SignUp from "./pages/auth/signup";
import { ToastProvider } from "react-toast-notifications";

function App() {
  return (<ToastProvider>
    <div className="bg-gray-900 flex min-w-screen min-h-screen">

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>

    </div></ToastProvider>
  );
}

export default App;
