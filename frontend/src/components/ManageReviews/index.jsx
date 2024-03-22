import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviewsOfUser } from "../../store/review";
import Review from "../ReviewsIndex/Review";


const ManageReviewsPage = () => {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false)
    const reviews = useSelector(state => state.reviews.user);

    useEffect(()=> {
        dispatch(getAllReviewsOfUser()).then(()=>setIsLoaded(true));
    }, [dispatch])

    return(<>
    <h2>Manage Reviews</h2>
    {isLoaded && <div>
        {Object.values(reviews).sort((a, b) => b.id - a.id).map(review => {
            return (<Review key={review.id} review={review} formType="manageReview"/>)
        })}
        </div>}
    </>
    )
}

export default ManageReviewsPage;