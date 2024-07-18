import TagBack from "../../components/TagBack";
import ForumSubPage from "../Index/Forum";

export default function ForumPage() {
  return (
    <section className="stack-section forum-section bg-white s">
      <div
        className="text-center pt-4 pb-3 fixed-top bg-primary text-white s"
        style={{ borderBottom: "1px solid white" }}
      >
        <h3>CỘNG ĐỒNG TFT</h3>
        <small>
          <i>Hỏi đáp thắc mắc cùng sinh viên TFT</i>
        </small>
      </div>

      <div style={{ paddingTop: "120px" }}>
        <div className="fixed-top">
          <TagBack link={"/"} />
        </div>

        <ForumSubPage />
      </div>
    </section>
  );
}
