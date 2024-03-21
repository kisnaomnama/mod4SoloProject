import { csrfFetch } from "./csrf";

const AllSPOTS = "spots/AllSPOTS";
const SINGLESPOT = "spots/SINGLESPOT"
const USERSPOTS = "spots/USERSPOTS"

//Action Creators

// Populate with spots
const populate = (spots) => {
    return {
        type: AllSPOTS,
        payload: spots
    }
};

//Set spot by id
const setSpotById = (spot) => {
    return {
        type: SINGLESPOT,
        payload: spot
    }
}

//All spots by user
const allSpotsByUser = (spots) => {
    return {
        type: USERSPOTS,
        payload: spots
    }
}

//Thunk
export const populateSpots = () => async (dispatch) => {
    const response = await csrfFetch(`/api/spots`);

    if (response.ok) {
        const allSpots = await response.json();
        dispatch(populate(allSpots.Spots))
    }

    return response;
}
//Get a spot by ID
export const getSpotById = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(setSpotById(data))
    }
    return response;
}
//Create a new spot
export const createANewSpot = (spot) => async () => {
    const response = await csrfFetch('/api/spots', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "XSRF-Token": "XSRF-Token"
        },
        body: JSON.stringify(spot)
    })
    return response;
}

//Add an image to a spot
export const addImageToASpot = (spotId, imageURL) => async () => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "XSRF-Token": "XSRF-Token"
        },
        body: JSON.stringify(imageURL)
    })
    return response;
}

//Get spots by current user
export const getCurrentUserSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current');
    if(response.ok){
        const data = await response.json();
        dispatch(allSpotsByUser(data));
    }
    return response;
}

//Edit a spot
export const editASpot = (spotId, spot) => async () => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "XSRF-Token": "XSRF-Token",
        },
        body: JSON.stringify(spot)
    });

    return response;
}

export const deleteSpotById = (spotId) => async () => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE"
    });
    return response;
}

//Reducer
const initialState = {
    allSpots: {},
    singleSpot: {},
}

export default function spotReducer(state = initialState, action) {
    switch (action.type) {
        case AllSPOTS: {
            const newState = { ...state };
            const allSpots = {};
            action.payload.forEach(spot => {
                allSpots[spot.id] = { ...spot }
            })
            newState.allSpots = allSpots;
            return newState;
        }
        case SINGLESPOT: {
            const newState = { ...state };
            const singleSpot = { ...action.payload };
            newState.singleSpot = singleSpot;
            return newState;
        }
        case USERSPOTS: {
            const userOwnedSpots = {...action.payload.Spots};
            const allSpots = Object.values(userOwnedSpots);
            const userOwnedSpotsObj = {};
            allSpots.forEach((spot) => (userOwnedSpotsObj[spot.id] = spot))
            return {
                ...state,
                allSpots: userOwnedSpotsObj
            }
        }
        default: {
            return state
        }
    }
}
