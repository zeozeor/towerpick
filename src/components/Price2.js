const Price2 = ({ price }) => (
    <div className="status">
        <p className="label">결제금액</p>
        <div className="price">
            <span className="ment1" style={{ color: "red" }}>
                {price ? price.toLocaleString() + "원" : ""}
            </span>
        </div>
    </div>
);
export default Price2;
