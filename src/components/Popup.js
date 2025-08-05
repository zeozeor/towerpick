import React from 'react';

const Popup = ({show, message, onConfirm, onCancel}) => {
  if (!show) {
    return null;
  }
  
  // message 문자열의 '-n'을 <br /> 태그로 변환
  const formatMessage = (text) => {
    return text.split('-n').map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {/* 마지막 줄이 아니면 <br /> 추가 */}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="pop-up">
      <div className="pop-content">
        <p>{formatMessage(message)}</p>
        <div className="pop-btns">
          <button onClick={onConfirm} className="yes-btn">예</button>
          <button onClick={onCancel} className="no-btn">아니오</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
