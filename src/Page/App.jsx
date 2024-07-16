import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginForm from "./Components/LoginForm/LoginForm";
import Include from "./Include";
import NotFoundPage from "./Components/NotFound/notFound.jsx";
import useAuthStore from "../store/authStore.js";

const App = () => {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<LoginForm />} />
        <Route
          path="/*"
          element={user ? <Include /> : <Navigate to="/auth" />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
