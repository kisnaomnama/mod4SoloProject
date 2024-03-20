import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './SpotForm.css'


const SpotForm = ({ spot, formType }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [address, setAddress] = useState(spot.address);
    const [city, setCity] = useState(spot.city);
    const [state, setState] = useState(spot.state);
    const [country, setCountry] = useState(spot.country);
    const [lat, setLat] = useState(spot.lat);
    const [lng, setLng] = useState(spot.lng);
    const [name, setName] = useState(spot.name);
    const [description, setDescription] = useState(spot.description);
    const [price, setPrice] = useState(spot.price);
    const [errors, setErrors] = useState({});
    const [imgURLPreview, setIMGURLPreview] = useState('');
    const [img1, setImg1] = useState('');
    const [img2, setImg2] = useState('');
    const [img3, setImg3] = useState('');
    const [img4, setImg4] = useState('');
    const buttonText = formType === "create" ? "Create spot" : "Update Spot"

    function validImage(img) {
        return (img.endsWith(".png") || img.endsWith(".jpg") || img.endsWith(".jpeg"))
    }

    const checkErrors = () => {
        const errObj = {};

        if (!country) {
            errObj.country = "Country is required"
        }

        if (!address) {
            errObj.address = "Address is required"
        }

        if (!city) {
            errObj.city = "City is required"
        }

        if (!state) {
            errObj.state = "State is required"
        }

        if (!lat) {
            errObj.lat = "Latitude is required"
        }

        if (!lng) {
            errObj.lng = "Longitude is required"
        }

        if (description.length < 29) {
            errObj.description = "Description needs a minimum of 30 characters"
        }

        if (!name) {
            errObj.name = "Name is required"
        }

        if (!price) {
            errObj.price = "Price is required"
        }

        if (formType === "create") {
            if (!imgURLPreview) {
                errObj.imgURLPreviewReqd = "Preview image is required."
            }

            if (imgURLPreview.length > 0 && !validImage(imgURLPreview)) {
                errObj.imgURLPreviewNotValid = "Image URL must end in .png, .jpg, or .jpeg"
            }

            if (img1.length > 0 && !validImage(img1)) {
                errObj.img1 = "Image URL must end in .png, .jpg, or .jpeg"
            }

            if (img2.length > 0 && !validImage(img2)) {
                errObj.img2 = "Image URL must end in .png, .jpg, or .jpeg"
            }

            if (img3.length > 0 && !validImage(img3)) {
                errObj.img3 = "Image URL must end in .png, .jpg, or .jpeg"
            }

            if (img4.length > 0 && !validImage(img4)) {
                errObj.img4 = "Image URL must end in .png, .jpg, or .jpeg"
            }
        }

        if (Object.values(errObj).length > 0) {
            setErrors(errObj);
            return false;
        } else {
            return true;
        }
    }


    const onSubmit = async (e) => {
        e.preventDefault();
        if (checkErrors()) {
            const newSpot = { country, address, city, state, lat, lng, description, name, price };
            if (formType === "create") {
                const response = await dispatch(createANewSpot(newSpot));
                if (response.ok) {
                    const data = await response.json();
                    const spotId = data.id;
                    imgURLPreview ? await dispatch(addImageToASpot(spotId, { url: imgURLPreview, preview: true })) : null;
                    img1 ? await dispatch(addImageToASpot(spotId, { url: img1, preview: false })) : null;
                    img2 ? await dispatch(addImageToASpot(spotId, { url: img2, preview: false })) : null;
                    img3 ? await dispatch(addImageToASpot(spotId, { url: img3, preview: false })) : null;
                    img4 ? await dispatch(addImageToASpot(spotId, { url: img4, preview: false })) : null;
                    navigate(`/spots/${spotId}`);
                }
            } else {
                const response = await dispatch(editASpot(spot.id, newSpot))
                if (response.ok) {
                    navigate(`/spots/${spot.id}`);
                }
            }
        }
    }

    return (
        <form className="new-spot-page">
            <span className="new-spot-section">
                <div className="new-spot-form-header">
                </div>
                Country {<span className="spot-form-error">{errors.country}</span>}
                <br />
                <input
                    className="single-input-field"
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                />
                <br />
                <br />
                Street Address {<span className="spot-form-error">{errors.address}</span>}
                <input
                    className="single-input-field"
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <br />
                <br />
                <div className="double-input-field">
                    <div className="row-header">
                        City
                        {<div className="spot-form-error">{errors.city}</div>}
                    </div>
                    <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <div className="row-header">
                        State
                        {<span className="spot-form-error">{errors.state}</span>}
                    </div>
                    <input
                        type="text"
                        placeholder="STATE"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                    <br />
                </div>
                <br />
                <br />
                <div className="double-input-field">
                    <div className="row-header">
                        Latitude
                        {<span className="spot-form-error">{errors.lat}</span>}
                    </div>
                    <input
                        type="text"
                        placeholder="Latitude"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                    />
                    <div className="row-header">
                        Longitude
                        {<span className="spot-form-error">{errors.lng}</span>}
                    </div>
                    <input
                        type="text"
                        placeholder="Longitude"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                    />

                </div>
            </span>
            <span className="new-spot-section">
                <div className="new-spot-form-header">
                    <h2>Describe your place to guests</h2>
                </div>
                <textarea
                    className="large-input-field"
                    type="text"
                    placeholder="Please write at least 30 characters"
                    maxLength="500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {<p className="spot-form-error">{errors.description}</p>}
            </span>
            <span className="new-spot-section">
                <div className="new-spot-form-header">
                    <h2>Create a title for your spot</h2>
                </div>

                <input
                    className="single-input-field"
                    type="text"
                    value={name}
                    placeholder="Name of your spot"
                    onChange={(e) => setName(e.target.value)}
                />
                {<p className="spot-form-error">{errors.name}</p>}
                <br />

            </span>
            <span className="new-spot-section">
                <h2>Set a base price for your spot</h2>
                $ <input
                    className="single-input-field"
                    type="number"
                    value={price}
                    placeholder="Price per night (USD)"
                    onChange={(e) => setPrice(e.target.value)}
                />
                {<p className="spot-form-error">{errors.price}</p>}
                <br />

            </span>
            {formType === "create" &&
                (<div className="new-spot-section">
                <div className="new-spot-form-header">
                    <h2>Upload the photos</h2>
                </div>
                    <input
                        className="single-input-field"
                        type="text"
                        value={imgURLPreview}
                        placeholder="Preview Image URL"
                        onChange={(e) => setIMGURLPreview(e.target.value)}
                    />
                    {<p className="spot-form-error">{errors.imgURLPreviewReqd}</p>}
                    {<p className="spot-form-error">{errors.imgURLPreviewNotValid}</p>}
                    <br />
                    <input
                        className="single-input-field"
                        type="text"
                        value={img1}
                        placeholder="Image URL"
                        onChange={(e) => setImg1(e.target.value)}
                    />
                    {<p className="spot-form-error">{errors.img1}</p>}
                    <br />
                    <input
                        className="single-input-field"
                        type="text"
                        value={img2}
                        placeholder="Image URL"
                        onChange={(e) => setImg2(e.target.value)}
                    />
                    {<p className="spot-form-error">{errors.img2}</p>}
                    <br />
                    <input
                        className="single-input-field"
                        type="text"
                        value={img3}
                        placeholder="Image URL"
                        onChange={(e) => setImg3(e.target.value)}
                    />
                    {<p className="spot-form-error">{errors.img3}</p>}
                    <br />
                    <input
                        className="single-input-field"
                        type="text"
                        value={img4}
                        placeholder="Image URL"
                        onChange={(e) => setImg4(e.target.value)}
                    />
                    {<p className="spot-form-error">{errors.img4}</p>}
                    <br /> 
            </div>)}
            <button className="spot-page-button cursor" onClick={onSubmit}>{buttonText}</button>
        </form>
    )
}

export default SpotForm;
