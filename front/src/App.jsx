import { Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage.jsx";
import MainPage from "./pages/MainPage.jsx";
import RequestPage from "./pages/RequestPage.jsx";
import AiAssistant from "./components/AiAssistant.jsx";
import { loadUser } from "./utils/storage.js";

function RequireUser({ children }) {
  const user = loadUser();
  if (!user) return <Navigate to="/" replace />;
  return (
    <>
      {children}
      <AiAssistant />
    </>
  );
}

export default function App() {
  const user = loadUser();

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? <Navigate to={`/main/${encodeURIComponent(user.name)}`} replace /> : <RegisterPage />
        }
      />
      <Route
        path="/main/:name"
        element={
          <RequireUser>
            <MainPage />
          </RequireUser>
        }
      />
      <Route
        path="/request/:phone"
        element={
          <RequireUser>
            <RequestPage />
          </RequireUser>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
