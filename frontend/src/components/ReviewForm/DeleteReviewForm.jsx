import { useModal } from "../../context/Modal";
import { getSpotById } from "../../store/spots";
import { deleteReview, populateReviewsOfSpot} from "../../store/review";
import { useDispatch } from "react-redux";

export default function DeleteReviewForm ({review, spotId, updateType}) {
    // console.log("SpotID=======> ", spotId)
    // console.log("reviews ====>", review)

    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const yesButtonClick = async () => {
        const response = await dispatch(deleteReview(review.id));
        if(response.ok){
            if(updateType === "spot"){
                await dispatch(populateReviewsOfSpot(review.spotId));
                await dispatch(getSpotById(review.spotId))
            }
            closeModal();
        }

    }

    const noButtonClick = () => closeModal();

    return(<div className="delete-popup">
        <h2 className="review-popup-heading">Confirm Delete</h2>
        <p>Are you sure you want to delete this review?</p>
        <div className="delete-popup-buttons">
            <button className="delete-popup delete-yes cursor" onClick={yesButtonClick}>Yes (Delete Review)</button>
            <button className="delete-popup delete-no cursor" onClick={noButtonClick}>No (Keep Review)</button>
        </div>
    </div>)
}
