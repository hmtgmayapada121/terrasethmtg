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
  let totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  let totalHarga = cart.reduce((sum, i) => sum + i.qty*i.price, 0);

  let el = document.getElementById("cart-count");

  if(el){
    el.innerText = totalQty;
    el.title = "Rp " + formatRupiah(totalHarga);
  }
}

/* ADD ITEM */
function addToCart(name, price) {
  let item = cart.find(i => i.name === name);
  if (item) item.qty++;
  else cart.push({ name, price, qty: 1 });

  if(navigator.vibrate) navigator.vibrate(50);

  saveCart();
  renderCart();
  showToast();

  // buka cart hanya kalau belum terbuka
let cartEl = document.getElementById("cart");
if (!cartEl.classList.contains("active")) {
  toggleCart();
 }
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

  // EMPTY
  if (cart.length === 0) {
    items.innerHTML = "<p>Keranjang kosong</p>";

    let totalEl = document.getElementById("total");
    if (totalEl) totalEl.innerText = "";

    updateCartCount();
    return;
  }

  // LOOP
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

/* POP UP GAMBAR PRODUK */
function openImage(src){
  document.getElementById("modalImg").src = src;
  document.getElementById("imgModal").style.display = "flex";
}

function closeImage(){
  document.getElementById("imgModal").style.display = "none";
}

/* ANIMASI FADE IN PRODUK */
function revealOnScroll(){
  let cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    let top = card.getBoundingClientRect().top;
    let screen = window.innerHeight;

    if(top < screen - 50){
      card.classList.add("show");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);

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

function prosesCheckout(e){
  let nama = document.getElementById("nama").value.trim();
  let hp = document.getElementById("hp").value.trim();
  let alamat = document.getElementById("alamat").value.trim();

  let btn = e.target;

  if(!nama || !hp || !alamat){
    alert("Harap isi semua data!");
    return;
  }

  // simpan data user
  localStorage.setItem("nama", nama);
  localStorage.setItem("hp", hp);
  localStorage.setItem("alamat", alamat);

  btn.innerText = "Mengirim...";
  btn.disabled = true;

  let pesan = `Halo TERRASET,

Saya ingin memesan produk berikut:
`;

  cart.forEach(i=>{
    pesan += `- ${i.name} (${i.qty}) = Rp ${formatRupiah(i.price*i.qty)}\n`;
  });

  let total = cart.reduce((s,i)=>s+i.price*i.qty,0);

  pesan += `\nTotal Pembayaran: Rp ${formatRupiah(total)}\n\n`;
  pesan += `Data Pemesan:\n`;
  pesan += `Nama: ${nama}\n`;
  pesan += `No HP: ${hp}\n`;
  pesan += `Alamat: ${alamat}\n\n`;
  pesan += `Mohon konfirmasi pesanan saya. Terima kasih.`;

  let url = "https://wa.me/6281267798478?text=" + encodeURIComponent(pesan);

  window.location.href = url;

  setTimeout(()=>{
  cart = [];
  saveCart();
  renderCart();
},500);

  setTimeout(()=>{
  btn.innerText = "Kirim Pesanan";
  btn.disabled = false;
},3000);

  closeCheckout();
}

/* TOMBOL “BELI SEKARANG” */
function beliSekarang(nama, harga){
  let pesan = `Halo TERRASET,

Saya ingin memesan produk berikut:
- ${nama} (1) = Rp ${formatRupiah(harga)}

Total Pembayaran: Rp ${formatRupiah(harga)}

Mohon konfirmasi pesanan saya. Terima kasih.`;

  let url = "https://wa.me/6281267798478?text=" + encodeURIComponent(pesan);

  window.location.href = url;
}

/* SCROLL PRODUK (ANTI KETUTUP NAVBAR) */
function scrollToProduk(){
  const el = document.getElementById("produk");

  const y = el.getBoundingClientRect().top + window.pageYOffset - 80;

  window.scrollTo({
    top: y,
    behavior: "smooth"
  });
}

/* NAVBAR SCROLL EFFECT */
window.addEventListener("scroll", () => {
  let header = document.querySelector("header");
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 50);
  }
});

/* FITUR SEARCH & FILTER */
function searchProduk(){
  let input = document.getElementById("searchInput").value.toLowerCase();
  let cards = document.querySelectorAll(".card");

  cards.forEach(card=>{
    let text = card.innerText.toLowerCase();
    card.style.display = text.includes(input) ? "block" : "none";
  });
}

function filterKategori(kategori){
  let cards = document.querySelectorAll(".card");

  cards.forEach(card=>{
    if(kategori === "all"){
      card.style.display = "block";
    } else {
      card.style.display = card.classList.contains(kategori) ? "block" : "none";
    }
  });
}

/* NOTIFIKASI “DITAMBAHKAN KE KERANJANG” */
function showToast(){
  let t = document.getElementById("toast");
  t.classList.add("show");

  setTimeout(()=>{
    t.classList.remove("show");
  },2000);
}


window.addEventListener("load", () => {
  let nama = localStorage.getItem("nama");
  let hp = localStorage.getItem("hp");
  let alamat = localStorage.getItem("alamat");

  if(nama) document.getElementById("nama").value = nama;
  if(hp) document.getElementById("hp").value = hp;
  if(alamat) document.getElementById("alamat").value = alamat;

  renderCart();
  revealOnScroll();
});

