import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "./styles.css";
import { useNavigate } from 'react-router';
import logo from "./logo.png";

export default function TagBack({link = undefined}) {
    const navigate = useNavigate();
    const handelBack = () => {
        if (link) {
            navigate(link);
        } else {
            navigate(-1);
        }
    }

    return (
        <div 
            onClick={handelBack}
            className="tag-back">
            <img src={logo} alt="Logo"/>
            <ArrowBackIcon className='back-icon'/>
        </div>
    )
}