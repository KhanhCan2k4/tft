import React, { useEffect, useRef, useState } from "react";
import Footer from "../../../components/Footer";
import TagBack from "../../../components/TagBack";
import "./styles.css";
import { Form } from "react-bootstrap";
import ApploadList from "../../../components/ApploadList";
import { apiURL } from "../../../App";

export default function HonorSubPage({}) {
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

  const [honors, setHonors] = useState([]);

  const students2 = students1.slice(0, 4);
  const students3 = students1.slice(0, 1);
  const students4 = students1.slice(0, 3);
  const students5 = students1.slice(0, 4);

  const students = [students1, students2, students3, students4, students5];

  const btnNext = useRef();
  const btnBack = useRef();
  const honorFrame = useRef();

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getHonorsFromDatabase();
    console.log(honors);
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

  const handleChoose = (e) => {
    const index = +e.target.value;
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
    <div className="honor-content">
      <div className="container">
        {students && (
          <div ref={honorFrame} className="honor-class">
            <h2>
              Sinh viên lớp{" "}
              {(honors &&
                honors[currentIndex] &&
                honors[currentIndex][0] &&
                honors[currentIndex][0]["class"]) ||
                ""}
            </h2>
            <ApploadList users={honors[currentIndex]} />
          </div>
        )}
      </div>

      <div className="py-3 row">
        <div className="col-md-5 text-end">
          <button
            onClick={handleBack}
            ref={btnBack}
            className="px-5 mx-2 btn btn-dark"
          >
            <i className="bi bi-arrow-left-circle-fill"></i>
          </button>
        </div>
        <div className="col-md-2 text-center">
          <Form.Select onChange={handleChoose}>
            {honors &&
              honors.map((_class, index) => (
                <option
                  key={index}
                  value={index}
                  selected={index === currentIndex}
                  className="text-center"
                >
                  {_class && _class[0] && _class[0].class}
                </option>
              ))}
          </Form.Select>
        </div>
        <div className="col-md-5 text-start">
          <button
            onClick={handleNext}
            ref={btnNext}
            className="px-5 mx-2 btn btn-dark"
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
