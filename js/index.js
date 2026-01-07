import { cartProducts } from "./utils.js";
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let data = [];
const urlPromos = './Db/promos.json';
document.addEventListener('DOMContentLoaded', () => {
    const faders = document.querySelectorAll('.fade-in');

    const appearOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.9;

        faders.forEach(fader => {
            const faderTop = fader.getBoundingClientRect().top;

            if (faderTop < triggerBottom) {
                fader.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', appearOnScroll);
    appearOnScroll(); // para que aparezcan si ya están visibles al cargar
});

async function getData() {
    try {
        const response = await fetch(urlPromos);
        if (!response.ok) throw new Error("No se pudo cargar los productos");
        data = await response.json();
        renderCard(data.promos);
        cartProducts(cart);
    } catch (error) {
        throw Error("Error al cargar los productos:", error);
    }
}

function renderCard(data) {
    const cardContainer = document.querySelector('.section-deals_grid');
    data.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('section-deals_grid_card');
        card.innerHTML = `
        <img class="section-deals_grid_card_img" src="${product.image}" alt="${product.name}">
        <h3 class="section-deals_grid_card_sub-title">${product.name}</h3>
        <p class="section-deals_grid_card_description">${product.description}</p>
        <button class="section-deals_grid_card_button" id="${product.id}">Pedilo ahora</button>
        `;
        cardContainer.appendChild(card);        
    });
    addCardEListener();
}

function addCardEListener(){
    const cardButtons = document.querySelectorAll('.section-deals_grid_card_button');
    cardButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.id;
            const product = data.promos.find(product => product.id === id);
            if (!product) return;
            const existingProduct = cart.find(product => product.id === id);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }
            Swal.fire({
                icon: 'success',
                title: 'Producto agregado',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                position: 'top-end',
                toast: true
            });
            localStorage.setItem('cart', JSON.stringify(cart));
            cartProducts(cart);
        })
    })
}
getData();
cartProducts(cart);