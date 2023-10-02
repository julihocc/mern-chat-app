import React, {useState} from 'react';

const ChangeUsername = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    return (
        <div>
            <h1>Change Username</h1>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
        </div>
    );
}
