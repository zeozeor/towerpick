const getTodayDateStr = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const SeasonBox1 = ({
    start,
    end,
    onDateChange,
    type,
    setType,
    floor,
    setFloor,
}) => {
    const minDate = getTodayDateStr();

    return (
        <div className="booking-box">
            <div className="booking-title">주차장 예약</div>
            <div className="booking-form">
                <div className="form-row">
                    <div className="form-label">입차일시</div>
                    <div className="form-input">
                        <input
                            type="date"
                            className="date"
                            value={start}
                            min={minDate}
                            onChange={(e) => onDateChange(e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-label">사용기간</div>
                    <div className="season-select">
                        <button
                            className={`period-btn 1month${type === "1m" ? " selected" : ""}`}
                            type="button"
                            onClick={() => setType("1m")}
                        >
                            1개월
                        </button>
                        <button
                            className={`period-btn 3month${type === "3m" ? " selected" : ""}`}
                            type="button"
                            onClick={() => setType("3m")}
                        >
                            3개월
                        </button>
                        <button
                            className={`period-btn 6month${type === "6m" ? " selected" : ""}`}
                            type="button"
                            onClick={() => setType("6m")}
                        >
                            6개월
                        </button>
                        <button
                            className={`period-btn 12month${type === "12m" ? " selected" : ""}`}
                            type="button"
                            onClick={() => setType("12m")}
                        >
                            1년
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeasonBox1;
