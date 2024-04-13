document.querySelectorAll(".deleteUserForm").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const userId = formData.get("userId");

    try {
      const response = await fetch(`/admin/user/${userId}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Error updating user role");
      }

      alert("User deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  });
});
