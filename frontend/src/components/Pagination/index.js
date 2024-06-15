export default function Pagination({ page, total, handleLink, offset }) {
  const items = [];
  if (!offset) {
    offset = 2;
  }

  let from = page - offset;
  if (from < 1) {
    from = 1;
  }

  let to = page + offset;
  if (to > total) {
    to = total;
  }

  for (let i = from; i <= to; i++) {
    items.push(
      <li
        onClick={() => handleLink(i)}
        className={"page-item " + (i == page ? " active " : "")}
      >
        <span className="page-link">{i}</span>
      </li>
    );
  }

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination pagination-success">
        <li onClick={() => handleLink(1)} className="page-item">
          <span className="page-link sub-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </span>
        </li>

        <li
          onClick={() => handleLink(page - 1 < 1 ? 1 : page - 1)}
          className="page-item"
        >
          <span className="page-link sub-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&lt;</span>
          </span>
        </li>

        {from > 1 && <li className="page-item">
          <span className="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">...</span>
          </span>
        </li>}

        {items}

        {to < total && <li className="page-item">
          <span className="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">...</span>
          </span>
        </li>}

        <li
          onClick={() => handleLink(page + 1 > total ? total : page + 1)}
          className="page-item"
        >
          <span className="page-link sub-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&gt;</span>
          </span>
        </li>

        <li onClick={() => handleLink(total)} className="page-item">
          <span className="page-link sub-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </span>
        </li>
      </ul>
    </nav>
  );
}
