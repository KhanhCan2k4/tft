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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: "100%",
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelectTags({ handleChooseTags, initTags }) {
  //states
  const theme = useTheme();
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

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
        <InputLabel id="tag-multiple-chip-label" error>
          Tags
        </InputLabel>
        <Select
          labelId="tag-multiple-chip-label"
          id="tag-multiple-chip"
          multiple
          value={selectedTags}
          defaultValue={initTags}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((tag) => (
                <Chip key={tag.id} label={tag.name} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {tags &&
            tags.map((tag) => (
              <MenuItem
                key={tag.id}
                value={tag}
                style={getStyles(tag.name, selectedTags, theme)}
              >
                {tag.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
}
