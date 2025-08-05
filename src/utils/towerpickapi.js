import { supabase } from "./supabaseClient";

/**
 * 1. 로그인 
 * 아이디+ 비밀번호 일치 여부를 확인
 * is_active : 탈퇴여부를 확인하는 경우 false 로 변경
 * 그렇기 때문에 로그인 할 때는 탈퇴한 사람을 제외하고 처리 되어야 함.
 */
export const fetchLogin = async (userID, userPW) => {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("member_id", userID)
    .eq("password", userPW)
    .eq("is_active", true)  // 탈퇴한 회원 제외
    .single();
  return { data,error };
};

/** 
 * 2. 회원가입
 * 가입할 때 입력항목은 다음과 같음 : 사용자 아이디, 비밀번호, 핸드폰 번호, 차량 번호
*/
export const fetchSignUp = async (userID, userPW, phone, carnum) => {
  const { error } = await supabase
    .from('members')
    .insert([{ member_id: userID, password:userPW, phone , car_number:carnum }]);
  return { data: !error, error };
};

/**
 * 3. 회원탈퇴
 * 회원이 탈퇴 버튼을 누르면 데이터가 삭제되는 것이 아니라 
 * is_active 값을 false 로 변경함
*/
export const deactivateMember = async (userID) => {
  const { error } = await supabase
    .from("members")
    .update({ is_active: false })
    .eq("member_id", userID)
    .eq("is_active", true); // 이미 탈퇴된 계정은 처리하지 않음

  return { data: !error, error };
};

/**
 * 4. 아이디 찾기
 * 휴대폰 번호를 기반으로 회원 ID를 조회   
*/
export const findMemberId = async (phone) => {
  const { data, error } = await supabase
    .from('members')
    .select('member_id')
    .eq('phone', phone)
    .eq("is_active", true)
    .single();
  return { data, error };
};

/**
 * 5. 비밀번호 찾기 
 * 아이디와 비밀번호를 입력하면 회원 ID를 조회
*/
export const findPassword = async (userID, phone) => {
  const { data, error } = await supabase
    .from("members")
    .select("password")
    .eq("member_id", userID)    
    .eq("phone", phone)          
    .eq("is_active", true)       
    .single();

  return { data, error };
};

/**
 * 6. 비밀번호 수정
 * 사용자 아이디와 새로운 비밀번호를 전달해주면
 * 비밀번호를 수정함
*/
export const updatePassword = async (userID, newPW) => {
    const { error } = await supabase
    .from("members")
    .update({ password: newPW })
    .eq("member_id", userID)
    .eq("is_active", true);

  return { data: !error, error };
};

/**
 * 7. 휴대폰번호 변경
 * 사용자 아이디와 새로운 휴대폰번호를 전달해주면
 * 휴대폰 번호를 변경함. 
*/
export const updatePhone = async (userID, newPhone) => {
  const { error } = await supabase
    .from("members")
    .update({ phone: newPhone })
    .eq("member_id", userID)
    .eq("is_active", true);

  return { data: !error, error };
};
/**
 * 이 함수는 다른 함수에서 사용하기 위해서 만든 함수로 번호를 설정하지 않음
 * 이걸 이용하여 주차공간을 is_reserved 를 true/false로 바꿈
 * spaces 테이블의 is_reserved 값을 이용하여 주차 가능 여부를 알 수 있음. 
 */
export const updateSpaceStatus = async (spaceID,status) => {
  const {error} = await supabase
    .from("spaces")
    .update({ is_reserved: status })
    .eq("id", spaceID);
  return {data:!error, error};
}

/**
 * 8. 내 정기권 내역을 알아옴.
 * 사용자 아이디를 전달해주면  정기권 정보를 알아옴.
 * id : 정기권 고유 ID
 * space_id : 연결된 주차 공간 아이디
 * dutation_type : 정기권 유형 (1m,3m,6m,12m)
 * start_date,end_date : 예약날짜
 * price : 정기권 결제 금액
 * is_paid :   true(결제완료)
 * status : 정기권 상태 (active는 사용중, expired:기간만료, canceled:취소)
 * created_at : 정기권 등록 날짜
 * spaces.floor : 연결된 층
 * spaces.slot_number : 주차공간 구획번호
*/
export const getMyPasses = async (userID) => {
  const { data, error } = await supabase
    .from("passes")
    .select(`
      id,  
      space_id,
      duration_type,
      start_date,
      end_date,
      price,
      is_paid,
      status,
      created_at,
      spaces (
        floor,
        slot_number
      )
    `)
    .eq("member_id", userID)  //사용자 아이디별
    .order("status", { ascending: false })        // active가 위에 오도록
    .order("created_at", { ascending: false });   // 최신순 정렬

  return { data, error };
};

/*
 *  9. 정기권 예약 취소
 *  취소할 정기권 ID와 공간 ID를 전송하면 취소가 됨.
 *   status:canceled로 변경, is_paid(결제여부)도 변경
 * 취소를 하면 공간은 다시 예약이 가능해야 하기 때문에 2) 수행  
*/
export const cancelPass = async (passId, spaceId) => {
  // 1) passes 테이블의 status만 취소 처리
  const { error: cancelError } = await supabase
    .from("passes")
    .update({ status: "canceled", is_paid: false })
    .eq("id", passId)
    .eq("status", "active");
  if (cancelError) {
    return { data: null, error: cancelError };
  }
  // 2) 해당 공간 상태 업데이트
  const { error: spaceUpdateError } = await updateSpaceStatus(spaceId, false);
  return { data: !spaceUpdateError, error: spaceUpdateError };
};  

/**
 * 10. 내 정기권 예약하기
 * 예약 시 결제를 무조건 하도록 하기 때문에 결제 완료상료 등록
 *  userID : 사용자 ID
 *  spaceID : 주차공간 ID
 *  durationType : 1m,3m,6m,12m 으로 전달( 이값으로 결제금액 만들게 됨)
 * startDate,endDate :  예약 시간 전달
 * 예약이 되면 주차공간을 업
*/
export const insertPass = async (userID, spaceID, durationType, startDate, endDate) => {
  //가격처리
  const priceMap = {
    '1m' : 200000,
    '3m' : 600000,
    '6m' : 1100000,
    '12m' : 2000000
  }
  const price = priceMap[durationType];
  if(price === undefined ) {
    return {data:null, error: new Error("유효하지 않은 정기권 종류입니다")};
  }
  // 1) passes 테이블에 데이터 삽입
  const { data, error } = await supabase
    .from("passes")
    .insert([{
      member_id: userID,
      space_id: spaceID,
      duration_type: durationType,   // '1m', '3m', '6m', '12m'
      start_date: startDate,
      end_date: endDate,
      price: price,
      is_paid: true,                 // 결제 완료 처리
      status: "active"
    }]);
  if (error) return { data: null, error };

  // 2) spaces 테이블 상태값 업데이트 (예약됨)
  const updateResult = await updateSpaceStatus(spaceID, true);
  return { data, error: updateResult.error };
};


/**
 * 11. 내 사전 예약 정보 조회 
 * 사용자 ID를 전달하면 예약 정보를 조회할 수 있음.
 *  id : 사전예약 고유 ID
 *  space_id : 예약된 주차 공간의  ID
 *  start_time, end_time : 주차 예정 시간
 *  price : 주차요금
 *  is_paid :결제여부 무조건 true 값임
 *  status : 예약상태( active : 예약중, expired : 예약시간 종료, canceled: 예약 취소)
 *  created_at : 예약 생성 날짜
 *  spaced.floor : 주차공간 층수
 *  space.slot_number : 주차 공간 번호
 * */
export const getMyBookings = async (userID) => {
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      id,
      space_id,
      start_time,
      end_time,
      price,
      is_paid,
      status,
      created_at,
      spaces (
        floor,
        slot_number
      )
    `)
    .eq("member_id", userID)  //아이디별 사용
    .order("start_time", { ascending: false });  //최신순 정렬

  return { data, error };
};

/**
 * 12. 내 사전 예약 정보 취소 
 * 취소시에는 사전예약 ID, 그리고 공간 정보를 전달하면 취소가 가능함.
 * 마찬가지로 공간상태를 복원하는 처리를 해줌
 * */
export const cancelBooking = async (bookingId, spaceId) => {
  // 1) 예약 취소 처리
  const { error: cancelError } = await supabase
    .from("bookings")
    .update({ status: "canceled", is_paid: false })
    .eq("id", bookingId)
    .eq("status", "active");
  if (cancelError) {
    return { data: null, error: cancelError };
  }
  // 2) 해당 공간 상태 복원 처리
  const { error: updateError } = await supabase
    .from("spaces")
    .update({ is_reserved: false })
    .eq("id", spaceId);
  return { data: !updateError, error: updateError };
};

/**
 * 13. 내 사전예약하기
 * 예약시 결제는 완료상태로 변경함
 * 예약시에는 입력해야 하는 정보는
 * userID : 사용자 정보
 * spaceID : 공간정보
 * startTime, endTime : 예약시간
 * price : 가격은 계산해서 적용 
 */
export const insertBooking = async (userID, spaceID, startTime, endTime, price) => {
  // 1) bookings 테이블에 삽입
  const { data, error } = await supabase
    .from("bookings")
    .insert([{
      member_id: userID,
      space_id: spaceID,
      start_time: startTime,
      end_time: endTime,
      price: price,
      is_paid: true,       // 결제 완료로 설정
      status: "active"
    }]);

  if (error) return { data: null, error };

  // 2) 해당 공간 예약 상태로 업데이트
  const updateResult = await updateSpaceStatus(spaceID, true);
  return { data, error: updateResult.error };
};

/**
 * 14. 층 별 잔여석 수를 가져올 수 있음. 
 * 처음 시작시 실행시키면 층간 잔여석 정보를 알아 올 수 있음.
 * 전달해 주는 값 
 * [
 *  { floor:1, available: 20},
 *  { floor:2, available: 20},
 *  { floor:3, available: 20}
 * ]
 */
export const getAvailableSpacesByFloor = async () => {
  // 1. is_reserved = false && is_active = true 조건으로 전체 공간 조회
  const { data, error } = await supabase
    .from("spaces")
    .select("floor")
    .eq("is_reserved", false)
    .eq("is_active", true);

  if (error) return { data: null, error };

  // 2. 층별로 그룹화하여 개수 세기
  const result = {};
  data.forEach(({ floor }) => {
    result[floor] = (result[floor] || 0) + 1;
  });

  // 3. 배열 형태로 변환해서 반환 (정렬 포함)
  const grouped = Object.entries(result)
    .map(([floor, count]) => ({
      floor: parseInt(floor),
      available: count
    }))
    .sort((a, b) => a.floor - b.floor);

  return { data: grouped, error: null };
};

/**
 * 15.  층별 주차공간 맵 구현
 * 층 별 주차공감을 확인할 수 있음
 * is_reserved 가 true 일 경우가 예약이 된 상태이기 때문에
 * 체크하고 예약이 안되게 해야 함.
 * is_active : 값은 고장이나 사용불가일 경우 true값이 되기 때문에
 * is_active 값이 false 인 경우만 예약이 되게 해야 함
 * 
 * 결론) 예약가능한 주차공간은
 * is_reserved=false, is_active=true 인 상태임
 */
export const getSpacesByFloor = async (floor) => {
  const { data, error } = await supabase
    .from("spaces")
    .select("id, slot_number, space_type, is_reserved, is_active")
    .eq("floor", floor)
    .order("slot_number", { ascending: true });

  return { data, error };
};