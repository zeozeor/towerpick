import Header from "./Header";
import Navigate from "../components/Navigate";
import { useNavigate } from "react-router-dom";
import { useState ,useEffect } from "react";
import { getMyPasses } from "../utils/towerpickapi";

const Information = () => {
    const navigate = useNavigate();

    //로그인 상태 확인
    const [loading, setLoading] = useState(true);

    //정기권 보유시 구매 창으로 넘어가기 x
    const [seasonTicket, setSeasonTicket] = useState(false);

    //현재 로그인 한 사용자 ID
    const towerpickData = localStorage.getItem("towerpick");
    const userID = towerpickData ? JSON.parse(towerpickData).member_id : null;

    useEffect(() => {
        const fetchData = async () => {
            //정기권 보유 여부 확인
            const { data: passData, error: passError } = await getMyPasses(userID);
            if (passError) {
                console.error("정기권 정보를 불러오지 못 했습니다")
            } else {
                const activePass = passData?.find(pass => pass.status === "active" && pass.is_paid);
                setSeasonTicket(!!activePass);
            }

            setLoading(false);

        };
        fetchData();
    }, []);

    return (
        <div>
            {/* 공통헤더 */}
            <Header prev_path="/mainpage" prev_title="이용안내" />

            <h3 className="price-info">요금 안내</h3>
            <img src={`${process.env.PUBLIC_URL}/images/priceinfo.jpg`} art="요금 안내 이미지" />
            <div className="section-two">
                <div className="reservation-wrap">
                    <h3>예약</h3>
                    <div className="reservation">
                        <p>
                            시간 맞춰 딱! <br /> 사전 예약으로 편리하게
                        </p>
                        <button
                            onClick={() => {
                                navigate("/booking1");
                            }}
                        >
                            바로가기
                        </button>
                    </div>
                </div>
                <div className="ticket-wrap">
                    <h3>정기권 구매</h3>
                    <div className="ticket">
                        <p>
                            한 번 결제로 한 달! <br /> 편하게 이용하세요
                        </p>
                        <button
                            onClick={() => {
                                if (loading) {
                                    alert("정보를 불러오는 중입니다")
                                    return;
                                }

                                console.log("seasonTicket at click", seasonTicket);

                                if (seasonTicket) {
                                    alert("사용중인 정기권이 존재합니다");
                                } else {
                                    navigate("/season1");
                                }
                            }}
                        >
                            바로가기
                        </button>
                    </div>
                </div>
            </div>
            <Navigate />
        </div>
    );
};

export default Information;
