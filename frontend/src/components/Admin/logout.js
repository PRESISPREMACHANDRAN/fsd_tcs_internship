const Logout = () => {
    localStorage.clear();
    let loginUrl = window.location.origin;
    window.location.href = loginUrl;
};

export default Logout;