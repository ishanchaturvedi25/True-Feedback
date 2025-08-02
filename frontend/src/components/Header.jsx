import ProfileDropdown from "./ProfileDropdown";

const Header = () => {
  return (
    <header className="w-full p-4 bg-white shadow flex justify-between items-center">
      <h1 className="text-xl font-bold">True Feedback</h1>
      <ProfileDropdown />
    </header>
  );
};

export default Header;