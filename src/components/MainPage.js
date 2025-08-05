import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navigate from "../components/Navigate";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { LuSquareParking } from "react-icons/lu";
import { LuSearch } from "react-icons/lu";
import { MdOutlinePregnantWoman } from "react-icons/md";
import { TbDisabled } from "react-icons/tb";
import { MdElectricCar } from "react-icons/md";
import { useEffect, useState } from "react";
import { getAvailableSpacesByFloor, getMyPasses } from "../utils/towerpickapi";

const MainPage = () => {
    const navigate = useNavigate();

    //로그인 상태 확인
    const [loading, setLoading] = useState(true);

    //층별 잔여석 선언 함수
    const [floorData, setFloorData] = useState([]);

    //정기권 보유시 구매 창으로 넘어가기 x
    const [seasonTicket,setSeasonTicket] = useState(false);

    //현재 로그인 한 사용자 ID
    const towerpickData = localStorage.getItem("towerpick");
    const userID = towerpickData ? JSON.parse(towerpickData).member_id : null;
    

    useEffect(() => {
        //잔여석 불러오기
        const fetchData = async () => {
            const { data:spaceData, error:spaceError } = await getAvailableSpacesByFloor();
            if (spaceError) {
                alert("잔여석 확인이 불가능합니다");
            }
            if (spaceData) {
                setFloorData(spaceData);
            }

        //정기권 보유 여부 확인
        const { data:passData, error:passError } = await getMyPasses(userID);
        if (passError){
            console.error ("정기권 정보를 불러오지 못 했습니다")
        } else {
            const activePass = passData?.find(pass => pass.status === "active" && pass.is_paid);
            setSeasonTicket(!!activePass);
        }
            setLoading(false);
        };
        fetchData();
    }, []);

    //층별 데이터 불러오기 함수
    const getFloorAvailable = (floorNumber) => {
        const floor = floorData.find((f) => f.floor === floorNumber);
        return floor ? floor.available : 0;
    };

    //잔여석 데이터 로딩 중 함수
    if (loading) {
        return <div className="alert">로딩 중...</div>;
    }

    return (
        <div className="main-page">
            {/* 공통헤더 */}
            <Header prev_path="/mainpage" prev_title="홈" />
            {/* 주차구역 / 위치 및 잔여석 */}
            <div className="section-one">
                <div className="parking-area-wrap">
                    <h3>주차구역 찾기</h3>
                    <div className="parking-area">
                        <p>원하는 위치에 빈자리, 지금 바로 확인하세요</p>
                        <p>#실시간</p>
                    </div>
                </div>
                <div className="seats-wrap">
                    <h3>위치 및 잔여석</h3>
                    <div className="seats">
                        <div className="seats-one">
                            <h4>B1</h4>
                            <TfiLayoutLineSolid className="line" />
                            <p>{getFloorAvailable(1)}/30석</p>
                        </div>
                        <div className="seats-two">
                            <h4>B2</h4>
                            <TfiLayoutLineSolid className="line" />
                            <p>{getFloorAvailable(2)}/30석</p>
                        </div>
                        <div className="seats-three">
                            <h4>B3</h4>
                            <TfiLayoutLineSolid className="line" />
                            <p>{getFloorAvailable(3)}/30석</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* 예약 / 정기권 */}
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
                                if (loading){
                                    alert ("정보를 불러오는 중입니다")
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

            {/* 이용 안내 */}
            <div className="information">
                <div className="infor-header">
                    <LuSquareParking className="parking-icon" />
                    <h3>이용 안내</h3>
                </div>
                <div className="infor">
                    <div className="infor-text">
                        <p>
                            매번 찾지 말고, <br /> 고정된 자리로 편하게
                            주차하세요
                        </p>
                        <button
                            onClick={() => {
                                navigate("/information");
                            }}
                        >
                            최대 30% 할인
                        </button>
                    </div>
                    <div className="search-icon">
                        <LuSearch
                            onClick={() => {
                                navigate("/information");
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* B1 주차 안내 */}
            <div className="parking-b1">
                <div className="b1-box">
                    <h3>B1</h3>
                </div>
                <div className="b1-icon">
                    <div className="b1-one">
                        <MdOutlinePregnantWoman className="b1-icon" />
                        <p>임산부 배려구역</p>
                    </div>
                    <div className="b1-two">
                        <TbDisabled className="b1-icon" />
                        <p>장애인 전용구역</p>
                    </div>
                </div>
                <img
                    src={`${process.env.PUBLIC_URL}/images/homebg/homebg_b1.png`}
                    art="B1 주차장 이미지"
                />
            </div>
            {/* B2-B3 주차 안내 */}
            <div className="b2-box">
                <h3>B2~B3</h3>
            </div>
            <div className="parking-b2">
                <div className="b2-one">
                    <MdElectricCar className="b2-icon" />
                    <p>전기차 충전구역</p>
                </div>
                <img
                    src={`${process.env.PUBLIC_URL}/images/homebg/homebg_b2.jpg`}
                    art="B2 주차장 이미지"
                />
            </div>

            {/* 푸터 */}
            <footer className="footer">
                <p>이벤트</p>
                <p>공지사항</p>
                <p>이용안내</p>
                <p>제휴문의</p>
                <p>자주 묻는 질문</p>
                <p>고객센터</p>
                <br />
                <p>대표이사 : 소은경</p>
                <p>주소 : 수원 팔달구 덕영대로 899 3층</p>
                <p>대표번호 : 0507-1361-5225</p>
                <img
                    src={`${process.env.PUBLIC_URL}/images/footer_logo.png`}
                    art="푸터 로고"
                />
                <p>ⓒ2025 (TowerPick).All rights reserrved.</p>
            </footer>
            <Navigate />
        </div>
    );
};

export default MainPage;
