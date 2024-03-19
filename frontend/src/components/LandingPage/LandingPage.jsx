import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllSpots } from '../../store/spots';
import { NavLink } from "react-router-dom";
import { selectedSpotsArray } from "../../store/spots";
import './LandingPage.css';

const LandingPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector(selectedSpotsArray)
 

  useEffect(() => {
    dispatch(getAllSpots())
  }, [dispatch]);

  return (
    <section className="spot-tiles-container">
      {spots && spots.map(spot => (
        <div key={spot.id} className="tile-container">
          <NavLink to={`/spots/${spot.id}`} className='tile-link'>
            <div title={spot.name}>
              <img className="tile-image" src={spot.previewImage} alt={`${spot.name} preview image`} />
              <div className="listing-info-container">
                <div className="location-container">
                  <div className="location">{`${spot.city}, ${spot.state}`}</div>
                  <div className="price">{`$${spot.price}/night`}</div>
                </div>
                <div className="rating">
                  <i className="fas fa-star">{`${spot.avgRating ? parseFloat(spot.avgRating).toFixed(1) : 'New'}`}</i>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        ))}
        </section>
  )
}

export default LandingPage;
