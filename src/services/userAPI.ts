export const getAllUsers = async () => {
    const res = await fetch(`/api/users`);
    if (!res.ok) throw new Error("Erreur lors du fetch des users");
    return res.json();
};

export const getUserByEmail = async (email: string) => {
  const res = await fetch(`/api/users/${email}`);
  if (!res.ok) throw new Error("Erreur lors du fetch du user");
  return res.json();
};

export const createUser = async (userData: { name: string; email: string; password: string; role: string; class?: string, photo?: string }) => {
    const res = await fetch(`/api/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!res.ok) {
        throw new Error('Failed to create user');
    }

    return res.json();
};

export const deleteUser = async (id: string) => {
    const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        throw new Error('Failed to delete user');
    }
    return res.json();
}