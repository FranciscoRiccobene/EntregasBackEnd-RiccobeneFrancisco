document.querySelectorAll(".editUserRoleForm").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const userId = formData.get("userId");
    const userRole = formData.get("userRole");
    const newRole = userRole === "user" ? "premium" : "user";

    try {
      const response = await fetch(`/admin/user/${userId}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newRole }),
      });

      if (!response.ok) {
        throw new Error("Error updating user role");
      }

      alert("Role updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating user role");
    }
  });
});
