import { Checkbox } from "@mui/material"
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import { yellow, grey } from "@mui/material/colors"
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';

export default function Filter() {
    return (
        <>
            <h4 className="title text-center text-white">TAGs</h4>
            <hr />

            <div className="filter">
                <div className="mb-3">
                    <Checkbox
                        sx={{
                            color: yellow['A700'],
                            '&.Mui-checked': {
                                color: grey['200'],
                            },
                        }}
                        defaultChecked
                        icon={<TurnedInIcon />}
                        checkedIcon={<TurnedInNotIcon />}
                    />
                    <label>Item 1</label>
                </div>
            </div>
        </>
    )
}