import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSpotDetails } from "../../store/spots";
import { useParams } from "react-router-dom";


const SpotDetailsPage = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spots);
  const selectedSpot = spot[spotId];
  // console.log("🚀 ~ SpotDetailsPage ~ spot:", spot)

  useEffect(() => {
    dispatch(getSpotDetails(spotId))
  }, [dispatch, spotId]);

  const handleReserveClick = () => {
    alert("Feature coming soon!")
  };

  const reviews = () => {
    if (selectedSpot.numReviews > 1 && selectedSpot.avgStarRating) {
      return (`${selectedSpot.avgStarRating.toFixed(1)} · ${selectedSpot.numReviews} reviews`);
    }
    if (selectedSpot.numReviews === 1 && selectedSpot.avgStarRating) {
      return (`${selectedSpot.avgStarRating.toFixed(1)} · ${selectedSpot.numReviews} review`);
    }
    return 'New';
  }


  return (
    <>
      <div>
        {selectedSpot && (
          <section className="body">
            <section className="spot-header">
               <h2>{selectedSpot.name}</h2>
               <h3>{`${selectedSpot.city}, ${selectedSpot.state}, ${selectedSpot.country}`}</h3>
            </section>
            <section className="image-container">
               <div className="main-image-container">
                <img className="spot-details-main-image" src={selectedSpot.SpotImages?.[0]?.url} alt={`main image of ${selectedSpot.name}`} />
               </div>
               <div className="small-images-container">
                <img className="small-image" src={selectedSpot.SpotImages?.[1]?.url} alt="small image one" />
                <img className="small-image" src={selectedSpot.SpotImages?.[2]?.url} alt="small image two" />
                <img className="small-image" src={selectedSpot.SpotImages?.[3]?.url} alt="small image three" />
                <img className="small-image" src={selectedSpot.SpotImages?.[4]?.url} alt="small image four" />
             </div>
            </section>
            <section className="info-container">
              <div className="description-container">
                <h3>{`Hosted by ${selectedSpot.Owner?.firstName}, ${selectedSpot.Owner?.lastName}`}</h3>
                <p>{selectedSpot.description}</p>
              </div>
              <div className="spot-callout-container">
                <div className="spot-callout-info">
                  <p><span className="spot-callout-price">{`$${selectedSpot.price}`}</span><span className="price-night">night</span></p>
                  <p><i className="fa-solid fa-star"></i><span className="rating-review"> {reviews()}</span></p>
                  <button
                    className="reserve-button"
                    onClick={handleReserveClick}
                    >
                      Reserve
                  </button>
                </div>
              </div>
            </section>
            <section className="reviews-container">
              <h1><i className="fa-solid fa-star"></i><span className="rating-review-2"> {reviews()}</span></h1>
              {/* <GetSpotReviews /> */}
            </section>
          </section>
        )}
      </div>
    </>
  )
}

export default SpotDetailsPage;
