

export default function Catgelogue({catelogue}) {
    return (
        <div className="mb-4">
            <b>{catelogue.title}</b>
            <hr />
            <a
                href={catelogue.link} target="_blank">
                <img
                    src={catelogue.image} className="img-fluid"
                    alt={catelogue.title} />
            </a>
        </div>
    )
}