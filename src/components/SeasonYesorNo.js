const SeasonYesorNo = ({ available }) => (
    <div className="status">
        <p className="label">구매가능 여부</p>
        <div className="or">
            {available === null ? (
                ""
            ) : available ? (
                <span className="ment">가능</span>
            ) : (
                <span className="ment" style={{ color: "red" }}>
                    불가능
                </span>
            )}
        </div>
    </div>
);

export default SeasonYesorNo;
