import { useNavigate } from "react-router-dom";

const IndexItem = ({spot}) => {
    const navigate = useNavigate();
    // console.log("Spot===========>", spot)

    const clickOnSpot = () => {
        const url = `/spots/${spot.id}`;
        navigate(url)
    }

    return(<>
        <div onClick={clickOnSpot} className="spot-tile cursor">
            <div className='tooltip'>
                <img className='spot-tile-image tooltip' src={`${spot.previewImage}`} alt={`${spot.previewImage}`}/>
                <span className='tooltip-text'>{spot.name}</span>
            </div>
          
            <div className='spot-tile-info'>
                <div className='spot-tile-info-first-line'>
                    <p>{spot.city}, {spot.state}</p>
                    <span className="spot-tile-stars"><i className="fa-solid fa-star"/>{spot.avgRating !== "No reviews found for this spot" ? Number(spot.avgRating).toFixed(1) : "New"}</span>
                </div>
                <p><span className='spot-tile-price'>${spot.price} per night </span></p>
            </div>
        </div>
    </>)
}

export default IndexItem;
