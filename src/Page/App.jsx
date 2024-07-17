import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginForm from "./Components/LoginForm/LoginForm";
import Include from "./Include";
import NotFound from "./Components/NotFound/notFound.jsx";
import useAuthStore from "../store/authStore.js";

const App = () => {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<LoginForm />} />
        <Route
          path="/*"
          element={user ? <Include /> : <Navigate to="/auth" replace />}
          key={user ? "include" : "auth"}
        />
        <Route path="*" element={<NotFound />} key="not-found" />
      </Routes>
    </Router>
  );
};

export default App;
