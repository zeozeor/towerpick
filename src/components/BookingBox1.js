

// getNowLocalDatetime  
const getNowLocalDatetime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hour}:${min}`;
};

const BookingBox1 = ({ start, end, onDateChange }) => {
    const minDate = getNowLocalDatetime();

    return (
        <div className="booking-box">
            <div className="booking-title">주차장 예약</div>
            <div className="booking-form">
                <div className="form-row">
                    <div className="form-label">입차일시</div>
                    <div className="form-input">
                        <input
                            type="datetime-local"
                            className="date"
                            value={start}
                            min={minDate}
                            onChange={(e) => onDateChange(e.target.value, end)}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-label">출차일시</div>
                    <div className="form-input">
                        <input
                            type="datetime-local"
                            className="date"
                            value={end}
                            min={minDate}
                            onChange={(e) => onDateChange(start, e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingBox1;
