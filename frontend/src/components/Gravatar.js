import React from 'react';
import md5 from 'md5';

export const Gravatar = ({ email, size = 80 }) => {
    const hash = md5(email);
    const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?s=${size}`;

    return <img src={gravatarUrl} alt="User Avatar" />;
};
