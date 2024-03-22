import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import EditReviewForm from "../ReviewForm/EditReviewForm";
import DeleteReviewForm from "../ReviewForm/DeleteReviewForm";
import './style.css'


const Review = ({ review, spotId, spotName, formType}) => {
    const firstName = review.User.firstName;
    const year = review.createdAt.split("T")[0].split("-")[0]
    const monthMM = review.createdAt.split("T")[0].split("-")[1]
    const monthConverter = {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December"
    }
   
    const user = useSelector(state => state.session.user);
    const [enableManage, setEnableManage] = useState(false);
    
    useEffect(()=>{
        if(user){
            if(review.userId === user.id){
                setEnableManage(true);
                return;
            }
        }
    }, [review, enableManage, user]);

    const starGenerator = ({review}) => {
        const starCount = review.stars;
        let numStars = [];
        for(let i = 0; i < starCount; i++){
            numStars.push(<i key={i} className="fa fa-star"/>)
        }
        return numStars;
    }

    return (
        <>
        <div className="review-content">
            {formType !== "manageReview" && <h2>{firstName}</h2>}
            {formType === "manageReview" && <h2>{review.Spot.name}</h2>}
            <h3 className="review-content-month">{starGenerator({review})}{`${monthConverter[monthMM]} ${year}`}</h3>
            <h4></h4>
            <h4>{review.review}</h4>
        </div>
        {enableManage && <div className="review-manage-button">
            <OpenModalButton
            className="review-button-update cursor"
            buttonText="Update"
            modalComponent={<EditReviewForm review={review} spotId={spotId} spotName={spotName} updateType="spot" />}/>
            <OpenModalButton
            className="review-button-update cursor"
            buttonText="Delete"
            modalComponent={<DeleteReviewForm review={review} spotId={spotId} updateType="spot" />}/>
            </div>}
        </>
    )
}

export default Review;
