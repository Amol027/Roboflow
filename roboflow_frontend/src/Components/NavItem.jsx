const NavItem = ({ icon, label, active = false }) => {
  return (
    <div
      className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
        active ? 'bg-purple-700' : 'hover:bg-purple-700'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
};

export default NavItem;
