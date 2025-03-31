import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactSelect from "react-dropdown-select"; // ReactSelect 임포트
import DefaultLayout from "../layouts/DefaultLayout";
import "../css/joinPage.css";

const JoinPage = () => {
  const API_USER_URL = `http://localhost:8088/api/users`;

  const [allUserData, setAllUserData] = useState([]);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [passwordColor, setPasswordColor] = useState("black"); // 기본 색상은 black
  const navigate = useNavigate();

  const onBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

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
    const usernameRegex = /^[a-zA-Z0-9]{6,20}$/; // 6~20자의 영문, 숫자만 허용
    if (!usernameRegex.test(formData.userId)) {
      alert("아이디는 영문, 숫자 조합으로 6~20자여야 합니다.");
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

    if (passwordRegex.test(password)) {
      // 비밀번호가 영문, 숫자, 특수문자를 포함한 경우 강도 평가
      if (password.length >= 16) {
        setPasswordStrength("보안성 : 높음");
        setPasswordColor("blue");
      } else if (password.length >= 12) {
        setPasswordStrength("보안성 : 보통");
        setPasswordColor("green");
      } else if (password.length >= 8) {
        setPasswordStrength("보안성 : 낮음");
        setPasswordColor("red");
      }
    } else {
      setPasswordStrength(
        "비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상이어야 합니다."
      );
      setPasswordColor("black"); // 기본 색상
    }

    // 비밀번호 확인과 즉시 비교
    setPasswordMatch(password === formData.confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;

    // 비밀번호 확인 필드에서 입력되는 값 그대로 처리하도록 개선
    setFormData((prevState) => ({
      ...prevState,
      confirmPassword,
    }));

    // 입력된 값과 즉시 비교 (formData.password 대신 직접 참조)
    setPasswordMatch(confirmPassword === formData.password);
  };

  useEffect(() => {
    if (formData.password === "" || formData.confirmPassword === "") {
      setPasswordMatch(null);
    } else {
      setPasswordMatch(formData.password === formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // 생년월일 체크
    const { birthYear, birthMonth, birthDay } = formData;
    const isPartiallyFilled =
      (birthYear && !birthMonth) ||
      (birthYear && !birthDay) ||
      (birthMonth && !birthYear) ||
      (birthMonth && !birthDay) ||
      (birthDay && !birthYear) ||
      (birthDay && !birthMonth);

    // 생년월일을 YYYY-MM-DD 형식으로 변환
    const birth =
      birthYear && birthMonth && birthDay
        ? `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(
            birthDay
          ).padStart(2, "0")}`
        : null;

    // 전송할 데이터 필터링
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
    };

    // 회원가입 유효성 검사
    if (!formData.name) {
      alert("이름을 입력하세요.");
      return;
    }

    if (!formData.nickname) {
      alert("닉네임을 입력하세요.");
      return;
    }

    if (!formData.userId) {
      alert("아이디를 입력하세요.");
      return;
    }

    if (!formData.password) {
      alert("비밀번호를 입력하세요.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 필수 값인 이름, 닉네임, 아이디, 비밀번호는 존재 여부만 체크
    if (
      !formData.name ||
      !formData.nickname ||
      !formData.userId ||
      !formData.password
    ) {
      alert("모든 필수 항목을 입력하세요.");
      return;
    }

    // 전화번호 입력이 있으면 형식 체크
    if (formData.phoneNumber && !/^\d{10,11}$/.test(formData.phoneNumber)) {
      alert("전화번호는 10~11자리 숫자만 입력해야 합니다.");
      return;
    }

    // 이메일 입력이 있으면 형식 체크
    if (
      formData.email &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      alert("올바른 이메일 형식을 입력하세요.");
      return;
    }

    // 생년월일 입력이 있으면 형식 체크
    if (isPartiallyFilled) {
      alert(
        "생년월일을 모두 선택해주세요."
      );
      return;
    }

    // 주소 입력이 있으면 형식 체크
    if (formData.address && formData.address.length < 5) {
      alert("주소는 최소 5자 이상 입력해야 합니다.");
      return;
    }

    // 아이디 중복 확인이 되어 있는지 체크
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
    <DefaultLayout
      headerProps={{
        showBack: true,
        title: "회원가입",
        showIcons: { search: true },
      }}
    >
      <div className="join-container">
        <h2>회원가입</h2>
        <form className="join-form" onSubmit={handleSignup}>
          <label>
            이름 <span class="join-form-required">*</span>
          </label>
          <input
            type="text"
            name="name"
            className="form-input"
            placeholder="이름을 입력하세요"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <label>
            닉네임 <span class="join-form-required">*</span>
          </label>
          <input
            type="text"
            name="nickname"
            className="form-input"
            placeholder="2~10자 문자, 숫자 조합으로 입력하세요"
            value={formData.nickname}
            onChange={(e) =>
              setFormData({ ...formData, nickname: e.target.value })
            }
            required
          />
          <label>
            아이디 <span class="join-form-required">*</span>
          </label>
          <div className="id-check-wrapper">
            <input
              type="text"
              name="userId"
              className="form-input"
              placeholder="6~20자 영문, 숫자 조합으로 입력하세요"
              value={formData.userId}
              onChange={(e) =>
                setFormData({ ...formData, userId: e.target.value })
              }
              required
            />
            <button
              type="button"
              onClick={checkUserIdAvailability}
              className="id-check-button"
            >
              중복 확인
            </button>
          </div>
          {isUsernameAvailable !== null && (
            <span>{isUsernameAvailable ? "사용 가능" : "사용 불가"}</span>
          )}
          <label>
            비밀번호 <span class="join-form-required">*</span>
          </label>
          <input
            type="password"
            className="form-input"
            placeholder="8~20자 영문, 숫자, 특수문자 조합으로 입력하세요"
            value={formData.password}
            onChange={handlePasswordChange}
            autoComplete="off"
            required
          />
          {passwordStrength && (
            <span style={{ color: passwordColor }}>{passwordStrength}</span>
          )}
          <label>
            비밀번호 확인 <span class="join-form-required">*</span>
          </label>
          <input
            type="password"
            className="form-input"
            placeholder="비밀번호를 한 번 더 입력하세요"
            value={formData.confirmPassword}
            onChange={handleConfirmPasswordChange}
            autoComplete="off"
            required
          />
          {passwordMatch !== null && (
            <span style={{ color: passwordMatch ? "green" : "red" }}>
              {passwordMatch ? "비밀번호 일치" : "비밀번호 불일치"}
            </span>
          )}
          <label>생년월일</label>
          <div className="birth-select">
            <ReactSelect
              options={years.map((year) => ({ label: year, value: year }))}
              value={{ label: formData.birthYear, value: formData.birthYear }}
              onChange={(selected) =>
                handleDateChange("birthYear", selected[0]?.value)
              }
              style={{ width: "80px", height: "40px", fontSize: "16px" }}
              placeholder="년"
            />
            <ReactSelect
              options={months.map((month) => ({ label: month, value: month }))}
              value={{ label: formData.birthMonth, value: formData.birthMonth }}
              onChange={(selected) =>
                handleDateChange("birthMonth", selected[0]?.value)
              }
              style={{ width: "55px", height: "40px", fontSize: "16px" }}
              placeholder="월"
            />
            <ReactSelect
              options={days.map((day) => ({ label: day, value: day }))}
              value={{ label: formData.birthDay, value: formData.birthDay }}
              onChange={(selected) =>
                handleDateChange("birthDay", selected[0]?.value)
              }
              style={{ width: "55px", height: "40px", fontSize: "16px" }}
              placeholder="일"
            />
          </div>
          <label>전화번호</label>
          <input
            type="text"
            className="form-input"
            placeholder="-를 제외한 숫자만 입력하세요"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
          />
          <label>이메일</label>
          <input
            type="email"
            className="form-input"
            placeholder="이메일을 입력하세요"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <label>주소</label>
          <input
            type="text"
            className="form-input"
            placeholder="주소를 입력하세요"
            value={formData.address}
            onClick={handleAddressClick} // 클릭 시 주소 검색 실행
            readOnly // 직접 입력 방지
          />
          <button
            type="submit"
            className="join-submit-button"
            data-text="가입하기"
          >
            <span>가입하기</span>
          </button>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default JoinPage;
