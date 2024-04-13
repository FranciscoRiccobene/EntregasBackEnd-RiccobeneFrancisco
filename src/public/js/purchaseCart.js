const form = document.getElementById("purchaseForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const cartId = formData.get("cartId");

  try {
    const response = await fetch(`/api/carts/${cartId}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartId }),
    });

    const data = await response.json();

    if (data.productsNotPurchased && data.productsNotPurchased.length > 0) {
      alert(
        `Compra completada con éxito, pero algunos productos no se pudieron comprar por falta de stock.
        \nTicket de compra: ${data.purchaseTicket.code}
        \nTotal abonado: $${data.purchaseTicket.amount}`
      );
    } else {
      alert(
        `Compra completada con éxito. ¡Gracias por confiar! 
        \nTicket de compra: ${data.purchaseTicket.code}
        \nTotal abonado: $${data.purchaseTicket.amount}`
      );
    }
    window.location.reload();
  } catch (error) {
    console.error("Error purchasing cart:", error);
  }
});
