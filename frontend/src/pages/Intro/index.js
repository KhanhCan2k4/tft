import { useEffect, useRef } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";

export default function Intro() {
  const lightsContainer = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    getLights(lightsContainer.current);
  });

  function goHome() {
    navigate("/");
  }

  return (
    <div className="intro-box">
      <div onClick={goHome} className="top"></div>
      <div onClick={goHome} className="top-left"></div>
      <div onClick={goHome} className="top-right"></div>
      <div onClick={goHome} className="bottom"></div>
      <div onClick={goHome} className="bottom-left"></div>
      <div onClick={goHome} className="bottom-right"></div>

      <div className="box">
        <div className="layer-1"></div>
        <div className="layer-2"></div>
        <div className="layer-3"></div>
        <div onClick={goHome} className="foot"></div>
      </div>

      <div ref={lightsContainer} className="lights"></div>
    </div>
  );
}

function getLights(lightsContainer) {
  setTimeout(function upLight() {
    const light = document.createElement("div");
    light.classList.add("light");

    light.style.left = ` calc(${Math.round(Math.random() * 100)}% - 100px)`;

    lightsContainer.appendChild(light);

    setTimeout(upLight, 1000);

    setTimeout(() => {
      light.remove();
    }, 2500);
  }, 1000);
}
