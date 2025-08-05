import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Navigate from "./Navigate";
import { cancelBooking } from "../utils/towerpickapi";

const CancelGeneral = ({ cancelInfo }) => {
    const navigate = useNavigate();

    // 유저 정보
    const [userInfo, setUserInfo] = useState({
        userID: "",
        phone: "",
        car_number: "",
    });

    const [myCancel, setMyCancel] = useState(cancelInfo);
    const [loading, setLoading] = useState(true);
    const [cancelReason, setCancelReason] = useState("");
    const [refundMethod, setRefundMethod] = useState("");
    const [cancelFee, setCancelFee] = useState("무료");
    const [isCancel, setIsCancel] = useState(true);

    const handleCancelFee = (startTime) => {
        const now = new Date();
        const start = new Date(startTime);
        const diff = (start - now) / (1000 * 60); //남은 분
        if (diff >= 60) {
            setCancelFee("무료");
            setIsCancel(true); //취소가능
        } else {
            setCancelFee("환불불가");
            setIsCancel(false); //취소불가
        }
    };

    // 1. 유저 정보 로딩
    useEffect(() => {
        try {
            const raw = localStorage.getItem("towerpick");
            if (raw) {
                const user = JSON.parse(raw);
                setUserInfo({
                    userID: user.userID || user.id || user.member_id || "",
                    phone: user.phone || "",
                    car_number: user.car_number || "",
                });
            }
        } catch {
            setUserInfo({ userID: "", phone: "", car_number: "" });
        }
        setLoading(false);
        if (!cancelInfo) return;
        setMyCancel(cancelInfo);
        handleCancelFee(cancelInfo.start_time);
    }, []);

    // yy.mm.dd.hh.mm 포맷 (일반권은 시/분 필요)
    function format(dt) {
        if (!dt) return "";
        const d = new Date(dt);
        const pad = (n) => n.toString().padStart(2, "0");
        return `${d.getFullYear().toString().slice(2)}-${pad(
            d.getMonth() + 1
        )}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    // 정기권처럼 실제로 예약 취소
    const handleCancel = async () => {
        if (!myCancel) return;
        const { data, error } = await cancelBooking(
            myCancel.id,
            myCancel.space_id
        );
        if (error) {
            alert("사전 예약 취소 시 오류가 발생했습니다.");
            return;
        }
        if (data) {
            navigate("/cancelcomplete");
        }
    };

    if (loading) return <div>로딩 중...</div>;

    return (
        <div>
            <Header prev_path="/myReserve" prev_title="예약 취소" />
            <div className="cancel">
                <p className="cancel-title">예약을 취소하시겠습니까?</p>
                <div className="cancel-box">
                    <div className="cancel-info">예약 정보</div>
                    <div className="cancel-form">
                        <div className="cancel-row">
                            <div className="cancel-label">예약일시</div>
                            <div className="cancel-input">
                                <p>
                                    {myCancel
                                        ? `${format(
                                              myCancel.start_time
                                          )} ~ ${format(myCancel.end_time)}`
                                        : ""}
                                </p>
                            </div>
                        </div>
                        <div className="cancel-row">
                            <div className="cancel-label">예약위치</div>
                            <div className="cancel-input">
                                <p>
                                    {`B${myCancel.spaces?.floor ?? ""}층  ${
                                        myCancel.spaces?.slot_number ?? ""
                                    }번`}
                                </p>
                            </div>
                        </div>
                        <div className="cancel-row">
                            <div className="cancel-label">휴대폰번호</div>
                            <div className="cancel-input">
                                <p>{userInfo.phone}</p>
                            </div>
                        </div>
                        <div className="cancel-row">
                            <div className="cancel-label">차량번호</div>
                            <div className="cancel-input">
                                <p>{userInfo.car_number}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="cancel-box">
                    <div className="reason-form">
                        <label className="reason-label">취소사유</label>
                        <select
                            className="value-box ment"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                        >
                            <option value="">선택하세요</option>
                            <option value="일정변경">일정변경</option>
                            <option value="개인사정">개인사정</option>
                            <option value="기타">기타</option>
                        </select>
                    </div>
                    <div className="reason-form">
                        <label className="reason-label">환불수단</label>
                        <select
                            className="value-box ment"
                            value={refundMethod}
                            onChange={(e) => setRefundMethod(e.target.value)}
                        >
                            <option value="">선택하세요</option>
                            <option value="신용카드">신용카드</option>
                            <option value="계좌이체">계좌이체</option>
                        </select>
                    </div>
                    <div className="reason-form">
                        <label className="reason-label">환불예정금액</label>
                        <input
                            className="value-box ment1"
                            type="text"
                            value={`${!isCancel ? "0" : 
                                myCancel.price?.toLocaleString() || "0"
                            }원`}
                            readOnly
                        />
                    </div>
                    <div className="reason-form">
                        <label className="reason-label">취소수수료</label>
                        <input
                            className="value-box ment1"
                            type="text"
                            value={cancelFee}
                            readOnly
                        />
                    </div>
                    <img
                        src={`${process.env.PUBLIC_URL}/images/cancel-logo.png`}
                        alt="취소 페이지 로고 이미지"
                        className="cancel-image"
                    />
                </div>
                <div className="button-group">
                    <button
                        onClick={handleCancel}
                        disabled={!isCancel}
                        style={{
                            opacity: isCancel ? 1 : 0.5,
                            cursor: isCancel ? "pointer" : "not-allowed",
                        }}
                    >
                        예
                    </button>
                    <button onClick={() => navigate("/myReserve")}>
                        아니요
                    </button>
                </div>
                <div className="cancel-guide">
                    <p>예약 취소 전 반드시 확인해 주세요</p>
                    <ul>
                        <li>
                            - 예약 취소는 이용 1시간 전까지 무료로 가능하며,
                            이후에는 취소 및 환불이 불가능합니다.
                        </li>
                        <li>
                            - 결제 수단 및 정기권 조건에 따라 환불 처리 기간은
                            최대 7~14일 소요될 수 있습니다.
                        </li>
                        <li>
                            - 취소 후 재예약을 원하실 경우, 다시 예약 절차를
                            진행해 주셔야 합니다.
                        </li>
                        <li>
                            - 부정 예약, 무단 변경, 허위 정보 입력 등은 예약
                            취소 및 서비스 이용 제한의 사유가 될 수 있습니다.
                        </li>
                        <li>
                            기타 문의사항은 고객센터(1234-1234)로 언제든지 연락
                            주세요.
                        </li>
                    </ul>
                </div>
            </div>
            <Navigate />
        </div>
    );
};
export default CancelGeneral;
