import Footer from "../../components/Footer";
import NavBar from "../../components/Navbar";
import "./styles.css";

export default function DefaultLayout({ slot }) {
  return (
    <div className="default-layout">
      <NavBar />
      <div className="content row">
        <div className="main-content">
          <div className="container">{slot}</div>
        </div>
      </div>
      <div className="bg-dark">
        <Footer />
      </div>
    </div>
  );
}
