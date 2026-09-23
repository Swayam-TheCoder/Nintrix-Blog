import {
  createRepository,
  getUserRepositories,
  getRepositoryById,
  updateRepository,
  deleteRepository
} from "../services/repository.service.js";

import {
  createRepositorySchema,
  updateRepositorySchema
} from "../validators/repository.validator.js";

export const create = async (req, res) => {
  try {
    const validatedData = createRepositorySchema.parse(req.body);

    const repository = await createRepository({
      userId: req.user.id,
      ...validatedData
    });

    return res.status(201).json({
      success: true,
      message: "Repository created successfully",
      repository
    });
  } catch (error) {
    console.error("Create repository error:", error);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getMine = async (req, res) => {
  try {
    const repositories = await getUserRepositories(req.user.id);

    return res.status(200).json({
      success: true,
      repositories
    });
  } catch (error) {
    console.error("Get repositories error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch repositories"
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const repository = await getRepositoryById(
      req.params.repositoryId
    );

    return res.status(200).json({
      success: true,
      repository
    });
  } catch (error) {
    console.error("Get repository error:", error);

    return res.status(404).json({
      success: false,
      message: "Repository not found"
    });
  }
};

export const update = async (req, res) => {
  try {
    const validatedData = updateRepositorySchema.parse(req.body);

    const repository = await updateRepository({
      repositoryId: req.params.repositoryId,
      ...validatedData
    });

    return res.status(200).json({
      success: true,
      message: "Repository updated successfully",
      repository
    });
  } catch (error) {
    console.error("Update repository error:", error);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const remove = async (req, res) => {
  try {
    await deleteRepository(req.params.repositoryId);

    return res.status(200).json({
      success: true,
      message: "Repository deleted successfully"
    });
  } catch (error) {
    console.error("Delete repository error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete repository"
    });
  }
};