import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import { Routes, Route} from "react-router-dom"
import UsersPage from "./pages/UsersPage"

function App() {
  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/users/:id" element={<UsersPage/>}/>
      </Routes>

    </div>
  )

}

export default App
