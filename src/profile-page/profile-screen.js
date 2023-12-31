import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation} from 'react-router-dom';
import { fetchProfile, updateProfile } from '../services/auth-thunks';
import { useNavigate } from "react-router";
import { logout } from "../services/auth-thunks";
import "./profile-screen.css";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.currentUser);
  const viewedProfile = useSelector(state => state.user.viewedProfile);
 // Get deletedReviews from Redux store
  const [editableProfile, setEditableProfile] = useState({});
  const { profileId } = useParams();
  const location = useLocation();
  const fromDetails = location.state?.fromDetails;
  const reduxReviews = useSelector(state => state.details.reviews); 
  const reviews = fromDetails
  ? profileId
    ? reduxReviews
    : user.reviews
  : reduxReviews;
  const deletedReviews = useSelector(state => state.details.deletedReviews);
  const id = user._id;
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const viewOnly = profileId && profileId !== id;

  useEffect(() => {
    if (profileId) {
      console.log("Dispatching fetchProfile with profileId:", profileId);
      dispatch(fetchProfile(profileId));
    } else {
      console.log("No profileId provided.");
    }
  }, [profileId, dispatch]);

  useEffect(() => {
    setEditableProfile(user);
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableProfile({
      ...editableProfile,
      [name]: value,
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Editable Profile: ', editableProfile);
    dispatch(updateProfile({id, profileUpdate: editableProfile}));
  };

  const handleBackClick = () => {
    navigate(-1); // Go back one step in the history
  };

  const profile = viewOnly ? viewedProfile : user;
  console.log("profile here", profile);

  const reviewList = user.role === 'administrator' ? deletedReviews : reviews;
  const filteredReviews = reviewList.filter(review =>
    review.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

 return (
  <div className="profile-container">
    <h1 className="welcome-message">{viewOnly ? `${profile?.username}'s Profile` : 'Profile Screen'}</h1>
    {viewOnly && <button className="back-button" onClick={handleBackClick}>Back</button>}
    {profile ? (
      <div className="profile-content">
        <div className="user-details">
          <h2>
            {viewOnly
              ? viewedProfile
                ? `${viewedProfile.username}'s Profile`
                : "Loading..."
              : user
              ? `Welcome, ${user.username}`
              : "Loading..."}
          </h2>
          {!viewOnly && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="text"
                  name="email"
                  value={editableProfile.email || ''}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={editableProfile.phone || ''}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              <button
                onClick={() => {
                  dispatch(logout());
                  navigate("/login");
                }}
                className="button-logout"
              >
                Logout
              </button>
              <button type="submit" className="button-save">Save Changes</button>
            </form>
          )}
        </div>
        <div className="reviews-section">
          <div>
            <label>Search posts:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="input-field"
            />
          </div>
          {searchTerm && (
            <div className="scrollable-container">
              <ul className="reviews-list">
                {filteredReviews.map((review, index) => (
                  <li key={index} className="review-item">
                    <p>{review.content}</p>
                    <p>Stars: {'⭐'.repeat(review.stars)}</p>
                    <p>Date: {new Date(review.timestamp).toLocaleDateString()}</p>
                    {review.location_id && (
                      <p>
                        Location:
                        <a href={`/details/${review.location_id}`}>
                          {review.location_id}
                        </a>
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    ) : (
      <p>Loading...</p>
    )}
  </div>
);
};

export default ProfileScreen;