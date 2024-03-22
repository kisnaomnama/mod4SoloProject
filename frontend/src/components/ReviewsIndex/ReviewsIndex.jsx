import {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { populateReviewsOfSpot } from '../../store/review';
import OpenModalButton from '../OpenModalButton';
import CreateReviewForm from '../CreateReviewForm';
import Review from './Review';


const ReviewsIndex = ({spot, spotId, ownerId: spotOwnerId, numReviews}) => {
    const dispatch = useDispatch();
    const [loaded, setLoaded] = useState(false);
    const reviews = useSelector(state => state.reviews.spot);
    const user = useSelector(state => state.session.user);
    const [postReview, setPostReview] = useState(false);

    useEffect(()=> {
        dispatch(populateReviewsOfSpot(spotId)).then(()=>setLoaded(true));
    }, [dispatch, spotId]);

    useEffect(()=> {
        if(user === null){
            setPostReview(false);
            return;
        }

        if(spotOwnerId === user.id){
            setPostReview(false);
            return;
        }

        for(let review of Object.values(reviews)){
            if(review.User.id === user.id){
                setPostReview(false);
                return;
            }
        }

        setPostReview(true);
    }, [spotOwnerId, user, reviews, spotId]);


    return(loaded && <>
        <div>
            {postReview && <div className="post-review-section">
                <OpenModalButton 
                buttonText="Post Your Review"
                className="post-your-review-button cursor"
                modalComponent={<CreateReviewForm spotId={spotId} />} />
                {numReviews === 0 && <p>Be the first to post a review!</p>}
               </div>}
            {Object.values(reviews).sort((a, b)=> b.id - a.id).map(review => {
                return (<Review className="review-section review-card" review={review} spotId={spotId} key={review.id} spot={spot}/>)
            })}
        </div>
    
    </>);
}

export default ReviewsIndex;
