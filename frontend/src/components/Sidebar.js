import React from 'react';
import Drawer from '@mui/material/Drawer';
import ChatRoomList from './ChatRoomList';
import {Gravatar} from "./Gravatar";
import {ContactListWithChatRoom} from "./ContactListWithChatRoom";
import {Link} from "react-router-dom";
import {Typography} from "@mui/material";
import {useTranslation} from 'react-i18next';

export const Sidebar = () => {
    const {t} = useTranslation();
    return (
        <div>

        <Drawer
            variant="permanent"
            anchor="left"
            style={{ width: '240px' }}
            PaperProps={{ style: { width: '240px' } }}
        >
            <Gravatar/>
            <Link to="/settings">
                <Typography variant="h3">{t('settings')}</Typography>
            </Link>
            <ChatRoomList/>
            <ContactListWithChatRoom/>
        </Drawer>
        </div>
    );
}
