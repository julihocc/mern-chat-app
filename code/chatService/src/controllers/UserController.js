const {debug} = require("../utils/logger");
const User = require('../models/UserModel');

const createUser = async (req, res) => {
	debug("createUser");
    const {_id, email, username} = req.body;
    debug(`_id: ${_id}`);
    debug(`email: ${email}`);
    debug(`username: ${username}`);
    try {
        const user = await User.create({_id, email, username});
        await user.save();
        res.json(user);
        res.status(200);
        return user;
    } catch (err) {
        res.status(500).json({
            message: `Error creating user: ${err}`
        })
    }
}

const updateUser = async (req, res) => {
    debug("updateUser");
    const {username, newUsername} = req.body;
    debug(`username: ${username}`);
    debug(`newUsername: ${newUsername}`);

    if(username&&newUsername) {
        debug(`Changing username: ${username} to ${newUsername}`);
        try{
            await User.updateOne({username}, {$set: {username: newUsername}});
            const user = await User.findOne({username: newUsername});
            debug(`Updated user: ${JSON.stringify(user)}`);

            res.json(user);
            return user;
        } catch (error) {
            res.status(500).json({message: `updateUser error: ${error}`});
        }
    }
}

module.exports = {
    createUser,
    updateUser
}