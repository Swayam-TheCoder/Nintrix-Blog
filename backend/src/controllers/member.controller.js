import {
  addMember,
  getMembers,
  updateMemberRole,
  removeMember
} from "../services/member.service.js";

import {
  addMemberSchema,
  updateMemberRoleSchema
} from "../validators/member.validator.js";

export const createMember = async (req, res) => {
  try {
    const body = addMemberSchema.parse(req.body);

    const member = await addMember({
      repositoryId: req.params.repositoryId,
      ownerId: req.user.id,
      ...body
    });

    return res.status(201).json({
      success: true,
      message: "Member added successfully",
      member
    });
  } catch (error) {
    console.error("Add member error:", error);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const listMembers = async (req, res) => {
  try {
    const members = await getMembers(
      req.params.repositoryId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      members
    });
  } catch (error) {
    console.error("Get members error:", error);

    return res.status(403).json({
      success: false,
      message: error.message
    });
  }
};

export const changeMemberRole = async (req, res) => {
  try {
    const { role } = updateMemberRoleSchema.parse(
      req.body
    );

    const member = await updateMemberRole({
      repositoryId: req.params.repositoryId,
      ownerId: req.user.id,
      memberId: req.params.memberId,
      role
    });

    return res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      member
    });
  } catch (error) {
    console.error("Update member role error:", error);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteMember = async (req, res) => {
  try {
    await removeMember({
      repositoryId: req.params.repositoryId,
      ownerId: req.user.id,
      memberId: req.params.memberId
    });

    return res.status(200).json({
      success: true,
      message: "Member removed successfully"
    });
  } catch (error) {
    console.error("Remove member error:", error);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};