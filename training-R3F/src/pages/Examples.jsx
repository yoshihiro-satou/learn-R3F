import { Outlet } from "react-router";
import { Link } from "react-router";
const Examples = () => {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh"
      }}>
        <Link
          to="/"
          style={{
            position: "absolute",
            zIndex: 100,
            top: "20px",
            left: "20px",
          }}
        >
        Home
        </Link>
        <div
          style={{
            width: "100%",
            height: "100%"
          }}>
          <Outlet />
        </div>
    </div>
  )
}
export default Examples;
