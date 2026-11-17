const Group = require("../models/GroupModel");
const Membership = require("../models/MembershipModel");
const {debug} = require("../utils/logger");

const createGroup = async (req: any, res: any) => {
	const {name, kind, createdBy} = req.body;
	if (!name || !createdBy || !["course", "office"].includes(kind)) {
		res.status(400).json({message: "A group needs a name, a kind of course or office, and a creator"});
		return;
	}
	try {
		const group = await Group.create({name: String(name).trim(), kind, createdBy});
		res.status(201).json({_id: group._id, name: group.name, kind: group.kind});
	} catch (err: any) {
		debug(`createGroup: ${err}`);
		res.status(500).json({message: `Error creating group: ${err}`});
	}
};

const listGroups = async (_req: any, res: any) => {
	try {
		const groups = await Group.find({}, {_id: 1, name: 1, kind: 1}).sort({name: 1});
		res.status(200).json(groups);
	} catch (err: any) {
		res.status(500).json({message: `Error listing groups: ${err}`});
	}
};

const getGroup = async (req: any, res: any) => {
	try {
		const group = await Group.findById(req.query.groupId, {_id: 1, name: 1, kind: 1});
		if (!group) {
			res.status(404).json({message: "Group not found"});
			return;
		}
		res.status(200).json(group);
	} catch (err: any) {
		res.status(500).json({message: `Error getting group: ${err}`});
	}
};

const addMembership = async (req: any, res: any) => {
	const {userId, groupId} = req.body;
	if (!userId || !groupId) {
		res.status(400).json({message: "userId and groupId are required"});
		return;
	}
	try {
		const group = await Group.findById(groupId);
		if (!group) {
			res.status(404).json({message: "Group not found"});
			return;
		}
		const membership = await Membership.findOneAndUpdate(
			{userId, groupId},
			{userId, groupId},
			{upsert: true, new: true},
		);
		res.status(200).json(membership);
	} catch (err: any) {
		res.status(500).json({message: `Error adding membership: ${err}`});
	}
};

const listMemberships = async (req: any, res: any) => {
	const {userId} = req.query;
	if (!userId) {
		res.status(400).json({message: "userId is required"});
		return;
	}
	try {
		const memberships = await Membership.find({userId}, {_id: 1, userId: 1, groupId: 1});
		res.status(200).json(memberships);
	} catch (err: any) {
		res.status(500).json({message: `Error listing memberships: ${err}`});
	}
};

module.exports = {createGroup, listGroups, getGroup, addMembership, listMemberships};
