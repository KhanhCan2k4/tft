import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import ApploadList from "../../../components/ApploadList";
import { apiURL } from "../../../App";
import { Select } from "antd";

export default function HonorSubPage({}) {
  const [honors, setHonors] = useState([]);

  const btnNext = useRef();
  const btnBack = useRef();
  const honorFrame = useRef();

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getHonorsFromDatabase();
  }, []);

  useEffect(() => {
    document.title = "Sinh viên xuất sắc của TFT";
  }, []);

  const handleBack = () => {
    if (honorFrame.current) {
      honorFrame.current.classList.remove("next");
      honorFrame.current.classList.remove("back");

      honorFrame.current.classList.add("back");
    }
    setCurrentIndex(currentIndex === 0 ? honors.length - 1 : currentIndex - 1);

    setTimeout(() => {
      honorFrame.current.classList.remove("back");
    }, 2000);
  };

  const handleNext = () => {
    if (honorFrame.current) {
      honorFrame.current.classList.remove("next");
      honorFrame.current.classList.remove("back");

      honorFrame.current.classList.add("next");
    }
    setCurrentIndex(currentIndex === honors.length - 1 ? 0 : currentIndex + 1);

    setTimeout(() => {
      honorFrame.current.classList.remove("next");
    }, 2000);
  };

  const handleChoose = (index) => {
    if (honorFrame.current) {
      honorFrame.current.classList.remove("next");
      honorFrame.current.classList.remove("back");

      if (index < currentIndex) {
        honorFrame.current.classList.add("back");
      } else {
        honorFrame.current.classList.add("next");
      }
    }

    setCurrentIndex(index);

    setTimeout(() => {
      honorFrame.current.classList.remove("next");
    }, 2000);
  };

  function getHonorsFromDatabase() {
    const api = apiURL + "users/honors";

    fetch(api)
      .then((res) => res.json())
      .then((honors) => {
        setHonors(honors);
      })
      .catch((err) => {
        console.log("fetch honors", err);
      });
  }

  return (
    <>
      <div className="honor-content">
        <div className="container">
          {honors && (
            <div ref={honorFrame} className="honor-class">
              <ApploadList users={honors[currentIndex]} />
            </div>
          )}
        </div>
      </div>

      <div className="sticky-bottom change-honor-class">
        <div className="py-3 row mt-5">
          <div className="col-4 col-lg-5 text-end">
            <button
              onClick={handleBack}
              ref={btnBack}
              className="btn"
            >
              <i className="bi bi-arrow-left-circle-fill"></i>
            </button>
          </div>
          <div className="col-4 col-lg-2 text-center">
            <Select
              size="large"
              className="w-100"
              defaultValue={currentIndex}
              value={currentIndex}
              onChange={handleChoose}
              options={honors.map((_class, index) => ({
                label: _class && _class[0] && _class[0].class,
                value: index,
              }))}
            />
          </div>
          <div className="col-4 col-lg-5 text-start">
            <button
              onClick={handleNext}
              ref={btnNext}
              className="btn"
            >
              <i className="bi bi-arrow-right-circle-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
