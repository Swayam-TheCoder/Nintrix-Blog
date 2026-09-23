    const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const createRepository = async ({
  userId,
  name,
  description,
  visibility
}) => {
  const slug = generateSlug(name);

  const { data: repository, error: repositoryError } = await supabase
    .from("repositories")
    .insert({
      owner_id: userId,
      name,
      slug,
      description: description || null,
      visibility
    })
    .select()
    .single();

  if (repositoryError) {
    throw new Error(repositoryError.message);
  }

  const { error: memberError } = await supabase
    .from("repository_members")
    .insert({
      repository_id: repository.id,
      user_id: userId,
      role: "OWNER"
    });

  if (memberError) {
    // Cleanup repository if member creation fails
    await supabase
      .from("repositories")
      .delete()
      .eq("id", repository.id);

    throw new Error(memberError.message);
  }

  return repository;
};

export const getUserRepositories = async (userId) => {
  const { data, error } = await supabase
    .from("repository_members")
    .select(`
      role,
      repositories (
        id,
        owner_id,
        name,
        slug,
        description,
        visibility,
        created_at,
        updated_at
      )
    `)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getRepositoryById = async (repositoryId) => {
  const { data, error } = await supabase
    .from("repositories")
    .select(`
      id,
      owner_id,
      name,
      slug,
      description,
      visibility,
      created_at,
      updated_at
    `)
    .eq("id", repositoryId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateRepository = async ({
  repositoryId,
  name,
  description,
  visibility
}) => {
  const updates = {};

  if (name !== undefined) {
    updates.name = name;
    updates.slug = generateSlug(name);
  }

  if (description !== undefined) {
    updates.description = description;
  }

  if (visibility !== undefined) {
    updates.visibility = visibility;
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("repositories")
    .update(updates)
    .eq("id", repositoryId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteRepository = async (repositoryId) => {
  const { error } = await supabase
    .from("repositories")
    .delete()
    .eq("id", repositoryId);

  if (error) {
    throw new Error(error.message);
  }
};