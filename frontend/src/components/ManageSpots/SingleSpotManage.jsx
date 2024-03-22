import { useNavigate } from "react-router";
import IndexItem from "../SpotsIndex/IndexItem";
import OpenModalButton from "../OpenModalButton";
import DeleteSpot from './Deletespot'

const SingleSpotManage = ({ spot }) => {
    const navigate = useNavigate();

    const updateButton = () => {
        navigate(`/spots/${spot.id}/edit`)
    }

    return (
        <div className="manage-spot-tile">
            <IndexItem spot={spot} />
            <div className="manage-spot-buttons">
                <button className="manage-spot-button cursor" onClick={updateButton}>Update Spot</button>
                <OpenModalButton className="manage-spot-button cursor" buttonText="Delete" modalComponent={<DeleteSpot spot={spot} />} />
            </div>
        </div>
    )
}

export default SingleSpotManage;
