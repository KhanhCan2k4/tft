import { useEffect } from "react"

export default function AdDice({ images}) {

    return (
        <>
            <hr />
            <div className="dice mb-4">
                <div className="face front">
                    <img className="img-fluid" src={images && images[0]} alt="" />
                </div>
                <div className="face back">
                    <img className="img-fluid" src={images && images[1]} alt=""/>
                </div>
                <div className="face left">
                    <img className="img-fluid" src={images && images[2]} alt="" />
                </div>
                <div className="face right">
                    <img className="img-fluid" src={images && images[3]} alt="" />
                </div>
            </div>
        </>
    )
}