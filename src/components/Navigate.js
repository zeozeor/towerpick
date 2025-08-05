import { GoHomeFill } from "react-icons/go";
import { GoChecklist } from "react-icons/go";
import { BiUserCircle } from "react-icons/bi";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";

const Navigate = () => {
    const navigate = useNavigate();
    return (
        <div className="navigate">
            <div
                className="home"
                onClick={() => {
                    navigate("/mainpage");
                }}
            >
                <GoHomeFill />
                <p>홈</p>
            </div>
            <TfiLayoutLineSolid className="line" />
            <div
                className="check"
                onClick={() => {
                    navigate("/myReserve");
                }}
            >
                <GoChecklist />
                <p>이용내역</p>
            </div>
            <TfiLayoutLineSolid className="line" />
            <div
                className="my"
                onClick={() => {
                    navigate("/mypage");
                }}
            >
                <BiUserCircle />
                <p>내 정보</p>
            </div>
        </div>
    );
};

export default Navigate;
