import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // 유저 정보 상태

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch("http://localhost:8088/api/users/session", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.user_id) {
            setIsLoggedIn(true);
            setUser(data); // 유저 정보 저장
          }
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("세션 확인 실패", error);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 어디서든 쉽게 사용할 수 있도록 커스텀 훅
export const useAuth = () => useContext(AuthContext);
