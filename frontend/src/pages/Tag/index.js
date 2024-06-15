import { useState } from "react";
import { apiURL } from "../../App";

export default function TagPage() {
  const url = apiURL + "tags";

  const [tags, setTags] = useState([]);

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      setTags(data);
    })
    .catch((err) => {
      setTags([]);
      console.log(err);
    });

  console.log(url);
  console.log(tags);

  return <></>;
}
