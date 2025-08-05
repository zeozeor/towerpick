import { useNavigate } from "react-router-dom";
import { GrPrevious } from "react-icons/gr";
import { LuMenu } from "react-icons/lu";
import { useEffect, useState } from "react";

const Header = ({ prev_path, prev_title }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 로그인 유저 정보
    const [userInfo, setUserInfo] = useState({ member_id: "", car_number: "" });
    useEffect(() => {
        try {
            const raw = localStorage.getItem("towerpick");
            if (raw) {
                const user = JSON.parse(raw);
                setUserInfo({
                    member_id: user.member_id || "-",
                    car_number: user.car_number || "-",
                });
            }
        } catch (e) {
            setUserInfo({ member_id: "-", car_number: "-" });
        }
    }, []);

    // 이전 버튼 함수
    const handlePrevClick = () => {
        navigate(prev_path);
    };
    // 메뉴 버튼 함수
    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };
    const handleLogout = (e) => {
        const confirmed = window.confirm("정말 로그아웃하시겠습니까?");
        if (confirmed) {
            localStorage.clear();
            navigate("/login");
        }
    };

    return (
        <div className="header">
            <div className="head-prev" onClick={handlePrevClick}>
                <div className="prev-icon">
                    <GrPrevious />
                </div>
            </div>
            <p className="head-title">{prev_title}</p>
            <div className="menu" onClick={toggleMenu}>
                <div className="menu-icon">
                    <LuMenu />
                </div>
            </div>
            <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
                <div className="menu-content">
                    <p className="login-info">로그인 정보</p>
                    <div className="login-info-wrap">
                        <p className="login-id">{userInfo.member_id} 님</p>
                        <p className="login-carnum">{userInfo.car_number}</p>
                        <button onClick={handleLogout}>로그아웃</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
