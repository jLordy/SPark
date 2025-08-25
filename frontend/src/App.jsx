import HomePage from "./pages/HomePage"
import { Routes, Route} from "react-router-dom"
import UsersPage from "./pages/UsersPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
function App() {
  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300">
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/users/:id" element={<UsersPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage />} />
      </Routes>

    </div>
  )

}

export default App
