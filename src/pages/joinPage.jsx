import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const JoinPage = () => {
  const API_USER_URL = `http://localhost:8088/api/users`;

  const [allUserData, setAllUserData] = useState([]);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(null);
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => 1900 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    userId: "",
    password: "",
    confirmPassword: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    phoneNumber: "",
    email: "",
    address: "",
    updateDate: new Date().toISOString(), // 현재 날짜로 초기화
  });

  // 뒤로가기 버튼
  const onBack = () => {
    navigate("/");
  };

  useEffect(() => {
    // 회원 정보 불러오기
    fetch(API_USER_URL)
      .then((response) => response.json())
      .then((data) => {
        setAllUserData(data);
      })
      .catch((error) => console.error("회원 정보 불러오기 오류", error));
  }, []);

  const checkUserIdAvailability = async () => {
    const usernameRegex = /^[a-zA-Z0-9]{6,}$/;
    if (!usernameRegex.test(formData.userId)) {
      alert("아이디는 영문, 숫자 조합, 6자 이상이어야 합니다.");
      return;
    }

    const requestUrl = `http://localhost:8088/api/users/check-user-id?userId=${formData.userId}`;
    console.log("아이디 중복 확인 요청 URL:", requestUrl);

    try {
      const response = await fetch(requestUrl);

      if (!response.ok) {
        throw new Error(
          `서버 응답 오류: ${response.statusText} (상태 코드: ${response.status})`
        );
      }

      const isTaken = await response.json();
      setIsUsernameAvailable(isTaken);

      if (isTaken) {
        alert("사용 가능한 아이디입니다.");
      } else {
        alert("이미 사용 중인 아이디입니다.");
      }
    } catch (error) {
      console.error("아이디 중복 확인 오류:", error);
      alert(`아이디 중복 확인 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;

    setFormData((prevState) => ({
      ...prevState,
      password,
    }));

    // 비밀번호 강도 체크
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    setPasswordStrength(
      passwordRegex.test(password)
        ? "보안성 : 강함"
        : "비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상이어야 합니다."
    );

    // 비밀번호 확인과 즉시 비교
    setPasswordMatch(password === formData.confirmPassword);
  };

  useEffect(() => {
    if (formData.password === "" || formData.confirmPassword === "") {
      setPasswordMatch(null);
    } else {
      setPasswordMatch(formData.password === formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;

    // 기존 formData 업데이트
    setFormData((prevState) => ({
      ...prevState,
      confirmPassword,
    }));

    // 입력된 값과 즉시 비교 (formData.password 대신 직접 참조)
    setPasswordMatch(confirmPassword === formData.password);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // 생년월일을 'yyyy-MM-dd' 형식으로 포맷
    const birth = `${formData.birthYear}-${String(formData.birthMonth).padStart(
      2,
      "0"
    )}-${String(formData.birthDay).padStart(2, "0")}`;

    // formDataToSendWithBirth를 정의
    const {
      confirmPassword,
      userId,
      phoneNumber,
      updateDate,
      ...formDataToSend
    } = formData;
    const formDataToSendWithBirth = {
      ...formDataToSend,
      birth,
      user_id: userId,
      phone_number: phoneNumber,
      update_date: updateDate,
    }; // 오늘 날짜 추가

    // 회원가입 유효성 검사
    if (!formData.name) {
      alert("이름을 입력하세요.");
      return;
    }
    if (!formData.nickname) {
      alert("닉네임을 입력하세요.");
      return;
    }
    if (!formData.phoneNumber || !/^\d{10,11}$/.test(formData.phoneNumber)) {
      alert("전화번호는 10~11자리 숫자만 입력해야 합니다.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (
      !formData.email ||
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      alert("올바른 이메일 형식을 입력하세요.");
      return;
    }
    if (isUsernameAvailable === false) {
      alert("아이디 중복 확인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(API_USER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSendWithBirth),
      });

      if (response.ok) {
        alert("회원가입 성공! 로그인 페이지로 이동합니다.");
        navigate("/login");
      } else {
        const errorMessage = await response.text();
        alert(`회원가입 실패: ${errorMessage}`);
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert(`회원가입 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  // 회원가입시 : 주소 입력칸 누르면 -> 주소api 불러오기기
  const handleAddressClick = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        let fullAddress = data.roadAddress; // 도로명 주소
        if (data.jibunAddress) {
          fullAddress += ` (${data.jibunAddress})`; // 지번 주소 추가
        }

        setFormData((prevState) => ({
          ...prevState,
          address: fullAddress,
        }));
      },
    }).open();
  };

  return (
    <div className="join-container">
      <button onClick={onBack} className="join-back-button">
        {/* <MdOutlineBackspace /> */}뒤로가기
      </button>
      <h2 className="join-h2">회원가입</h2>
      <form className="join-form" onSubmit={handleSignup}>
        <label>이름:</label>
        <input
          type="text"
          name="name"
          placeholder="이름"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <label>닉네임:</label>
        <input
          type="text"
          name="nickname"
          placeholder="2~10자 특수문자 제외"
          value={formData.nickname}
          onChange={(e) =>
            setFormData({ ...formData, nickname: e.target.value })
          }
        />
        <label>아이디:</label>
        <input
          type="text"
          name="userId"
          placeholder="2~10자 특수문자 제외"
          value={formData.userId}
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
        />
        <button type="button" onClick={checkUserIdAvailability}>
          중복 확인
        </button>
        {isUsernameAvailable !== null && (
          <span>{isUsernameAvailable ? "사용 가능" : "사용 불가"}</span>
        )}
        <label>비밀번호:</label>
        <input
          type="password"
          placeholder="8~20자 영문, 숫자, 특수문자 조합"
          value={formData.password}
          onChange={handlePasswordChange}
          autoComplete="off"
        />
        <span>{passwordStrength}</span>
        <label>비밀번호 확인:</label>
        <input
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          value={formData.confirmPassword}
          onChange={handleConfirmPasswordChange}
          autoComplete="off"
        />
        {passwordMatch !== null && (
          <span style={{ color: passwordMatch ? "green" : "red" }}>
            {passwordMatch ? "비밀번호 일치" : "비밀번호 불일치"}
          </span>
        )}
        <label>생년월일:</label>
        <div className="birth-select">
          <select
            name="birthYear"
            value={formData.birthYear}
            onChange={handleDateChange}
          >
            <option value="">년</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            name="birthMonth"
            value={formData.birthMonth}
            onChange={handleDateChange}
          >
            <option value="">월</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <select
            name="birthDay"
            value={formData.birthDay}
            onChange={handleDateChange}
          >
            <option value="">일</option>
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
        <label>전화번호:</label>
        <input
          type="text"
          placeholder="전화번호"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
        />
        <label>이메일:</label>
        <input
          type="email"
          placeholder="이메일"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <label>주소:</label>
        <input
          type="text"
          placeholder="주소 검색"
          value={formData.address}
          onClick={handleAddressClick} // 클릭 시 주소 검색 실행
          readOnly // 직접 입력 방지
        />
        <button type="submit" className="join-submit-button">
          가입하기
        </button>
      </form>
    </div>
  );
};

export default JoinPage;
