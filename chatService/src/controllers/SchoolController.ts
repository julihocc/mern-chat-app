const ChatRoom = require("../models/ChatRoomModel");
const Message = require("../models/MessageModel");
const Document = require("../models/DocumentModel");
const Chunk = require("../models/ChunkModel");
const MarkedAnswer = require("../models/MarkedAnswerModel");
const {debug} = require("../utils/logger");
const {extractText} = require("../school/extractText");
const {chunkText, excerptsForGroup, rankExcerpts} = require("../school/knowledge");

const startSchoolRoom = async (req: any, res: any) => {
	const {studentId, groupId, body} = req.body;
	if (!studentId || !groupId || !body || !String(body).trim()) {
		res.status(400).json({message: "studentId, groupId, and body are required"});
		return;
	}
	try {
		const room = await ChatRoom.create({
			participantIds: [studentId],
			groupId,
			status: "waiting",
		});
		const message = await Message.create({
			chatRoomId: room._id,
			senderId: studentId,
			body: String(body).trim(),
		});
		room.messageIds.push(message._id);
		await room.save();
		res.status(201).json(room);
	} catch (err: any) {
		debug(`startSchoolRoom: ${err}`);
		res.status(500).json({message: `Error starting school room: ${err}`});
	}
};

const claimSchoolRoom = async (req: any, res: any) => {
	const {chatRoomId, expertId} = req.body;
	if (!chatRoomId || !expertId) {
		res.status(400).json({message: "chatRoomId and expertId are required"});
		return;
	}
	try {
		const room = await ChatRoom.findOneAndUpdate(
			{_id: chatRoomId, status: "waiting"},
			{$set: {status: "active", expertId}, $addToSet: {participantIds: expertId}},
			{new: true},
		);
		if (!room) {
			res.status(409).json({message: "This question is no longer waiting"});
			return;
		}
		res.status(200).json(room);
	} catch (err: any) {
		res.status(500).json({message: `Error taking school room: ${err}`});
	}
};

const listWaitingRooms = async (req: any, res: any) => {
	const {groupId} = req.query;
	if (!groupId) {
		res.status(400).json({message: "groupId is required"});
		return;
	}
	try {
		const rooms = await ChatRoom.find({groupId, status: "waiting"}).sort({createdAt: 1});
		const items = [];
		for (const room of rooms) {
			const first = await Message.findOne({chatRoomId: room._id}).sort({createdAt: 1});
			items.push({
				_id: room._id,
				groupId: room.groupId,
				studentId: room.participantIds[0],
				question: first ? first.body : "",
			});
		}
		res.status(200).json(items);
	} catch (err: any) {
		res.status(500).json({message: `Error listing waiting rooms: ${err}`});
	}
};

const getMessage = async (req: any, res: any) => {
	try {
		const message = await Message.findById(req.query.messageId);
		if (!message) {
			res.status(404).json({message: "Message not found"});
			return;
		}
		res.status(200).json(message);
	} catch (err: any) {
		res.status(500).json({message: `Error getting message: ${err}`});
	}
};

const saveDocument = async (req: any, res: any) => {
	const {filename, scope, groupId, file, uploadedBy} = req.body;
	if (!filename || !uploadedBy || !["group", "school"].includes(scope)) {
		res.status(400).json({message: "filename, scope, and uploadedBy are required"});
		return;
	}
	if (scope === "group" && !groupId) {
		res.status(400).json({message: "A group document needs a groupId"});
		return;
	}
	try {
		const text = await extractText(filename, file);
		const pieces = chunkText(text);
		if (!pieces.length) {
			res.status(400).json({message: "No text could be read from this file"});
			return;
		}
		const document = await Document.create({
			filename,
			scope,
			groupId: scope === "group" ? groupId : null,
			uploadedBy,
		});
		await Chunk.insertMany(pieces.map((piece: string) => ({
			documentId: document._id,
			scope,
			groupId: scope === "group" ? groupId : null,
			text: piece,
		})));
		res.status(201).json({_id: document._id, filename: document.filename});
	} catch (err: any) {
		res.status(400).json({message: err.message || `Error saving document: ${err}`});
	}
};

const searchKnowledge = async (req: any, res: any) => {
	const {groupId, q} = req.query;
	if (!groupId || !q) {
		res.status(400).json({message: "groupId and q are required"});
		return;
	}
	try {
		const chunks = await Chunk.find({
			$or: [{scope: "school"}, {scope: "group", groupId}],
		});
		const marked = await MarkedAnswer.find({groupId});
		const excerpts = rankExcerpts(q, excerptsForGroup(groupId, chunks, marked));
		res.status(200).json(excerpts);
	} catch (err: any) {
		res.status(500).json({message: `Error searching knowledge: ${err}`});
	}
};

const saveMarkedAnswer = async (req: any, res: any) => {
	const {groupId, questionText, answerText, messageId, markedBy} = req.body;
	if (!groupId || !questionText || !answerText || !messageId || !markedBy) {
		res.status(400).json({message: "A marked answer needs a group, question, answer, message, and expert"});
		return;
	}
	try {
		const saved = await MarkedAnswer.findOneAndUpdate(
			{messageId},
			{groupId, questionText, answerText, messageId, markedBy},
			{upsert: true, new: true},
		);
		res.status(200).json(saved);
	} catch (err: any) {
		res.status(500).json({message: `Error saving marked answer: ${err}`});
	}
};

module.exports = {
	startSchoolRoom,
	claimSchoolRoom,
	listWaitingRooms,
	getMessage,
	saveDocument,
	searchKnowledge,
	saveMarkedAnswer,
};
