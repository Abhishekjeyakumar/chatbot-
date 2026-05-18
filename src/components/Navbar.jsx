import "./Navbar.css";

export function Navbar({
  theme,
  setTheme,
  setSidebarOpen,
}) {

  return (

    <div className="navbar">

      <button
        className="menu-btn"
        onClick={() =>
          setSidebarOpen(
            (prev) => !prev
          )
        }
      >
        ☰
      </button>

      <h2 className="navbar-title">
        AskMe AI
      </h2>

      <button
        className="theme-toggle"
        onClick={() =>
          setTheme(
            theme === "dark"
              ? "light"
              : "dark"
          )
        }
      >

        {theme === "dark"
          ? "☀"
          : "🌙"}

      </button>

    </div>
  );
}