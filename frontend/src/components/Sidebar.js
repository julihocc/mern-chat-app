import React from 'react';
import Drawer from '@mui/material/Drawer';
import ChatRoomList from './ChatRoomList';
import {ContactListWithFullDetails} from "./ContactListWithFullDetails";
import {Gravatar} from "./Gravatar";

export const Sidebar = () => {
    return (
        <Drawer
            variant="permanent"
            anchor="left"
            style={{ width: '240px' }}
            PaperProps={{ style: { width: '240px' } }}
        >
            <Gravatar/>
            <ChatRoomList/>
            <ContactListWithFullDetails/>
        </Drawer>
    );
}
