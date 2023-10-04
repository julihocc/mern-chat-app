import React from 'react';
import md5 from 'md5';
import {useSelector} from "react-redux";

export const Gravatar = () => {
    const {email} = useSelector((state) => state.user);
    const hash = md5(email);
    const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?s=${80}`;

    return <img src={gravatarUrl} alt="User Avatar" />;
};
