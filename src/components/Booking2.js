import { useState, useEffect } from "react";
import Header from "./Header";
import Step from "./Step";
import BookingBox2 from "./BookingBox2";
import Price2 from "./Price2";
import BookingPlace from "./BookingPlace";
import Booking2Guide from "./Booking2Guide";
import Navigate from "./Navigate";
import { useNavigate, useLocation } from "react-router-dom";
import { getSpacesByFloor, insertBooking } from "../utils/towerpickapi";


const Booking2 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [price, setPrice] = useState(location.state?.price || 0);
    // 층/선택 슬롯
    const [floor, setFloor] = useState(1);
    const [selectedSlot, setSelectedSlot] = useState(null);
    // reservedSlots를 상태로 관리 (처음은 location.state?.reserved || [])
    const [reservedSlots, setReservedSlots] = useState([]);
    // 층이 변경될 때마다 예약된 슬롯 다시 조회
    useEffect(() => {
        const fetchReserved = async () => {
            const { data } = await getSpacesByFloor(floor);
            if (data) {
                setReservedSlots(
                    data.filter((d) => d.is_reserved).map((d) => d.slot_number)
                );
            }
        };
        fetchReserved();
        // 층 바뀌면 선택도 리셋
        setSelectedSlot(null);
    }, [floor]);
    //  

    

    // start, end도 꼭 전달
    const { start, end } = location.state || {};
    //얼랏 표기
    const formatDateTime = (str) => {
        if (!str) return "";
        const d = new Date(str);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");    
        const hh = String(d.getHours()).padStart(2, "0");
        const min = String(d.getMinutes()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    };

    return (
        <div>
            <Header prev_path="/booking1" prev_title="예약" />
            <div className="booking2">
                <h2 className="booking-title">예약 신청</h2>
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
                    isInfo={true}
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
                        const message = `예약 정보를 확인해주세요.\n\n입차일시 : ${formatDateTime(start)}\n출차일시 : ${formatDateTime(
                            end)}\n선택자리 : B${floor}층 ${selectedSlot}번\n결제금액 : ${price?.toLocaleString()}원\n\n예약을 진행할까요?`;
                        const confirmed = window.confirm(message);
                        if (!confirmed) return;
                        const { data: spaceList } = await getSpacesByFloor(
                            floor
                        );
                        const selectedSpace = spaceList.find(
                            (space) => space.slot_number === selectedSlot
                        );
                        await insertBooking(
                            userID,
                            selectedSpace.id,
                            start,
                            end,
                            price
                        );
                        navigate("/booking3", {
                            state: {
                                start,
                                end,
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

export default Booking2;
