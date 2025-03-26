import Logo from "./Logo";
import Title from "./Title";
import NavMenu from "./NavMenu";
import Icons from "./Icons";
import AuthButtons from "./AuthButtons";
import BackButton from "./BackButton";
import "../../css/Header.css";

const Header = ({
  showLogo = false,
  showBack = false,
  title,
  showIcons = {},
}) => {
  return (
    <div className="header-inner">
      <div className="header-left">
        {showLogo && <Logo />}
        {showBack && <BackButton />}
        <Title title={title} />
      </div>
      <div className="header-center">
        <NavMenu />
      </div>
      <div className="header-right">
        <Icons showIcons={showIcons} />
        <AuthButtons />
      </div>
    </div>
  );
};

export default Header;
