import { useState, useEffect } from "react";
import Step from "./Step";
import ParkingImg from "./ParkingImg";
import BookingBox1 from "./BookingBox1";
import YesorNo from "./YesorNo";
import Price1 from "./Price1";
import Header from "./Header";
import Navigate from "./Navigate";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

const HOURLY_RATE = 1500;
const DAILY_RATE = 35000;

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

const calcFee = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s) || isNaN(e) || e <= s) return 0;
    let diffMs = e - s;
    let diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    let diffDays = Math.floor(diffHours / 24);
    let remainHours = diffHours % 24;
    let total = 0;
    if (diffHours >= 24) {
        total += diffDays * DAILY_RATE + remainHours * HOURLY_RATE;
    } else {
        total = diffHours * HOURLY_RATE;
        if (total > DAILY_RATE) total = DAILY_RATE;
    }
    return total;
};

const Booking1 = () => {
    const navigate = useNavigate();
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [available, setAvailable] = useState(null);
    const [price, setPrice] = useState(null);
    const [reserved, setReserved] = useState([]);
    const [floor, setFloor] = useState(1);

    // 예약불가(겹치는) slot_number 계산
    useEffect(() => {
        if (!start || !end || !floor) {
            setReserved([]);
            return;
        }
        (async () => {
            const { data: allSpaces } = await supabase
                .from("spaces")
                .select("id, slot_number")
                .eq("is_active", true)
                .eq("floor", floor);

            if (!allSpaces) {
                setReserved([]);
                return;
            }
            const floorSpaceIDs = allSpaces.map((space) => space.id);

            const dbStart = toDbFormat(start);
            const dbEnd = toDbFormat(end);
            const dbStartDate = toDateOnly(start);
            const dbEndDate = toDateOnly(end);

            // 일반예약 겹침
            const { data: overlappedBookings } = await supabase
                .from("bookings")
                .select("space_id")
                .eq("status", "active")
                .lt("start_time", dbEnd)
                .gt("end_time", dbStart)
                .in("space_id", floorSpaceIDs);

            // 정기권 겹침
            const { data: overlappedPasses } = await supabase
                .from("passes")
                .select("space_id, start_date, end_date, status")
                .eq("status", "active")
                .lt("start_date", dbEndDate)
                .gt("end_date", dbStartDate)
                .in("space_id", floorSpaceIDs);

            const reservedSpaceIDs = [
                ...(overlappedBookings?.map((b) => b.space_id) || []),
                ...(overlappedPasses?.map((p) => p.space_id) || []),
            ];
            const reservedSlotNumbers = allSpaces
                .filter((space) => reservedSpaceIDs.includes(space.id))
                .map((space) => space.slot_number);

            setReserved(reservedSlotNumbers);
        })();
    }, [start, end, floor]);

    // 예약 가능여부, 가격 계산
    const handleDateChange = async (newStart, newEnd) => {
        setStart(newStart);
        setEnd(newEnd);

        const dbStart = toDbFormat(newStart);
        const dbEnd = toDbFormat(newEnd);
        const dbStartDate = toDateOnly(newStart);
        const dbEndDate = toDateOnly(newEnd);

        if (!newStart || !newEnd) {
            setAvailable(null);
            setPrice(null);
            return;
        }

        const { data: allSpaces, error: err1 } = await supabase
            .from("spaces")
            .select("id, slot_number")
            .eq("is_active", true)
            .eq("floor", floor);

        if (err1 || !allSpaces) {
            setAvailable(null);
            setPrice(null);
            return;
        }
        const floorSpaceIDs = allSpaces.map((space) => space.id);

        const { data: overlappedBookings } = await supabase
            .from("bookings")
            .select("space_id")
            .eq("status", "active")
            .lt("start_time", dbEnd)
            .gt("end_time", dbStart)
            .in("space_id", floorSpaceIDs);

        const { data: overlappedPasses } = await supabase
            .from("passes")
            .select("space_id, start_date, end_date, status")
            .eq("status", "active")
            .lt("start_date", dbEndDate)
            .gt("end_date", dbStartDate)
            .in("space_id", floorSpaceIDs);

        const overlappedBookingIDs =
            overlappedBookings?.map((b) => b.space_id) || [];
        const overlappedPassIDs =
            overlappedPasses?.map((p) => p.space_id) || [];
        const totalOverlappedIDs = Array.from(
            new Set([...overlappedBookingIDs, ...overlappedPassIDs])
        );
        const leftSpaces = allSpaces.length - totalOverlappedIDs.length;

        setAvailable(leftSpaces > 0);
        setPrice(calcFee(newStart, newEnd));
    };

    return (
        <div>
            <Header prev_path="/mainpage" prev_title="예약" />
            <div className="booking1">
                <h2 className="booking-title">예약 일자 선택</h2>
                <Step currentStep={1} />
                <BookingBox1
                    start={start}
                    end={end}
                    onDateChange={handleDateChange}
                    floor={floor}
                    setFloor={setFloor}
                />
                <YesorNo available={available} />
                <Price1 price={price} />
                <ParkingImg reserved={reserved} floor={floor} />
                <button
                    onClick={() => {
                        if (!available) {
                            alert("입력 정보를 다시 확인해주세요.");
                            return;
                        }
                        navigate("/booking2", {
                            state: { start, end, price, floor, reserved, isInfo: true},
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

export default Booking1;
