document.querySelectorAll(".addToCartForm").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const productId = formData.get("productId");
    const quantity = formData.get("quantity");

    try {
      const response = await fetch("/api/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Error updating user role");
      }

      alert("Producto agregado");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  });
});
