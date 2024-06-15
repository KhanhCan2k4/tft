import { useEffect, useRef } from "react";
import ApploadStudentCard from "../ApploadStudentCard";
import "./styles.css";

export default function CarouselAppload({students}) {
  const btnNext = useRef();

  useEffect(() => {
    setTimeout(function goNext() {
      btnNext.current?.click();

      setTimeout(goNext, 3000);
    }, 3000);
  }, []);

  return (
    <div className="my-carousel-appload">
      <div id="carousel-appload" class="carousel slide">
        <div class="carousel-inner">
          {students && students.map((student, index) => (
            <div class={"carousel-item " + (index === 0? "active" :"")}>
              <ApploadStudentCard student={student} />
            </div>
          ))}
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carousel-appload"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          ref={btnNext}
          class="carousel-control-next"
          type="button"
          data-bs-target="#carousel-appload"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
