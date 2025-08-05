import { useEffect, useState } from "react";

const BookingBox3 = ({ start, end, floor, slot,isInfo }) => {
    // 날짜 포맷 함수
    function format(dt) {
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
    }

    // BookingBox2와 동일하게 localStorage에서 유저 정보 가져오기
    const [userInfo, setUserInfo] = useState({ phone: "-", car_number: "-" });

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

    return (
        <div className="booking-box">
            <div className="booking-title">예약 확인</div>
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
                    <div className="form-label">예약위치</div>
                    <div className="form-input">
                        <p>
                            B{floor}층 {slot}번
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
            </div>
        </div>
    );
};

export default BookingBox3;
