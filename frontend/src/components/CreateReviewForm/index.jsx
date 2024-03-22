import ReviewForm from '../ReviewForm';


const CreateReviewForm = ({spotId}) => {
    const review = {
        "review": "",
        "stars": "" 
    };

    return(<>
        <ReviewForm review={review} spotId={spotId} formType="create" />
    </>)
}

export default CreateReviewForm;