import { Route, Routes } from "react-router-dom"


// components import 
import Footer from "./components/Common/Footer"
import Header from "./components/Common/Header"
import Home from "./pages/Home"
import Main from "./components/Common/Main"
import Login from "./components/Auth/Login"
import Register from "./components/Auth/Register"
import Board from "./components/Board/Board"
import Calendar from "./components/Calendar/Calendar"
import Table from "./components/Table/Table"
import Etc from "./components/etc/Etc"
import Chart from "./components/Chart/Chart"

function App() {
    return (
        <>
            <Header />
            <Main>
                <Routes>
                    <Route path="/" element={<Home />} />

                    {/* Auth */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/board" element={<Board />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/table" element={<Table />} />
                    <Route path="/chart" element={<Chart />} />

                    <Route path="/etc" element={<Etc />} />
                </Routes>
            </Main>
            <Footer />
        </>
    )
}

export default App
