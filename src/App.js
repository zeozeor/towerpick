import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import StartPage from "./components/StartPage";
import Login from "./components/Login";
import AgreePage from "./components/AgreePage";
import JoinPage from "./components/JoinPage";
import MainPage from "./components/MainPage";
import Information from "./components/Information";
import Booking1 from "./components/Booking1";
import Booking2 from "./components/Booking2";
import Booking3 from "./components/Booking3";
import Season1 from "./components/Season1";
import Season2 from "./components/Season2";
import Season3 from "./components/Season3";
import MyReserve from "./components/MyReserve";
import MyPage from "./components/MyPage";
import CancelGeneral from "./components/CancelGeneral";
import CancelPass from "./components/CancelPass";
import CancelComplete from "./components/CancelComplete";
import "./app.scss";
import { useEffect, useState } from "react";

const App = () => {
    const ScrollToTop = () => {
        const location = useLocation();
        useEffect(()=>{
            const container = document.getElementById("mobile-page");
            if (container) {
                container.scrollTop = 0;
            }
        },[location.pathname]);
    };
    const [cancelInfo, setCancelInfo] = useState(null);
    const handleCancelInfo = (info)=>{
        setCancelInfo(info);
    }
    return (
        <HashRouter>
            <ScrollToTop />
            <div id="app">
                <div id="mobile-page">
                    <Routes>
                        <Route path="/" element={<StartPage />}></Route>
                        <Route path="/login" element={<Login />}></Route>
                        <Route
                            path="/agreepage"
                            element={<AgreePage />}
                        ></Route>
                        <Route path="/joinpage" element={<JoinPage />}></Route>
                        <Route path="/mainpage" element={<MainPage />}></Route>
                        <Route
                            path="/information"
                            element={<Information />}
                        ></Route>
                        <Route path="/booking1" element={<Booking1 />}></Route>
                        <Route path="/booking2" element={<Booking2 />}></Route>
                        <Route path="/booking3" element={<Booking3 />}></Route>
                        <Route path="/season1" element={<Season1 />}></Route>
                        <Route path="/season2" element={<Season2 />}></Route>
                        <Route path="/season3" element={<Season3 />}></Route>
                        <Route
                            path="/myReserve"
                            element={<MyReserve onCancel={handleCancelInfo} />}
                        ></Route>
                        <Route path="/mypage" element={<MyPage />}></Route>
                        <Route
                            path="/cancelgeneral"
                            element={<CancelGeneral cancelInfo={cancelInfo}/>}
                        ></Route>
                        <Route
                            path="/cancelpass"
                            element={<CancelPass />}
                        ></Route>
                        <Route
                            path="/cancelcomplete"
                            element={<CancelComplete />}
                        ></Route>
                    </Routes>
                </div>
            </div>
        </HashRouter>
    );
};

export default App;
