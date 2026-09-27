import {
  createInvitation,
  getMyInvitations,
  respondToInvitation,
} from "../services/invitation.service.js";

import {
  createInvitationSchema,
  respondInvitationSchema,
} from "../validators/invitation.validator.js";

export const create = async (req, res) => {
  try {
    const body = createInvitationSchema.parse(req.body);

    const invitation = await createInvitation({
      repositoryId: req.params.repositoryId,
      ownerId: req.user.id,
      invitedUserId: body.invitedUserId,
      role: body.role,
    });

    return res.status(201).json({
      success: true,
      message: "Invitation sent successfully",
      invitation,
    });
  } catch (error) {
    console.error("Create invitation error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMine = async (req, res) => {
  try {
    const invitations = await getMyInvitations(req.user.id);

    return res.status(200).json({
      success: true,
      invitations,
    });
  } catch (error) {
    console.error("Get invitations error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const respond = async (req, res) => {
  try {
    const body = respondInvitationSchema.parse(req.body);

    const invitation = await respondToInvitation({
      invitationId: req.params.invitationId,
      userId: req.user.id,
      status: body.status,
    });

    return res.status(200).json({
      success: true,
      message:
        body.status === "ACCEPTED"
          ? "Invitation accepted"
          : "Invitation rejected",
      invitation,
    });
  } catch (error) {
    console.error("Respond invitation error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
