import { csrfFetch } from "./csrf";

const ALL_REVIEWS = "reviews/ALL_REVIEWS";
const GET_USER = "reviews/GETUSER"

const populateReviews = (reviews) => {
    return {
        type: ALL_REVIEWS,
        payload: reviews
    }
}

const getUser = (reviews) => {
    return {
        type: GET_USER,
        payload: reviews
    }
}

export const createReview = (spotId, review) => async () => {
    const request = await csrfFetch (`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "XSRF-Token": "XSRF-TOKEN"
        },
        body: JSON.stringify(review)
    })
    return request;
}

export const populateReviewsInAGivenSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
    if(response.ok){
        const data = await response.json();
        dispatch(populateReviews(data.Reviews))
    }
    return response;
}

export const editReview = (reviewId, review) => async () => {
    const response = await csrfFetch (`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "XSRF-Token": "XSRF-TOKEN"
        },
        body: JSON.stringify(review),
    })
    return response;
}

export const getAllReviewsOfUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/reviews/current")
    if(response.ok){
        const result = await response.json();
        dispatch(getUser(result.Reviews))
    }
    return response;
}

export const deleteReview = (reviewId) => async () => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
            "XSRF-Token": "XSRF-TOKEN",
        }
    })

    return response;
}

const initialState = {
    spot: {},
    user: {}
}

export default function reviewReducer(state = initialState, action){
    switch(action.type){
        case ALL_REVIEWS: {
            const newState = {...state};
            const spot = {};
            action.payload.forEach(review => {
                spot[review.id] = review;
            })
            newState.spot = spot;
            return newState;
        }
        case GET_USER: {
            const newState = {...state};
            const user = {};
            action.payload.forEach(review => {
                user[review.id] = review;
            })
            newState.user = user;
            return newState;
        }
        default:
            return state;
    }
}
