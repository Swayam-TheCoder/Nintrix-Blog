import {
  getProfileByUserId,
  searchProfiles,
  updateProfile
} from "../services/profile.service.js";

import { searchProfileSchema, updateProfileSchema } from "../validators/profile.validator.js";

export const getMyProfile = async (req, res) => {
  try {
    const profile = await getProfileByUserId(req.user.id);

    return res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(404).json({
      success: false,
      message: "Profile not found"
    });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const updates = updateProfileSchema.parse(req.body);

    const profile = await updateProfile(
      req.user.id,
      updates
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


export const searchUsers = async (req, res) => {
  try {
    const { q } = searchProfileSchema.parse(req.query);

    const profiles = await searchProfiles(q, req.user.id);

    return res.status(200).json({
      success: true,
      count: profiles.length,
      profiles
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
