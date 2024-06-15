import { useNavigate } from "react-router";
import "./styles.css";
import { imageURL } from "../../App";

export default function CarouselBanner({ banners }) {
    const total = banners.length;

    const navigate = useNavigate();

    const btnLinks = [];
    for (let i = 0; i < total; i++) {
        btnLinks.push((
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to={i} className="active" aria-current="true" aria-label="Slide 1"></button>
        ));
    }

    function goIntro() {
        navigate("/intro");
    }

    return (
        <div className="carousel-banner">
            <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    {btnLinks}
                </div>

                <div className="carousel-inner">
                    {banners && banners.map((banner, index) => (
                        <div key={index} 
                            onClick={goIntro}
                            className={"carousel-item " + (index == 0 ? "active" : "")}>
                            <img src={imageURL + banner.img || "./src/banners/banner.jpg"} 
                                className="d-block w-100" 
                                alt={banner.title} />
                        </div>
                    ))}

                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    )
}

function getFirstWords(sentence, amount) {
    return sentence.split(' ').slice(0, amount).join(' ');
}