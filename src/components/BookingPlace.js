const BookingPlace = ({ selectedSlot, floor }) => (
    <div className="status">
        <p className="label">선택자리</p>
        <div className="place">
            {selectedSlot ? (
                <p>
                    B{floor}층 {selectedSlot}번
                </p>
            ) : (
                <p>원하는 주차자리를 선택하세요</p>
            )}
        </div>
    </div>
);

export default BookingPlace;
