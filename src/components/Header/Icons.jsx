import { FiSearch } from "react-icons/fi";

const Icons = ({ showIcons = {} }) => {
  return <div className="header-icons">{showIcons.search && <FiSearch />}</div>;
};

export default Icons;
