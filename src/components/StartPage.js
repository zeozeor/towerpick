import { useNavigate } from "react-router-dom";

const StartPage = () => {
    const navigate = useNavigate();

    return (
        <div className="start-page">
            <img
                src={`${process.env.PUBLIC_URL}/images/logo_blue.png`}
                alt="TowerPick 로고"
                className="logo"
            />
            <img
                src={`${process.env.PUBLIC_URL}/images/startpagebg.jpg`}
                alt="타워 이미지"
                className="main-image"
            />

            <div className="welcome-text">
                <h1>환영합니다!</h1>
                <p>
                    복잡한 도심 속 주차 걱정은 그만!
                    <br />
                    타워픽 앱으로
                    <br />
                    빠르고 편리한 주차를 이용해보세요
                </p>
            </div>
            <button className="start-button" onClick={() => navigate("/login")}>
                시작하기
            </button>
        </div>
    );
};

export default StartPage;
