import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddHabit from "./pages/AddHabit";
import Habits from "./pages/Habits";
import CompleteHabit from "./pages/CompleteHabit";



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add-habit" element={<AddHabit />} />
      <Route path="/habits" element={<Habits />} />
      <Route path="/add-habit" element={<AddHabit />} />
      <Route path="/complete/:id" element={<CompleteHabit />} />


    </Routes>
  );
}
