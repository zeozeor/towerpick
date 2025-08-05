import { useState, useEffect } from "react";
import Step from "./Step";
import ParkingImg from "./ParkingImg";
import SeasonBox1 from "./SeasonBox1";
import SeasonYesorNo from "./SeasonYesorNo";
import Price1 from "./Price1";
import Header from "./Header";
import Navigate from "./Navigate";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

// 시작일 + 타입 → 종료일 계산
const calcEndDate = (startDateStr, period) => {
    const startDate = new Date(startDateStr);
    if (isNaN(startDate)) return "";
    switch (period) {
        case "1m":
            startDate.setMonth(startDate.getMonth() + 1);
            break;
        case "3m":
            startDate.setMonth(startDate.getMonth() + 3);
            break;
        case "6m":
            startDate.setMonth(startDate.getMonth() + 6);
            break;
        case "12m":
            startDate.setFullYear(startDate.getFullYear() + 1);
            break;
        default:
            return "";
    }
    return startDate.toISOString().slice(0, 16);
};

const toDbFormat = (dt) => {
    if (!dt) return "";
    const d = typeof dt === "string" ? new Date(dt) : dt;
    if (isNaN(d)) return "";
    const pad = (n) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
    )} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
};
const toDateOnly = (dt) => {
    if (!dt) return "";
    const d = typeof dt === "string" ? new Date(dt) : dt;
    if (isNaN(d)) return "";
    const pad = (n) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const calcFee = (period) => {
    switch (period) {
        case "1m":
            return 200000;
        case "3m":
            return 600000;
        case "6m":
            return 1100000;
        case "12m":
            return 2000000;
        default:
            return 0;
    }
};

const Season1 = () => {
    const navigate = useNavigate();
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [type, setType] = useState("");
    const [floor, setFloor] = useState(1);
    const [price, setPrice] = useState(null);
    const [reserved, setReserved] = useState([]);
    const [available, setAvailable] = useState(null);

    // 예약불가 slot 계산 (Booking1과 똑같이)
    useEffect(() => {
        if (!start || !type || !floor) {
            setReserved([]);
            setAvailable(null);
            return;
        }
        const newEnd = calcEndDate(start, type);
        setEnd(newEnd);

        const dbStart = toDbFormat(start);
        const dbEnd = toDbFormat(newEnd);
        const dbStartDate = toDateOnly(start);
        const dbEndDate = toDateOnly(newEnd);

        (async () => {
            const { data: allSpaces } = await supabase
                .from("spaces")
                .select("id, slot_number")
                .eq("is_active", true)
                .eq("floor", floor);

            if (!allSpaces) {
                setReserved([]);
                setAvailable(null);
                return;
            }
            const floorSpaceIDs = allSpaces.map((space) => space.id);

            // 1. 일반예약 겹침
            const { data: overlappedBookings } = await supabase
                .from("bookings")
                .select("space_id")
                .eq("status", "active")
                .lt("start_time", dbEnd)
                .gt("end_time", dbStart)
                .in("space_id", floorSpaceIDs);

            // 2. 정기권 겹침 (기간 겹침)
            const { data: overlappedPasses } = await supabase
                .from("passes")
                .select("space_id, start_date, end_date, status")
                .eq("status", "active")
                .in("space_id", floorSpaceIDs)
                .or(
                    `and(start_date.lte.${dbEndDate},end_date.gte.${dbStartDate})`
                );

            const reservedSpaceIDs = [
                ...(overlappedBookings?.map((b) => b.space_id) || []),
                ...(overlappedPasses?.map((p) => p.space_id) || []),
            ];
            const reservedSlotNumbers = allSpaces
                .filter((space) => reservedSpaceIDs.includes(space.id))
                .map((space) => space.slot_number);

            setReserved(reservedSlotNumbers);
            setAvailable(reservedSlotNumbers.length < allSpaces.length);
        })();
    }, [start, type, floor]);

    // 날짜 선택
    const handleDateChange = (newStart) => {
        setStart(newStart);
        if (newStart && type) {
            const newEnd = calcEndDate(newStart, type);
            setEnd(newEnd);
            setPrice(calcFee(type));
        } else {
            setEnd("");
            setPrice(null);
        }
    };

    // 타입 선택
    const handleTypeChange = (newType) => {
        setType(newType);
        if (start && newType) {
            const newEnd = calcEndDate(start, newType);
            setEnd(newEnd);
            setPrice(calcFee(newType));
        } else {
            setEnd("");
            setPrice(null);
        }
    };

    return (
        <div>
            <Header prev_path="/mainpage" prev_title="정기권 구매" />
            <div className="booking1">
                <h2 className="booking-title">구매 기간 선택</h2>
                <Step currentStep={1} />
                <SeasonBox1
                    start={start}
                    end={end}
                    onDateChange={handleDateChange}
                    type={type}
                    setType={handleTypeChange}
                    floor={floor}
                    setFloor={setFloor}
                />
                <SeasonYesorNo available={available} />
                <Price1 price={price} />
                <ParkingImg reserved={reserved} floor={floor} />
                <button
                    onClick={() => {
                        if (!available) {
                            alert("입력 정보를 다시 확인해주세요.");
                            return;
                        }

                        navigate("/Season2", {
                            state: {
                                start,
                                end,
                                durationType: type,
                                price,
                                floor,
                                reserved,
                            },
                        });
                    }}
                >
                    다음단계
                </button>
            </div>
            <Navigate />
        </div>
    );
};

export default Season1;
