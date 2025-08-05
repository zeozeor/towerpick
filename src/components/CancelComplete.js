import { useNavigate } from "react-router-dom";
import { CiCircleCheck } from "react-icons/ci";
import Header from "./Header";
import Navigate from "./Navigate";

const CancelComplete = () => {
    const navigate = useNavigate();

    return (
        <div className="complete-all">
            <Header prev_path="/mainpage" prev_title="취소 완료" />
            <div className="cancel-complete">
                <div className="complete-wrap">
                    <h2 className="complete-title">취소 완료</h2>
                    <div className="check-icon-wrap">
                        <CiCircleCheck className="check-icon"/>
                    </div>
                    <p className="complete-ment">예약이 취소 되었습니다.</p>
                </div>
                <button
                    className="complete-btn"
                    onClick={() => navigate("/mainpage")}
                >
                    확인
                </button>
            </div>
            <Navigate />
        </div>
    );
};

export default CancelComplete;
