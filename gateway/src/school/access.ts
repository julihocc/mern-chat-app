function sameId(left: any, right: any) {
	if (left == null || right == null) {
		return false;
	}
	const leftId = left._id || left;
	const rightId = right._id || right;
	return String(leftId) === String(rightId);
}

function isExpertOf(viewer: any, groupId: any) {
	return Array.isArray(viewer.expertGroupIds) && viewer.expertGroupIds.some((id: any) => sameId(id, groupId));
}

function isBootstrapExpert(viewer: any, bootstrapEmail: any) {
	if (!bootstrapEmail || !viewer.email) {
		return false;
	}
	return String(viewer.email).trim().toLowerCase() === String(bootstrapEmail).trim().toLowerCase();
}

function canCreateGroup(viewer: any, bootstrapEmail: any) {
	return isBootstrapExpert(viewer, bootstrapEmail) || (viewer.expertGroupIds || []).length > 0;
}

function canAddExpert(viewer: any, groupId: any) {
	return isExpertOf(viewer, groupId);
}

function canUploadGroupDocument(viewer: any, groupId: any) {
	return isExpertOf(viewer, groupId);
}

function canUploadSchoolDocument(viewer: any) {
	return (viewer.expertGroupIds || []).length > 0;
}

function canSeeWaiting(viewer: any, groupId: any) {
	return isExpertOf(viewer, groupId);
}

function canTake(viewer: any, groupId: any, status: any) {
	return status === "waiting" && isExpertOf(viewer, groupId);
}

function canReadRoom(viewer: any, participantIds: any) {
	return Array.isArray(participantIds) && participantIds.some((id: any) => sameId(id, viewer.userId));
}

function canProposeReply(viewer: any, room: any) {
	if (!room || room.status !== "active" || !room.groupId) {
		return false;
	}
	return sameId(room.expertId, viewer.userId) && canReadRoom(viewer, room.participantIds);
}

function canMark(viewer: any, senderId: any) {
	return sameId(senderId, viewer.userId);
}

module.exports = {
	canCreateGroup,
	canAddExpert,
	canUploadGroupDocument,
	canUploadSchoolDocument,
	canSeeWaiting,
	canTake,
	canReadRoom,
	canProposeReply,
	canMark,
};
