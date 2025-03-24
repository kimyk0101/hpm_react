import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { MdOutlineBackspace } from "react-icons/md"; // 뒤로가기

const JoinPage = () => {
  const API_USER_URL = `http://localhost:8088/api/users`;

  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    userId: "",
    password: "",
    confirmPassword: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    phone_number: "",
    email: "",
    address: "",
    // upd_date: new Date().toISOString(),
  });

  const [allUserData, setAllUserData] = useState([]);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(null);
  const navigate = useNavigate();

  // 뒤로가기 버튼
  const onBack = () => {
    navigate("/");
  };

  useEffect(() => {
    // 회원 정보 불러오기
    fetch(API_USER_URL)
      .then((response) => response.json())
      .then((data) => setAllUserData(data))
      .catch((error) => console.error("회원 정보 불러오기 오류", error));
  }, []);

  const checkUserIdAvailability = async () => {
    const usernameRegex = /^[a-zA-Z0-9]{6,}$/;
    if (!usernameRegex.test(formData.userId)) {
      alert("아이디는 영문, 숫자 조합, 6자 이상이어야 합니다.");
      return;
    }
  
    const requestUrl = `http://localhost:8088/api/users/check-userId?userId=${formData.userId}`;
    console.log("아이디 중복 확인 요청 URL:", requestUrl);
  
    try {
      const response = await fetch(requestUrl);
  
      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.statusText} (상태 코드: ${response.status})`);
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
    setFormData({ ...formData, password });
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    setPasswordStrength(
      passwordRegex.test(password)
        ? "보안성 : 강함"
        : "비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상이어야 합니다."
    );
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setFormData({ ...formData, confirmPassword });
    setPasswordMatch(formData.password === confirmPassword);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const nicknameRegex = /^[a-zA-Z0-9가-힣]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{11}$/;
    const addressRegex = /^[a-zA-Z0-9\s,]+$/; // 주소 형식 정규식 예시

    const birth = `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`;

    if (!formData.name) {
      alert("이름을 입력하세요.");
      return;
    }
    if (!nicknameRegex.test(formData.nickname)) {
      alert("닉네임에는 특수문자를 사용할 수 없습니다.");
      return;
    }
    if (!formData.phone_number.match(phoneRegex)) {
      alert("전화번호는 11자리 숫자만 입력해야 합니다.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!emailRegex.test(formData.email)) {
      alert("올바른 이메일 형식을 입력하세요. 예: example@domain.com");
      return;
    }
    if (!isEmailVerified) {
      alert("이메일 인증이 필요합니다.");
      return;
    }
    if (isUsernameAvailable === false) {
      alert("아이디 중복 확인이 필요합니다.");
      return;
    }
    if (!addressRegex.test(formData.address)) {
      alert("올바른 주소 형식을 입력하세요.");
      return;
    }

    const { confirmPassword, ...formDataToSend } = formData;

    const formDataToSendWithBirth = { ...formDataToSend, birth };

    console.log(
      "name : " +
        formData.name +
        ", " +
        "nickname : " +
        formData.nickname +
        ", " +
        "userId : " +
        ", " +
        "password : " +
        formData.password +
        ", " +
        "birth : " +
        formData.birth +
        ", " +
        "phone_number : " +
        formData.phone_number +
        ", " +
        "email : " +
        formData.email +
        ", " +
        "address : " +
        formData.address
    );

    // 회원가입 처리
    fetch(API_USER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataToSendWithBirth),
    });

    alert("회원가입 성공! 로그인 페이지로 이동합니다.");
    navigate("/login");
  };

  return (
    <div className="join-container">
      <button onClick={onBack} className="join-back-button">
        {/* <MdOutlineBackspace /> */}뒤로가기
      </button>
      <div className="join-logo-container">
        {/* <img src={logoImage} alt="호박고구마 로고" className="join-logo" /> */}
        <h1>하이펜타M</h1>
      </div>
      <h2 className="join-h2">회원가입</h2>
      <form className="join-form" onSubmit={handleSignup}>
        <label>이름:</label>
        <input
          type="text"
          placeholder="이름"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <label>닉네임:</label>
        <input
          type="text"
          placeholder="2~10자 특수문자 제외"
          value={formData.nickname}
          onChange={(e) =>
            setFormData({ ...formData, nickname: e.target.value })
          }
        />
        <label>아이디:</label>
        <input
          type="text"
          placeholder="2~10자 특수문자 제외"
          value={formData.userId}
          onChange={(e) =>
            setFormData({ ...formData, userId: e.target.value })
          }
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
        />
        <span>{passwordStrength}</span>
        <label>비밀번호 확인:</label>
        <input
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          value={formData.confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        {passwordMatch !== null && (
          <span style={{ color: passwordMatch ? "green" : "red" }}>
            {passwordMatch ? "비밀번호 일치" : "비밀번호 불일치"}
          </span>
        )}
        <label>생일:</label>
        <input
          type="text"
          placeholder="- 없이 숫자만 입력"
          value={formData.tel_number}
          onChange={(e) =>
            setFormData({ ...formData, tel_number: e.target.value })
          }
        />
        <label>전화번호:</label>
        <input
          type="text"
          placeholder="- 없이 숫자만 입력"
          value={formData.phone_number}
          onChange={(e) =>
            setFormData({ ...formData, phone_number: e.target.value })
          }
        />
        <label>이메일:</label>
        <input
          type="email"
          placeholder="올바른 이메일 형식을 입력하세요"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <button type="button" onClick={() => setIsEmailVerified(true)}>
          이메일 인증
        </button>
        {isEmailVerified && <span>인증 완료</span>}
        <label>주소:</label>
        <input
          type="text"
          placeholder="주소를 입력하세요"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
        <div className="button-group">
          <button type="submit">가입</button>
          <button type="button" onClick={() => navigate(-1)}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default JoinPage;
