import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AddTask from "./pages/AddTask";

export default function App() {
  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>Tasks</h1>
        <nav>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/add">Add task</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddTask />} />
          <Route path="*" element={<p className="empty-msg">Page not found.</p>} />
        </Routes>
      </main>
    </div>
  );
}
