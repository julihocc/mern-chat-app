import React from 'react';
import md5 from 'md5';
import {useSelector} from "react-redux";
import logger from "../utils/logger";

// export const Gravatar = () => {
//     const {email} = useSelector((state) => state.user);
//     const hash = md5(email);
//     const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?s=${80}`;
//
//     return <img src={gravatarUrl} alt="User Avatar" />;
// };
export const Gravatar = () => {
    const {email} = useSelector((state) => state.user);
    if (!email) {
        // return <div>No Email</div>;
        logger.debug(`No Email`);
    }
    try {
        const hash = md5(email);
        const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?s=${80}`;
        return <img src={gravatarUrl} alt="User Avatar"/>;
    } catch {
        return <div>Error generating Gravatar</div>;
        logger.debug(`Error generating Gravatar`);
    }
};
