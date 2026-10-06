import {
  createRepository,
  getMyRepositories,
  getRepositoryById,
  updateRepository,
  deleteRepository,
} from "../services/repository.service.js";

import {
  createRepositorySchema,
  updateRepositorySchema,
} from "../validators/repository.validator.js";

export const create = async (req, res) => {
  try {
    const body = createRepositorySchema.parse(req.body);

    const repository = await createRepository({
      ownerId: req.user.id,
      ...body,
    });

    return res.status(201).json({
      success: true,
      message: "Repository created successfully",
      repository,
    });
  } catch (error) {
    console.error("Create repository error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMine = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(Math.max(Number(req.query.limit) || 6, 1), 50);

    const result = await getMyRepositories(req.user.id, page, limit);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Get repositories error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const repository = await getRepositoryById(
      req.params.repositoryId,
      req.user.id,
    );

    return res.status(200).json({
      success: true,
      repository,
    });
  } catch (error) {
    console.error("Get repository error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const updates = updateRepositorySchema.parse(req.body);

    const repository = await updateRepository(
      req.params.repositoryId,
      req.user.id,
      updates,
    );

    return res.status(200).json({
      success: true,
      message: "Repository updated successfully",
      repository,
    });
  } catch (error) {
    console.error("Update repository error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    await deleteRepository(req.params.repositoryId, req.user.id);

    return res.status(200).json({
      success: true,
      message: "Repository deleted successfully",
    });
  } catch (error) {
    console.error("Delete repository error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
