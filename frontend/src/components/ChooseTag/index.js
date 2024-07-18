import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useEffect, useState } from "react";
import { apiURL } from "../../App";

const ITEM_HEIGHT = 50;
const ITEM_PADDING_TOP = 3;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: "100%",
    },
  },
};

export default function MultipleSelectTags({
  handleChooseTags,
  initTags = [],
}) {
  //states
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(initTags);

  //effects
  useEffect(() => {
    const api = apiURL + "tags";

    fetch(api)
      .then((res) => res.json())
      .then((tags) => {
        setTags(tags);
      })
      .catch((err) => {
        console.log("fetch tags", err);
      });
  }, []);

  //handles
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedTags(value);
    handleChooseTags(value.map((tag) => tag.id));
  };

  //fetches
  const getTagsFromDatabase = () => {
    const api = apiURL + "tags";
    fetch(api)
      .then((res) => res.json())
      .then((tags) => {
        setTags(tags);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getTagsFromDatabase();
  }, []);

  return (
    <div>
      <FormControl sx={{ m: 1, width: "100%" }}>
        <InputLabel id="tag-multiple-chip-label">
          <Chip label={<b>Tags</b>} />
        </InputLabel>
        <Select
          labelId="tag-multiple-chip-label"
          id="tag-multiple-chip"
          multiple
          value={selectedTags}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((tag) => (
                <Chip className="my-1" key={tag.id} label={tag.name} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {tags &&
            tags.map((tag) => (
              <MenuItem key={tag.id} value={tag}>
                {tag.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
}
