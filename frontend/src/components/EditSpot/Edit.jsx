import {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import {  getSpotById } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import CreateASpotForm from "../SpotForm";


const EditSpot = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const spot = useSelector(state => state.spots.singleSpot);

    useEffect(()=>{
        dispatch(getSpotById(spotId)).then(()=>setIsLoaded(true))
    }, [dispatch, spotId]);

    return (
        <div className="new-spot-page">
            <h1>Update your Spot</h1>
            {isLoaded && <CreateASpotForm spot={spot} formType="Update Spot"/>}
        </div>
    )
}

export default EditSpot;