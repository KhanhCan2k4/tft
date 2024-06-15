import Carousel from "react-bootstrap/Carousel";

function PostBlock1() {
  return (
    <div className="PostBlock1 card m-4">
      <div className="row">
        <div className="col-md-4">
          <Carousel>
            <Carousel.Item>
              <img src="https://www.w3schools.com/bootstrap/la.jpg" className="img-fluid"/>
            </Carousel.Item>
            <Carousel.Item>
            <img src="https://www.w3schools.com/bootstrap/la.jpg" className="img-fluid"/>
            </Carousel.Item>
            <Carousel.Item>
            <img src="https://www.w3schools.com/bootstrap/la.jpg" className="img-fluid"/>
            </Carousel.Item>
          </Carousel>
        </div>
        <div className="col-md-8 card-body text-start">
          <h2> mini title</h2>
          <p>
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempora maiores quod ullam nihil nisi perferendis nobis, labore deserunt. Quibusdam, pariatur. Assumenda quis ut, inventore doloremque itaque officia placeat magni error.Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempora maiores quod ullam nihil nisi perferendis nobis, labore deserunt. Quibusdam, pariatur. Assumenda quis ut, inventore doloremque itaque officia placeat magni error.Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempora maiores quod ullam nihil nisi perferendis nobis, labore deserunt. Quibusdam, pariatur. Assumenda quis ut, inventore doloremque itaque officia placeat magni error.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PostBlock1;
