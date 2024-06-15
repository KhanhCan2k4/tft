import React, { useEffect, useRef, useState } from "react";
import ApploadList from "../../components/ApploadList";
import Footer from "../../components/Footer";
import TagBack from "../../components/TagBack";
import "./styles.css";
import { Form } from "react-bootstrap";

export default function ApploadPage({}) {
  const students1 = [
    {
      id: 1,
      name: "John",
      archivements: `
            Input
            Một số thực là bán kính 
            Giới hạn:

            Làm tròn giá trị 
            Output
            Lần lượt là chu vi và diện tích hình tròn cách nhau bởi 1 dấu cách. Kết quả làm tròn tới chữ số thập phân thứ 3

            Sample
            `,
    },
    {
      id: 2,
      name: "John 2",
      archivements: `
            Input
            Một số thực là bán kính 
            Giới hạn:

            Làm tròn giá trị 
            Output
            Lần lượt là chu vi và diện tích hình tròn cách nhau bởi 1 dấu cách. Kết quả làm tròn tới chữ số thập phân thứ 3

            Sample
            `,
    },
    {
      id: 3,
      name: "John 3",
      archivements: `
            Input
            Một số thực là bán kính 
            Giới hạn:

            Làm tròn giá trị 
            Output
            Lần lượt là chu vi và diện tích hình tròn cách nhau bởi 1 dấu cách. Kết quả làm tròn tới chữ số thập phân thứ 3

            Sample
            `,
    },
    {
      id: 4,
      name: "John 4",
      archivements: `
            Input
            Một số thực là bán kính 
            Giới hạn:

            Làm tròn giá trị 
            Output
            Lần lượt là chu vi và diện tích hình tròn cách nhau bởi 1 dấu cách. Kết quả làm tròn tới chữ số thập phân thứ 3

            Sample
            `,
    },
    {
      id: 3,
      name: "John 5",
      archivements: `
            Input
            Một số thực là bán kính 
            Giới hạn:

            Làm tròn giá trị 
            Output
            Lần lượt là chu vi và diện tích hình tròn cách nhau bởi 1 dấu cách. Kết quả làm tròn tới chữ số thập phân thứ 3

            Sample
            `,
    },
  ];

  const students2 = students1.slice(0, 4);
  const students3 = students1.slice(0, 1);
  const students4 = students1.slice(0, 3);
  const students5 = students1.slice(0, 4);

  const students = [students1, students2, students3, students4, students5];

  const btnNext = useRef();
  const btnBack = useRef();
  const apploadFrame = useRef();

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleRunning = () => {
    // setTimeout(function load() {
    //   if (btnNext.current) {
    //     btnNext.current.click();
    //   }
    //   setTimeout(load, 5000);
    // }, 5000);
  };

  useEffect(() => {
    handleRunning();
  }, 5000);

  const handleBack = () => {
    if (apploadFrame.current) {
      apploadFrame.current.classList.remove("next");
      apploadFrame.current.classList.remove("back");

      apploadFrame.current.classList.add("back");
    }
    setCurrentIndex(
      currentIndex === 0 ? students.length - 1 : currentIndex - 1
    );

    setTimeout(() => {
      apploadFrame.current.classList.remove("back");
    }, 2000);
  };

  const handleNext = () => {
    if (apploadFrame.current) {
      apploadFrame.current.classList.remove("next");
      apploadFrame.current.classList.remove("back");

      apploadFrame.current.classList.add("next");
    }
    setCurrentIndex(
      currentIndex === students.length - 1 ? 0 : currentIndex + 1
    );

    setTimeout(() => {
      apploadFrame.current.classList.remove("next");
    }, 2000);
  };

  const handleChoose = (e) => {
    const index = +e.target.value;
    if (apploadFrame.current) {
      apploadFrame.current.classList.remove("next");
      apploadFrame.current.classList.remove("back");

      if (index < currentIndex) {
        apploadFrame.current.classList.add("back");
      } else {
        apploadFrame.current.classList.add("next");
      }
    }

    setCurrentIndex(index);

    setTimeout(() => {
      apploadFrame.current.classList.remove("next");
    }, 2000);
  };

  return (
    <div className="appload-content stack-page">
      <TagBack />

      <div className="container">
        {students && (
          <div ref={apploadFrame} className="appload-class">
            <h2>Sinh viên khoá {currentIndex + 1}</h2>
            <ApploadList users={students[currentIndex]} />
          </div>
        )}
      </div>

      <div className="py-3 row">
        <div className="col-md-5 text-end">
          <button
            onClick={handleBack}
            ref={btnBack}
            className="px-5 mx-2 btn btn-primary"
          >
            <i className="bi bi-arrow-left-circle-fill"></i>
          </button>
        </div>
        <div className="col-md-2 text-center">
          <Form.Select onChange={handleChoose}>
            {students &&
              students.map((_, index) => (
                <option
                  key={index}
                  value={index}
                  selected={index === currentIndex}
                >
                  Khoá {index + 1}
                </option>
              ))}
          </Form.Select>
        </div>
        <div className="col-md-5 text-start">
          <button
            onClick={handleNext}
            ref={btnNext}
            className="px-5 mx-2 btn btn-primary"
          >
            <i className="bi bi-arrow-right-circle-fill"></i>
          </button>
        </div>
      </div>
      <div className="bg-dark">
        <Footer />
      </div>
    </div>
  );
}
