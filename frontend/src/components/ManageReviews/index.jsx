import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviewsOfUser, deleteReview } from "../../store/review";
import Review from "../ReviewsIndex/Review";
import DeleteReviewForm from "../ReviewForm/DeleteReviewForm";
import './style.css'


const ManageReviewsPage = () => {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false)
    const reviews = useSelector(state => state.reviews.user);

    useEffect(() => {
        dispatch(getAllReviewsOfUser()).then(() => setIsLoaded(true));
    }, [dispatch])

    return (<>
        <div className="manage-reviews-page">
            <div className="manage-review-title-section">
                <h3 className = 'manage-review-header'>Manage Reviews</h3>
            </div>
            {isLoaded && <div className='review-card-container'>
                {Object.values(reviews).sort((a, b) => b.id - a.id).map(review => {
                    return (<Review key={review.id} review={review} formType="manageReview" />)
                })}
            </div>}
        </div>
    </>
    )
}

export default ManageReviewsPage;
