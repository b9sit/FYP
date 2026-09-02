import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  //Navigate
} from "react-router-dom";
import Login from "../Login/Login";
import Register from "../Register/Register";
import NotFound from "../NotFound/NotFound";
import ProtectedRoute from "../../components/ProtectedRoute";
import Home from "../Home/Home";
import JoinOrg from "../JoinOrg/JoinOrg";

// function Logout() {
//   localStorage.clear();
//   return <Navigate to="/login" />;
// }

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/join/:token" element={<JoinOrg />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
