import IndexItem from './IndexItem';
import './style.css';

const SpotsIndex = ({ spots }) => {
    return (<div className='spot-tile-container'>
        
        {spots.map(spot => {
            return (<IndexItem key={spot.id} spot={spot} />)

        })}

    </div>)
}

export default SpotsIndex;