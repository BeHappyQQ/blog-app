import React from "react";
import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthorProfile from "../AuthorProfile/author-profile";
import { logout } from "../../store/authSlice";
import { loadArticles } from "../../store/articlesSlice";


const defaultImageURL = 'https://static.productionready.io/images/smiley-cyrus.jpg'

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/');
    dispatch(loadArticles());
  };

  const handleEditProfile = () => {
    navigate('/profile');
  }

  if(loading) {
    return (
      <div className="header">Loading...</div>
    )
  }

  return (
      <header className="header">
        <Link to="/" className="home-button">Realworld Blog</Link>
        <div>
          {user ? (
            <div className="user-bar">
              <Link to='/new-article' className="btn btn-signup">Create article</Link>
              <div className="profile-wrapper" onClick={handleEditProfile}>
                <AuthorProfile name = {user.username} avatar = {user.image || defaultImageURL}/>
              </div>
              <button className="btn btn-logout" onClick={handleSignOut}>Log Out</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/sign-in" className="btn btn-signin">Sign in</Link>
              <Link to="sign-up" className="btn btn-signup">Sign Up</Link>
            </div>
          )}
        </div>
      </header>
    )
}

export default Header;