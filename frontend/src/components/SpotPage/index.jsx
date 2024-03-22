import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSpotById } from '../../store/spots';
import ReviewStats from './ReviewStats';
import ReviewsIndex from '../ReviewsIndex/ReviewsIndex';
import './style.css'

const SpotPage = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const spot = useSelector(state => state.spots.singleSpot);
    // console.log("Spot===========>", spot.avgRating)

    const {
        avgRating,
        city,
        country,
        description,
        Owner,
        name,
        numReviews,
        ownerId,
        price,
        state } = spot;

    useEffect(() => {
        dispatch(getSpotById(spotId)).then(() => setIsLoaded(true));

    }, [dispatch, spotId]);

    const reserveButtonPress = () => {
        alert("Feature coming soon...")
    }

    return (isLoaded && <div className='spot-page'>

        <h1 className="spot-page-title">{name}</h1>
        <p>{city}, {state}, {country}</p>
        <div className='spot-show-images'>
            {spot.SpotImages.map((image, id) => {
                const imageClassName = image.preview ? `spot-show-image spot-show-preview spot-show-image-${id}` : "spot-show-image";
                return (<img className={imageClassName} key={image.url} src={image.url} alt={image.url} />)
            })}
        </div>
        <div className='spot-show-info'>
            <div className='spot-show-description'>
                <h3>Hosted by {Owner.firstName} {Owner.lastName} </h3>
                <p>{description}</p>
            </div>

            <div className='spot-show-reserve-grouping'>
                <p><span className='review-card-price'>${price} night</span></p>
                <div className='review-card'>
                    <ReviewStats
                        avgStarRating={avgRating}
                        numReviews={numReviews}
                    />
                </div>
                <button className="spot-show-reserve-button cursor" onClick={reserveButtonPress}>Reserve</button>
            </div>
        </div>
        <div className="reviews-under-description">
            <ReviewStats
                avgStarRating={avgRating}
                numReviews={numReviews}
            />

        </div>
        <div>
            <ReviewsIndex spot={spot} spotId={spotId} ownerId={ownerId} numReviews={numReviews} />
        </div>
    </div>
    )
}

export default SpotPage;
