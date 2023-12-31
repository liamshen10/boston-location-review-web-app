import axios from 'axios';
const apiBaseURL = process.env.REACT_APP_API_BASE;
const api = axios.create({
    baseURL: apiBaseURL,
    withCredentials: true
});

export const fetchDetailsApi = async (uniqueIdentifier) => {
    const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${uniqueIdentifier}.json?access_token=${process.env.REACT_APP_MAPBOX_API_KEY}`);
    return response.data.features[0];
};

export const fetchReviewsApi = async (uniqueIdentifier) => {
    const response = await api.get(`/reviews/${uniqueIdentifier}`);
    console.log('Fetch response', response.data);
    return response.data;
};

export const addReviewApi = async (review) => {
    const response = await api.post("/reviews", review);
    return response.data;
};


export const getReviewByIdApi = async (reviewId) => {
    const response = await api.get(`/review/${reviewId}`);
    console.log("API response data:", response.data);
    return response.data;
  };

  export const deleteReviewApi = async (reviewId, adminId) => {
    console.log("deleteReviewApi called with ID:", reviewId);
    const response = await api.delete(`/review/${reviewId}`, {
      data: { adminId: adminId }
    });
    console.log('Deleted Review: ', response.data.deletedReview);
    return { _id: reviewId, deletedReview: response.data.deletedReview };
  };
  
export const fetchDeletedReviewsByIdApi = async (userId) => {
    try {
        console.log("userid", userId);
      const response = await api.get(`/review/reviews_deleted/${userId}`);
      console.log("fetching on home screnn:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching deleted reviews:", error);
      throw error;
    }
  };
  
  
  export const fetchDeletedReviewsApi = async () => {
    const response = await api.get("/deletedReviews");
    return response.data;
  };

  