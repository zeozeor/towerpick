const ParkingImg = () => {
    const images = [
        "/images/parkingmap/parkingmap1.jpg",
        "/images/parkingmap/parkingmap2.jpg",
    ];
    return (
        <div className="parking-img">
            {images.map((path, index) => {
                return (
                    <img
                        key={index}
                        src={`${process.env.PUBLIC_URL}${path}`}
                        alt={`주차 평면도 ${index + 1}`}
                    />
                );
            })}
        </div>
    );
};

export default ParkingImg;
