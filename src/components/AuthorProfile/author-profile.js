import React from "react";
import './author-profile.css';

const AuthorProfile = ({ name, avatar, date }) => {

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div className="author-profile">
            <div className="author-info">
                <span className="author-name">{name}</span>
                {date ? (
                    <span className="author-date">{formattedDate}</span>
                ) : (
                    <></>
                )}
            </div>
            <img src={avatar} alt={name} className="author-avatar" />
        </div>
    );
}

export default AuthorProfile;