import { useEffect, useState } from "react";
import ParkingMapB1 from "./ParkingMapB1";
import ParkingMapB2B3 from "./ParkingMapB2B3";

const FLOOR_LIST = [1, 2, 3];
const slotClassMapB1 = {
    1: "slot-pink",
    2: "slot-pink",
    3: "slot-pink",
    4: "slot-pink",
    5: "slot-yellow",
    6: "slot-yellow",
    11: "slot-yellow",
    21: "slot-yellow",
    7: "slot-blue",
    8: "slot-blue",
    9: "slot-blue",
    10: "slot-blue",
};

const BookingBox2 = ({
    start,
    end,
    floor,
    setFloor,
    reservedSlots = [],
    selectedSlot,
    setSelectedSlot,
    isInfo, // 일반예약 true, 정기권 false
}) => {
    // 유저 정보 가져오기
    const [userInfo, setUserInfo] = useState({ phone: "", car_number: "" });

    useEffect(() => {
        try {
            const raw = localStorage.getItem("towerpick");
            if (raw) {
                const user = JSON.parse(raw);
                setUserInfo({
                    phone: user.phone || "-",
                    car_number: user.car_number || "-",
                });
            }
        } catch (e) {
            setUserInfo({ phone: "-", car_number: "-" });
        }
    }, []);

    // 날짜 포맷 함수 (일반예약: yy.mm.dd.hh.mm / 정기권: yy.mm.dd)
    const format = (dt) => {
        if (!dt) return "";
        const d = new Date(dt);
        const pad = (n) => n.toString().padStart(2, "0");
        let strTemp = `${d.getFullYear().toString().slice(2)}-${pad(
            d.getMonth() + 1
        )}-${pad(d.getDate())}`;
        if (isInfo) {
            strTemp += ` ${pad(d.getHours())}:${pad(d.getMinutes())}`;
        }
        return strTemp;
    };

    const handleFloorChange = (e) => {
        setFloor(Number(e.target.value));
    };

    const handleSelectSlot = (n) => {
        if (reservedSlots.includes(n)) return;
        setSelectedSlot(n);
    };

    const slotClassMap = floor === 1 ? slotClassMapB1 : {};

    return (
        <div>
            <div className="booking-box">
                <div className="booking-title">예약 신청</div>
                <div className="booking-form">
                    <div className="form-row">
                        <div className="form-label">예약일시</div>
                        <div className="form-input">
                            <p>
                                {format(start)} ~ {format(end)}
                            </p>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-label">휴대폰번호</div>
                        <div className="form-input">
                            <p>{userInfo.phone}</p>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-label">차량번호</div>
                        <div className="form-input">
                            <p>{userInfo.car_number}</p>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-label">선택층</div>
                        <div className="form-input">
                            <select value={floor} onChange={handleFloorChange}>
                                {FLOOR_LIST.map((f) => (
                                    <option key={f} value={f}>
                                        B{f}층
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className="parking-map-wrap">
                {floor === 1 ? (
                    <ParkingMapB1
                        slotClassMap={slotClassMap}
                        reserved={reservedSlots}
                        selected={selectedSlot}
                        onSelectSlot={handleSelectSlot}
                    />
                ) : (
                    <ParkingMapB2B3
                        reserved={reservedSlots}
                        selected={selectedSlot}
                        onSelectSlot={handleSelectSlot}
                    />
                )}
            </div>
        </div>
    );
};

export default BookingBox2;
