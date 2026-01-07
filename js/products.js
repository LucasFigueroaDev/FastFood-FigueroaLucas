import { cartProducts, createButton } from './utils.js';
// Crear carrito en el localstorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let data = [];
// Funcion para cargar productos del archivo json
const url = '../Db/productos.json';
async function uploadProducts() {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("No se pudo cargar los productos");
        data = await response.json();
        const categories = new Set(data.menu.map(product => product.category));
        const categoryButtons = document.getElementById('categories');

        categories.forEach(category => {
            const button = createButton('section-menu_categories_button', category, category);
            button.addEventListener('click', () => {
                renderProducts(data.menu.filter(product => product.category === category));
                const allButtons = document.querySelectorAll('.section-menu_categories_button');
                allButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
            categoryButtons.appendChild(button);
        })

        renderProducts(data.menu);
        cartProducts(cart);

    } catch (error) {
        throw error("Error al cargar los productos:", error);
    }
}
function renderProducts(products) {
    const containerProducts = document.getElementById('products');
    containerProducts.innerHTML = '';
    products.forEach(product => {
        const productContent = document.createElement('div');
        productContent.classList.add('section-menu_container_card');
        productContent.innerHTML = `
            <h3 class="section-menu_container_card_title">${product.name}</h3>
            <div class="section-menu_container_card_img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="section-menu_container_card_description">
                <p class="section-menu_container_card_description_price">Precio: $${product.price}</p>
                <p class="section-menu_container_card_description_description">${product.description}</p>
                <button class="section-menu_container_card_description_button" id=${product.id}>Agregar pedido</button>
            </div>
        `;
        containerProducts.appendChild(productContent);
    })
    addCartEventListener();
};
function addCartEventListener() {
    const allButtons = document.querySelectorAll('.section-menu_container_card_description_button');
    allButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.id;
            const productToAdd = data.menu.find(item => item.id === productId);
            if (!productToAdd) return;
            const existingProduct = cart.find(item => item.id === productId);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({
                    ...productToAdd,
                    quantity: 1,
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
        });
    });
}

uploadProducts();