import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grow } from "@mui/material";

const StickyButton = ({
  showHome = false,
  showWrite = false,
  showBack = false,
  showMap = false,
  showScrollTop = false,
  showList = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const toggleMenu = () => setOpen((prev) => !prev);

  return (
    <Box sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 10 }}>
      {/* 서브 메뉴 */}
      <Grow
        in={open}
        timeout={500}
        style={{ transformOrigin: "bottom center" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            mb: 2,
            alignItems: "center",
          }}
        >
          {showHome && (
            <Box onClick={() => navigate("/")}>
              <img
                src="/icons/icons_home.png"
                alt="home"
                className="sticky-icon"
                title="홈으로"
              />
            </Box>
          )}

          {showWrite && (
            <Box onClick={() => navigate("/")}>
              <img
                src="/icons/icons_write.png"
                alt="write"
                className="sticky-icon"
                title="작성하기"
              />
            </Box>
          )}

          {showBack && (
            <Box onClick={() => navigate(-1)}>
              <img
                src="/icons/icons_back.png"
                alt="back"
                className="sticky-icon"
                title="뒤로가기"
              />
            </Box>
          )}

          {showMap && (
            <Box onClick={() => navigate("/mountain/list_map")}>
              <img
                src="/icons/icons_map.png"
                alt="map"
                className="sticky-icon"
                title="지도 보기"
              />
            </Box>
          )}

          {showScrollTop && (
            <Box onClick={scrollToTop}>
              <img
                src="/icons/icons_up.png"
                alt="up"
                className="sticky-icon"
                title="맨 위로"
              />
            </Box>
          )}

          {showList && (
            <Box onClick={() => navigate("/mountain/list")}>
              <img
                src="/icons/icons_layard.png"
                alt="list"
                className="sticky-icon"
                title="산 목록 보기"
              />
            </Box>
          )}
        </Box>
      </Grow>

      {/* 메인 아이콘 (목록 아이콘) */}
      <Box onClick={toggleMenu}>
        <img
          src="/icons/icons_menu.png"
          alt="menu"
          className="sticky-icon"
          title="설정"
        />
      </Box>
    </Box>
  );
};

export default StickyButton;
