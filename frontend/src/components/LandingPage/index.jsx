import {useState, useEffect} from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { populateSpots } from '../../store/spots';
import SpotsIndex from '../SpotsIndex';
import './style.css';

const LandingPage = () =>  {
    const dispatch = useDispatch();
    
    const spots = useSelector(state => Object.values(state.spots.allSpots))
  
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(populateSpots());
        setIsLoaded(true);
    }, [dispatch])

    
    return (isLoaded &&
        <>
            <div className="landing-page">               
                <SpotsIndex spots={spots} className='spot-tile'/> 
            </div>
        </>)
}

export default LandingPage;
