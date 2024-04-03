const useAuth = () => {
  const profile = localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')) : null;
  const handleLogOut = () => {
    localStorage.clear();
    window.location.reload();
  };
  return { profile, logout: handleLogOut };
};

export default useAuth;
