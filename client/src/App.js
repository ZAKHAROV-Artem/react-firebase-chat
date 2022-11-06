import "./App.css";
import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Spin } from "antd";
import { AuthContext } from "./context/AuthCotext";

function App() {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        {currentUser ? (
          <Route index path="/" element={<Chat />} />
        ) : (
          <Route index path="/" element={<Login />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
