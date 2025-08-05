import { useEffect, useState } from "react";
import { getMyBookings } from "../utils/towerpickapi";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Navigate from "./Navigate";

const MyReserve = ({onCancel}) => {
  const [myReserve,setMyReserve] = useState([]);
  const [user,setUser] = useState([]);
  const navigate = useNavigate('');

  const activebooking = myReserve.filter(item => item.status === 'active');
  const notactivebooking = myReserve.filter(item => item.status !== 'active');

  // 예약 정보 가져옴
  useEffect(()=>{
    const bookingUser = JSON.parse(localStorage.getItem("towerpick"));
    setUser(bookingUser);
    const fetchData = async ()=>{
      const {data,error} = await getMyBookings(bookingUser.member_id);
      if( error ){
        alert("내 예약 정보 가져오기 실패!");
        return;
      }
      if( data ){
        setMyReserve(data);
      }
    }
    fetchData();
  },[]);

  // 예약 글자를 한글로 변환
  const getStatusText = (item)=>{
    let value = '';
    if( item === "active"){
      value = "예약중";
    } else if( item === "canceled") {
      value = "사용취소";
    } else if( item === "expired") {
      value = "사용종료";
    }
    return value;
  }

// 🍺 날자 문자열 변환
  // 헬퍼 함수
  // 날짜와 시간이 포함된 전체 문자열
  const formatDateTime = (fullDateTimeString) => {
    const dateTime = new Date(fullDateTimeString);

    // 유효한 Date 객체인지 확인
    if (isNaN(dateTime.getTime())) {
      return "날짜/시간 오류";
    }

    // 년, 월, 일, 시, 분 추출 -> 원하는 형태로 변환
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, '0');
    const day = String(dateTime.getDate()).padStart(2, '0');
    const hours = String(dateTime.getHours()).padStart(2, '0');
    const minutes = String(dateTime.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

// 🍺 예약 목록을 렌더링하는 도우미 함수
  //현재 예약
  const nowBooking = (myReserve) => {
    if (myReserve.length === 0) {
        return (
          <>
          <div className="not-booking">
            <p className="none-booking-msn">현재 예약내역이 없습니다.</p>
            <button
              onClick={() => {
              navigate("/booking1");
              }}
              >
              주차 예약하러 가기
              </button>
          </div>
          </>
        );
    }
    return (
      <ul>
        {
          myReserve.map((item) => {
            return (
              <li key={item.id} className="now-listWrap">
                <p className="now-status">{getStatusText(item.status)}</p>
                <p className="now-date">
                  {formatDateTime(item.start_time)}<br /> ~ 
                  {formatDateTime(item.end_time)} </p>
                <p className="now-space">
                  B{`${item.spaces.floor}층 - ${item.spaces.slot_number}번`}</p>
                <p className="now-status-r">{getStatusText(item.status)}</p>
                {
                  item.status === 'active' ? (
                  <button
                    className="nowCancle-btn"
                    onClick={()=>{
                      onCancel(item);
                      navigate("/cancelgeneral")
                  }}
                  >예약취소</button>) : ""
                }
              </li>
            );
          })
        }
      </ul>
    );
  };


  // 🍺 과거 이력 (종료된 예약)
  const endBooking = (myReserve) => {
    if (myReserve.length === 0) {
      return (
        <div className="not-booking">
          <p className="not-booking-msn">과거 이력이 없습니다.</p>
        </div>
      );
    }
    return (
          <ul>
            {
              myReserve.map((item) => {
                return (
                  <li key={item.id} className="end-listWrap">
                    <p className="end-workend">처리완료</p>
                    <p className="end-date">
                      {formatDateTime(item.start_time)}<br /> ~ 
                      {formatDateTime(item.end_time)} </p>
                    <p className="end-space">
                      B{`${item.spaces.floor}층 - ${item.spaces.slot_number}번`
                      }</p>
                    <p className="end-status">{getStatusText(item.status)}</p>
                  </li>
                );
              })
            }
          </ul>
    );
  };

  return (
    <div className="reserve-wrap">
      <Header prev_path="/mainpage" prev_title="내 이용내역" />
      {/* <div className="my-reserve" style={{height:myReserve.length>1 ? "auto":"100%"}}> */}
      <div className="my-reserve">
        <div className="now-list">
          <div className="now-txt">
            <h3>현재 예약</h3>
          </div>
          <div className="now-reserve">
            {nowBooking(activebooking)}
          </div>
        </div>
        <div className="end-list">
          <div className="end-txt">
            <h3>과거 이력</h3>
          </div>
          <div className="end-reserve">
            {endBooking(notactivebooking)}
          </div>
        </div>
      </div>
      <Navigate />
    </div>
  );
};

export default MyReserve;