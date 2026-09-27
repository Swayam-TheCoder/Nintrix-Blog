import { supabaseAdmin } from "../config/supabase.js";

export const requireRepositoryAccess = async (
  req,
  res,
  next
) => {
  try {
    const { repositoryId } = req.params;

    if (!repositoryId) {
      return res.status(400).json({
        success: false,
        message: "Repository ID is required"
      });
    }

    const { data: repository, error } =
      await supabaseAdmin
        .from("repositories")
        .select("id, owner_id, visibility")
        .eq("id", repositoryId)
        .single();

    if (error || !repository) {
      return res.status(404).json({
        success: false,
        message: "Repository not found"
      });
    }

    // Owner always has access
    if (repository.owner_id === req.user.id) {
      req.repository = repository;
      req.repositoryRole = "OWNER";

      return next();
    }

    // Public repositories are readable
    if (repository.visibility === "PUBLIC") {
      req.repository = repository;
      req.repositoryRole = "PUBLIC";

      return next();
    }

    // Check membership
    const { data: member, error: memberError } =
      await supabaseAdmin
        .from("repository_members")
        .select("role")
        .eq("repository_id", repositoryId)
        .eq("user_id", req.user.id)
        .maybeSingle();

    if (memberError) {
      console.error(
        "Repository membership error:",
        memberError
      );

      return res.status(500).json({
        success: false,
        message: "Failed to verify repository access"
      });
    }

    if (!member) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this repository"
      });
    }

    req.repository = repository;
    req.repositoryRole = member.role;

    next();
  } catch (error) {
    console.error(
      "Repository access middleware error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to verify repository access"
    });
  }
};

export const requireRepositoryRole = (
  ...allowedRoles
) => {
  return (req, res, next) => {
    const role = req.repositoryRole;

    if (!role) {
      return res.status(403).json({
        success: false,
        message: "Repository access is required"
      });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission for this action"
      });
    }

    next();
  };
};