import { useState, useEffect } from "react";
import Header from "./Header";
import Step from "./Step";
import BookingBox2 from "./BookingBox2";
import Price2 from "./Price2";
import BookingPlace from "./BookingPlace";
import Booking2Guide from "./Booking2Guide";
import Navigate from "./Navigate";
import { useNavigate, useLocation } from "react-router-dom";
import { getSpacesByFloor, insertPass } from "../utils/towerpickapi";

const Season2 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [price, setPrice] = useState(location.state?.price || 0);
    // 층 정보 state
    const [floor, setFloor] = useState(1);
    const [selectedSlot, setSelectedSlot] = useState(null);
    // reservedSlots를 state로 따로 관리 (층 바뀔 때마다 동기화)
    const [reservedSlots, setReservedSlots] = useState([]);
    // 층 바뀔 때마다 해당 층 예약 슬롯 fetch → setReservedSlots
    useEffect(() => {
        const fetchReserved = async () => {
            const { data } = await getSpacesByFloor(floor);
            if (data) {
                setReservedSlots(
                    data.filter((d) => d.is_reserved).map((d) => d.slot_number)
                );
            } else {
                setReservedSlots([]);
            }
        };
        fetchReserved();
        setSelectedSlot(null);
    }, [floor]);
    // 예약일시 데이터
    const { start, end, durationType } = location.state || {};
    //얼랏 표기
    const formatDate = (str) => {
        if (!str) return "";
        const d = new Date(str);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    return (
        <div>
            <Header prev_path="/season1" prev_title="정기권 구매" />
            <div className="booking2">
                <h2 className="booking-title">구매 신청</h2>
                <Step currentStep={2} />
                <BookingBox2
                    start={start}
                    end={end}
                    setPrice={setPrice}
                    floor={floor}
                    setFloor={setFloor}
                    reservedSlots={reservedSlots}
                    selectedSlot={selectedSlot}
                    setSelectedSlot={setSelectedSlot}
                />
                <BookingPlace selectedSlot={selectedSlot} floor={floor} />
                <Price2 price={price} />
                <button
                    onClick={async () => {
                        // 자리 미선택 체크
                        if (!selectedSlot) {
                            alert("자리를 선택해주세요.");
                            return;
                        }
                        const raw = localStorage.getItem("towerpick");
                        const user = raw ? JSON.parse(raw) : null;
                        const userID = user?.member_id;
                        const message = `예약 정보를 확인해주세요.\n\n예약일 : ${formatDate(
                            start
                        )}\n만료일 : ${formatDate(
                            end
                        )}\n선택자리 : B${floor}층 ${selectedSlot}번\n결제금액 : ${price?.toLocaleString()}원\n\n예약을 진행할까요?`;
                        const confirmed = window.confirm(message);
                        if (!confirmed) return;
                        const { data: spaceList } = await getSpacesByFloor(
                            floor
                        );
                        const space = spaceList.find(
                            (space) => space.slot_number === selectedSlot
                        );
                        await insertPass(
                            userID,
                            space.id,
                            durationType,
                            start,
                            end
                        );
                        navigate("/season3", {
                            state: {
                                start,
                                end,
                                durationType,
                                price,
                                floor,
                                slot: selectedSlot,
                            },
                        });
                    }}
                >
                    예약하기
                </button>
                <Booking2Guide />
            </div>
            <Navigate />
        </div>
    );
};

export default Season2;
