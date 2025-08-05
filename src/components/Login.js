import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchLogin } from "../utils/towerpickapi";

const Login = () => {
    const [userId, setUserId] = useState("");
    const [userPw, setUserPw] = useState("");
    const navigate = useNavigate();
    const handleLogin = async () => {
        const { data, error } = await fetchLogin(userId.trim(), userPw.trim());
        if (error) {
            alert("로그인이 오류가 발생하였습니다.");
            return;
        }
        if (data) {
            getLoginInfo(data); //로컬스토리지에 저장하여 사용합니다.
            navigate("/mainpage");
        }
    };

    const getLoginInfo = (userInfo) => {
        const saved = JSON.stringify(userInfo);
        localStorage.setItem("towerpick", saved);
    };
    return (
        <div className="login-page">
            <img
                src={`${process.env.PUBLIC_URL}/images/logo_blue.png`}
                alt="TowerPick 로고"
                className="logo"
            />

            <div className="input-group">
                <label htmlFor="userId">아이디</label>
                <input
                    id="userId"
                    type="text"
                    value={userId}
                    onChange={(e) => {
                        setUserId(e.target.value);
                    }}
                    placeholder="아이디를 입력해주세요"
                />
            </div>

            <div className="input-group">
                <label htmlFor="password">비밀번호</label>
                <input
                    id="password"
                    type="password"
                    value={userPw}
                    onChange={(e) => {
                        setUserPw(e.target.value);
                    }}
                    placeholder="비밀번호를 입력해주세요"
                />
            </div>

            <div className="links">
                <Link to="#">아이디 찾기</Link>
                <Link to="#">비밀번호 찾기</Link>
            </div>
            <button className="login-button" onClick={handleLogin}>
                로그인
            </button>
            <div className="social-login">
                <img
                    src={`${process.env.PUBLIC_URL}/images/sns/kakao.png`}
                    alt="Kakao Login"
                />
                <img
                    src={`${process.env.PUBLIC_URL}/images/sns/naver.png`}
                    alt="Naver Login"
                />
                <img
                    src={`${process.env.PUBLIC_URL}/images/sns/google.png`}
                    alt="Google Login"
                />
            </div>
            <div className="signup">
                <Link to="/agreepage">회원가입</Link>
            </div>
        </div>
    );
};

export default Login;
