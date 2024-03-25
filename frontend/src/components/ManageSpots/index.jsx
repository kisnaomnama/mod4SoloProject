import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { getCurrentUserSpots } from '../../store/spots';
import SingleSpotManage from './SingleSpotManage';

const ManageSpots = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const user = useSelector(state => state.session.user)
    const spots = useSelector(state => Object.values(state.spots.allSpots))

    useEffect(() => {
        dispatch(getCurrentUserSpots()).then(() => setIsLoaded(true));
    }, [dispatch]);

    const createANewSpotButton = (e) => {
        e.preventDefault();
        navigate('/spots/new')
    }

    return (user &&
        <div className="manage-spots-page">
            <div className="manage-spot-title-section">
                <h3 className='manage-spot-header'>Manage Spots</h3>
                <button className="create-a-new-spot-button cursor" onClick={createANewSpotButton}>Create a New Spot</button>
            </div>
            {isLoaded && (<>
            {/* {spots.length === 0 && <button className="create-a-new-spot" onClick={createANewSpotButton}>Create a New Spot</button>} */}
            <div className='spot-card-container'>
                {spots.map(spot => {
                    return (
                        <SingleSpotManage spot={spot} key={spot.id} />
                    )
                })}
            </div>
            </>)}
        </div>)
}

export default ManageSpots;
