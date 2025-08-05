import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

const AgreePage = () => {
  const [agreeAll, setAgreeAll] = useState(false);
  const [age, setAge] = useState(false);
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [event, setEvent] = useState(false);
  const [errorMsn, setErrorMsn] = useState('');
  const [showTermsDetail, setShowTermsDetail] = useState(false);
  const [showPrivacyDetail, setShowPrivacyDetail] = useState(false);
  const navigate = useNavigate('');

  useEffect(() => {
    const allAgreed = terms && age && privacy && event;
    setAgreeAll(allAgreed);
  }, [terms, age, privacy, event]); 

  useEffect(() => {
    if (age && terms && privacy) {
      setErrorMsn('');
    }
  }, [age, terms, privacy]);

  // 약관 전체 동의 체크박스 변경 핸들러
  const handleAllChange = (e) => {
    const isChecked = e.target.checked;
    setAgreeAll(isChecked);
    setTerms(isChecked);
    setAge(isChecked);
    setPrivacy(isChecked);
    setEvent(isChecked);
    setShowTermsDetail(false);
    setShowPrivacyDetail(false);
  };

  // 개별 약관 체크박스 변경 핸들러, 체크박스 클릭시 토글이 펼쳐져 있다면 접힘
  const handledChange = (setter, e) => {
    setter(e.target.checked); 
    if (setter === setTerms) {
      setShowTermsDetail(false);
    } else if (setter === setPrivacy) {
      setShowPrivacyDetail(false);
    }
  };

  // 약관 상세 내용 토글 핸들러
  const toggleTermsDetail = () => {
    setShowTermsDetail(prev => !prev);
  };

  // 개인정보 상세 내용 토글 핸들러
  const togglePrivacyDetail = () => {
    setShowPrivacyDetail(prev => !prev);
  };

  // 모든 필수 약관 동의 검사 (가입 버튼 활성화 등)
  const isFormValid = terms && age && privacy;

  const handleNextStep = () => {
  if (isFormValid) {
    // 모든 필수 항목이 체크되었다면 다음 단계로 이동
    navigate("/joinpage");
  } else {
    // 필수 항목이 체크되지 않았다면 에러 메시지 설정
    setErrorMsn("*필수 항목을 모두 체크해주세요");
  }
};


  return (
    <div className="agree-page">
      <div className="agree-title">
        <h1>약관동의</h1>
        <h3>
          원활한 서비스 제공을 위해
          <br />
          약관 동의가 필요합니다.
        </h3>
      </div>
      <div className="terms-list">
        <div className="agree-all">
          <input
            type="checkbox"
            id="agree"
            checked={agreeAll}
            onChange={handleAllChange}
          />
          <label htmlFor="agree">약관 전체 동의</label>
        </div>
        <hr />
        <ul>
          <li>
            <div className="etc-wrap">
              <input
                type="checkbox"
                id="age"
                checked={age}
                onChange={(e) => handledChange(setAge, e)}
              />
              <label htmlFor="age">19세 이상입니다(필수)</label>
            </div>
          </li>
          <li className="agree-detail">
            <div className="agree-main">
              <input
                type="checkbox"
                id="terms"
                checked={terms}
                onChange={(e) => handledChange(setTerms, e)}
              />
              <label htmlFor="terms">이용 약관 동의(필수)</label>
              <FaChevronDown
                className={showTermsDetail ? 'rotated-icon' : 'chevron-icon'}
                onClick={toggleTermsDetail}
              />
            </div>
            {showTermsDetail && (
              <div className="agree-detail-txt">
                <p>⑴ 본 약관은 서비스 이용에 필요한 제반 사항을 명확히 합니다.</p>
                <p>⑵ 서비스를 사용하기 위해서는 약관에 동의하셔야 합니다.</p>
                <p>⑶ 미동의 시 서비스 이용에 제한이 있을 수 있습니다.</p>
              </div>
            )}
          </li>
          <li className="agree-detail">
            <div className="agree-main">
              <input
                type="checkbox"
                id="privacy"
                checked={privacy}
                onChange={(e) => handledChange(setPrivacy, e)}
              />
              <label htmlFor="privacy">개인정보 수집 및 이용 동의(필수)</label>
              <FaChevronDown
                className={showPrivacyDetail ? 'rotated-icon' : 'chevron-icon'}
                onClick={togglePrivacyDetail}
              />
            </div>
            {showPrivacyDetail && (
              <div className="agree-detail-txt">
                <p>⑴ 개인정보는 서비스 제공을 위해서만 수집 및 이용됩니다.</p>
                <p>⑵ 수집된 정보는 법령에 따라 안전하게 보호됩니다.</p>
                <p>⑶ 회원 탈퇴 시 즉시 파기됩니다.</p>
              </div>
            )}
          </li>
          <li>
            <div className="etc-wrap">
              <input
                type="checkbox"
                id="event"
                checked={event}
                onChange={(e) => handledChange(setEvent, e)}
              />
              <label htmlFor="event">할인, 이벤트 정보 수신(선택)</label>
            </div>
          </li>
        </ul>
      </div>
      <div className="next-btn">
        <button
          onClick={handleNextStep}
          className={isFormValid ? "" : "next-step-btn"}
          >다음단계
        </button>
        {
        errorMsn &&
        <p className="error-msn">{errorMsn}</p>}
      </div>
    </div>
  );
};

export default AgreePage;
