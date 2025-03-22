const Header = ({ title, showLogo = false }) => {
  return (
    <header className="header-container">
      {showLogo && <h2>Logo</h2>}
      <h2 className="header-title">{title}</h2>
    </header>
  );
};

export default Header;
