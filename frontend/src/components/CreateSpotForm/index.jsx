import SpotForm from "../SpotForm";
import './style.css'

const CreateASpotForm = () => {
    const spot = {
        "address": "",
        "city": "",
        "state": "",
        "country": "",
        "lat": "",
        "lng": "",
        "name": "",
        "description": "",
        "price": ""
    }

    return(
        <>
            <div className='new-spot-page'>
                <h1>Create a New Spot</h1>
                <SpotForm spot={spot} formType="create" />
            </div>
        </>
    )
}

export default CreateASpotForm;
