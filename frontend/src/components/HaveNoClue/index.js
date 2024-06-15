export default function HaveNoClue() {
  return (
    <div className="have-no-clue">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <img
              style={{ width: "100%", height: "100%" }}
              src="./src/have-no-clue.jpg"
              alt="Chưa có thông tin"
            />
          </div>
          <div className="col-md-8">
            <h2>"{"Opps! Chưa có thông tin nào... :<"}"</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
