let total = 0;

function addToCart(price) {
  total += price;
  document.getElementById("total").innerText =
    `Total: ${total.toLocaleString()} VND`;
}

async function checkout() {
  if (total === 0) {
    alert("Cart is empty!");
    return;
  }

  const res = await fetch("https://payment-momo-demo.vercel.app/api/payment/momo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ amount: total })
  });

  const data = await res.json();

  if (data.payUrl) {
    window.location.href = data.payUrl;
  } else {
    alert("Payment failed");
  }
}
