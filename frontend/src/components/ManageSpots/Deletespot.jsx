import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { getCurrentUserSpots } from "../../store/spots";
import { deleteSpotById } from "../../store/spots";
import './manageSpots.css'
const DeleteSpot = ({ spot }) => {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    
    const yesButtonClicked = async () => {
        const response = await dispatch(deleteSpotById(spot.id));
        if (response.ok) {
            await dispatch(getCurrentUserSpots());
            closeModal();
        }
    }
    
    const noButtonClicked = () => {
        closeModal();
    }
    
    return (<div className="delete-modal">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to remove this spot?</p>
        <button className="delete-button yes-delete cursor" onClick={yesButtonClicked}>Yes (Delete Spot)</button>
        <button className="delete-button no-delete cursor" onClick={noButtonClicked}>No (Keep Spot)</button>
    </div>)
}

export default DeleteSpot;