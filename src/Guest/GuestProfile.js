import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
function GuestProfile() {

    return (
        <>
        <div className='profileContentOuter'>
                <p className='contentTitle'>Profile</p>
                <div className="profileHeader">
                        <div className='profileHeaderImgDiv'>
                                <p className='guestProfileImg'>
                                        <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                                </p>
                        </div>
                        <div className="profileInfo">
                                <p className="title">Guest</p>
                                <p className="subtitle">0 followers</p>
                        </div>
                </div>

        </div>
        </>
    );
}

export default GuestProfile;