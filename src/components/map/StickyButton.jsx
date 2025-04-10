import React, { useState } from "react";
import { Box, Fab, Zoom } from "@mui/material";
import { Home, ArrowBack, List, Map, ExpandLess } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const StickyButton = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // 현재 위치 확인

  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // 맨 위로 이동
  };

  return (
    <Box sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 10 }}>
      {/* 메인 버튼 */}
      <Fab
        color="primary"
        onClick={toggleMenu}
        sx={{
          background: "linear-gradient(to right, #4caf50, #81c784)", // 초록색 계열로 변경
          boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
        }}
      >
        <List />
      </Fab>

      {/* 서브 메뉴 */}
      <Zoom in={open}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            mt: 2,
            alignItems: "center",
          }}
        >
          {/* 홈 버튼 */}
          <Fab
            color="secondary"
            size="small"
            onClick={() => navigate("/")}
            sx={{
              backgroundColor: "#2196f3", // 파란색 계열로 변경 (지도 느낌)
              color: "#fff",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            <Home />
          </Fab>

          {/* 뒤로가기 버튼 */}
          <Fab
            color="info"
            size="small"
            onClick={() => navigate(-1)}
            sx={{
              backgroundColor: "#8d6e63", // 갈색 계열로 변경 (산 느낌)
              color: "#fff",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            <ArrowBack />
          </Fab>

          {/* 화면별 추가 버튼 */}
          {location.pathname === "/mountain/list" ? (
            <>
              {/* 지도 화면으로 이동 버튼 */}
              <Fab
                color="success"
                size="small"
                onClick={() => navigate("/mountain/list_map")}
                sx={{
                  backgroundColor: "#4caf50", // 초록색 계열로 변경 (자연 느낌)
                  color: "#fff",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
                }}
              >
                <Map />
              </Fab>

              {/* 맨 위로 이동 버튼 */}
              <Fab
                color="warning"
                size="small"
                onClick={scrollToTop}
                sx={{
                  backgroundColor: "#ff9800", // 주황색 계열로 변경 (강조)
                  color: "#fff",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
                }}
              >
                <ExpandLess />
              </Fab>
            </>
          ) : (
            /* 목록 보기 버튼 */
            <Fab
              color="success"
              size="small"
              onClick={() => navigate("/mountain/list")}
              sx={{
                backgroundColor: "#4caf50", // 초록색 계열로 변경 (자연 느낌)
                color: "#fff",
                boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
              }}
            >
              <List />
            </Fab>
          )}
        </Box>
      </Zoom>
    </Box>
  );
};

export default StickyButton;
