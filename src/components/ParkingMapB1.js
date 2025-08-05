const top = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
const bottom = [21,22,23,24,25,26,27,28,29,30];

const colorCls = n =>
  [1,2,3,4].includes(n) ? "pink" :
  [5,6,11,21].includes(n) ? "yellow" :
  [7,8,9,10].includes(n) ? "blue" : "";

const slotCls = (n, reserved, selected) => [
  `slot n${n}`,
  reserved.map(Number).includes(Number(n)) ? "reserved" : "",
  Number(selected) === Number(n) ? "selected" : "",
  colorCls(n)
].join(" ").trim();

const ParkingMapB1 = ({
  reserved = [],
  selected = null,
  onSelectSlot = () => {},
}) => {

  return (
    <div className="parking-map">
      <div className="top-grid">
        {top.map(n => (
          <div
            key={n}
            className={slotCls(n, reserved, selected)}
            onClick={() => !reserved.map(Number).includes(Number(n)) && onSelectSlot(n)}
          >
            {n}
          </div>
        ))}
      </div>
      <div className="inout">
        <p className="in">IN</p>
        <p className="out">OUT</p>
      </div>
      <div className="bottom-grid">
        {bottom.map(n => (
          <div
            key={n}
            className={slotCls(n, reserved, selected)}
            onClick={() => !reserved.map(Number).includes(Number(n)) && onSelectSlot(n)}
          >
            {n}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingMapB1;
