let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* FORMAT RUPIAH */
function formatRupiah(n) {
  return n.toLocaleString("id-ID");
}

/* SAVE */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* UPDATE BADGE */
function updateCartCount() {
  let total = cart.reduce((sum, i) => sum + i.qty, 0);
  let el = document.getElementById("cart-count");
  if (el) el.innerText = total;
}

/* ADD ITEM */
function addToCart(name, price) {
  let item = cart.find(i => i.name === name);
  if (item) item.qty++;
  else cart.push({ name, price, qty: 1 });

  saveCart();
  renderCart();
}

/* CHANGE QTY */
function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);

  saveCart();
  renderCart();
}

/* REMOVE ITEM */
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

/* CLEAR CART */
function clearCart() {
  cart = [];
  saveCart();
  renderCart();
  toggleCart();
}

/* RENDER CART */
function renderCart() {
  let items = document.getElementById("cart-items");
  if (!items) return;

  let total = 0;
  items.innerHTML = "";

  // EMPTY STATE
  if (cart.length === 0) {
    items.innerHTML = "<p>Keranjang kosong</p>";

    let totalEl = document.getElementById("total");
    if (totalEl) totalEl.innerText = "";

    updateCartCount();
    return;
  }

  // LOOP ITEM
  cart.forEach((i, index) => {
    items.innerHTML += `
      <div style="margin-bottom:10px">
        <b>${i.name}</b><br>
        Rp ${formatRupiah(i.price * i.qty)}<br>
        <button onclick="changeQty(${index},-1)">-</button>
        ${i.qty}
        <button onclick="changeQty(${index},1)">+</button>
        <button onclick="removeItem(${index})">❌</button>
      </div>
    `;
    total += i.price * i.qty;
  });

  let totalEl = document.getElementById("total");
  if (totalEl) totalEl.innerText = "Total: Rp " + formatRupiah(total);

  updateCartCount();
}

/* TOGGLE CART */
function toggleCart() {
  let cartEl = document.getElementById("cart");
  let backdrop = document.getElementById("backdrop");

  if (cartEl) cartEl.classList.toggle("active");
  if (backdrop) backdrop.classList.toggle("active");

  document.body.classList.toggle("no-scroll");
}

/* CHECKOUT WA */
function checkout(){
  if(cart.length === 0){
    alert("Keranjang masih kosong");
    return;
  }

  document.getElementById("checkout-modal").style.display = "flex";
}

function closeCheckout(){
  document.getElementById("checkout-modal").style.display = "none";
}

function prosesCheckout(){
  let nama = document.getElementById("nama").value;
  let hp = document.getElementById("hp").value;
  let alamat = document.getElementById("alamat").value;

  if(!nama || !hp || !alamat){
    alert("Harap isi semua data!");
    return;
  }

  let pesan = `Halo TERRASET, saya mau pesan:%0A`;
  pesan += `Nama: ${nama}%0A`;
  pesan += `No HP: ${hp}%0A`;
  pesan += `Alamat: ${alamat}%0A%0A`;

  cart.forEach(i=>{
    pesan += `- ${i.name} (${i.qty})%0A`;
  });

  let total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  pesan += `%0ATotal: Rp ${formatRupiah(total)}`;

  window.open("https://wa.me/6281267798478?text="+pesan);

  closeCheckout();
}

  let pesan = "Halo TERRASET, saya mau pesan:%0A";

  cart.forEach(i => {
    pesan += `- ${i.name} (${i.qty})%0A`;
  });

  let total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  pesan += `%0ATotal: Rp ${formatRupiah(total)}`;

  let wa = window.open("https://wa.me/628XXXXXXXXXX?text=" + pesan);
  if (wa) toggleCart();
}

/* SCROLL PRODUK (ANTI KETUTUP NAVBAR) */
function scrollToProduk() {
  const el = document.getElementById("produk");
  if (!el) return;

  const yOffset = -100;
  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({ top: y, behavior: "smooth" });
}

/* NAVBAR SCROLL EFFECT */
window.addEventListener("scroll", () => {
  let header = document.querySelector("header");
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 50);
  }
});

/* INIT */
renderCart();