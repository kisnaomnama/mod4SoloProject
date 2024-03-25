import ReviewForm from '.';

const EditReviewForm = ({review, spotId, spotName, updateType}) => {
    return (<>
        <ReviewForm review={review} spotId={review.spotId} spotName={spotName} formType="update" updateType={updateType} />
    </>)
}

export default EditReviewForm;
