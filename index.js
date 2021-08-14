// Constants
const CLASS_NAMES = {
    PRODUCT_CARD_CONTAINER: 'product-card-container',
    PRODUCT_TITLE: 'product-title',
    PRODUCT_PRICE: 'product-price',
    PRODUCT_IMG: 'product-img',
    BUTTON: 'button',
    CARD: 'card',
    CARD_MAIN_INFO_CONTAINER: 'card-main-info-container',
    CARD_TITLE: 'card-title',
    CARD_IMG: 'card-img',
    CARD_PRICE: 'card-price',
    CARD_QUANTITY_CONTAINER: 'card-quantity-container',
    BUTTON_DELETE: 'button-delete',
    DISPLAY_NONE: 'display-none'
}

const IDS ={
    PRODUCTS: 'products',
    PRODUCT_TITLE_INPUT: 'product-title-input',
    PRODUCT_PRICE_INPUT: 'product-price-input',
    PRODUCT_IMG_INPUT: 'product-img-input',
    PRODUCT_SUBMIT: 'product-submit',
    PRODUCT_IMG_DISPLAY: 'product-img-display',
    CART_CLEAN: 'cart-clean',
    CART_PRODUCTS: 'cart-products',
    TOTAL_AMOUNT: 'total-amount',
    LOADING: 'loading',
    BUY: 'buy'
}
// Variables
let products = [];
let cartProducts = [];

// Elements 
const productImgDisplay = document.getElementById(IDS.PRODUCT_IMG_DISPLAY);
const productImgInput = document.getElementById(IDS.PRODUCT_IMG_INPUT);
const productTitleInput = document.getElementById(IDS.PRODUCT_TITLE_INPUT);
const productPriceInput = document.getElementById(IDS.PRODUCT_PRICE_INPUT);
const productSubmit = document.getElementById(IDS.PRODUCT_SUBMIT);
const productsContainer = document.getElementById(IDS.PRODUCTS);
const loading = document.getElementById(IDS.LOADING);
const cart = document.getElementById(IDS.CART_PRODUCTS);
const clearAllProductsBtn = document.getElementById(IDS.CART_CLEAN);
const totalAmount = document.getElementById(IDS.TOTAL_AMOUNT);
const buyButton = document.getElementById(IDS.BUY);
// Functions

const onClickPorductImgDisplay = () => {
    productImgInput.click();
}

const toBase64 = () => {
    const reader = new FileReader();
    reader.readAsDataURL(productImgInput.files[0]);
    reader.onloadend = () => {
        productImgDisplay.src = reader.result;
    }
}

const onCreateProduct = async () => {
    const title = productTitleInput.value;
    const price = productPriceInput.value;
    const img = productImgDisplay.src;


    const newProduct = {
        img,
        title: title.toUpperCase(),
        price: parseFloat(price)
    }

    const exists = products.find(prod => prod.title === newProduct.title);
    if(!exists) {
        // const response = await apiCall(true);
    
        if(true) {
            products.push(newProduct);
            productTitleInput.value = null;
            productPriceInput.value = null;
            productImgDisplay.src = './assets/no-image.png';
            renderProducts();
        }

    } else {
        alert('ya existe')
    }


}
const onRemoveProduct = (prod) => {
    cartProducts.splice(cartProducts.indexOf(prod), 1);
    onRenderCartProducts();
}



const clearAllProducts = () => {
    cartProducts = [];
    onRenderCartProducts();
}

const calculateTotalAmount = () => {
    totalAmount.innerText = parseFloat(cartProducts.reduce((acc, obj) => {
        return acc + (obj.price * obj.quantity)
    }, 0)).toFixed(2);
}
const renderProducts = () => {
    productsContainer.innerHTML = null;
    products.forEach( prod => {
        const productContainer = document.createElement('div');
        productContainer.className = CLASS_NAMES.PRODUCT_CARD_CONTAINER;

        const productTitle = document.createElement('b');
        productTitle.className = CLASS_NAMES.PRODUCT_TITLE;
        productTitle.innerText = prod.title;

        const productPrice = document.createElement('p');
        productPrice.className = CLASS_NAMES.PRODUCT_PRICE;
        productPrice.innerText = `$ ${prod.price}`;

        const productImg = document.createElement('img');
        productImg.className = CLASS_NAMES.PRODUCT_IMG;
        productImg.src = prod.img;

        const addProdToCart = document.createElement('button');
        addProdToCart.className = CLASS_NAMES.BUTTON;
        addProdToCart.innerText = 'Add';
        addProdToCart.addEventListener('click', () => onAddProdToCart(prod));


        productContainer.appendChild(productImg);
        productContainer.appendChild(productTitle);
        productContainer.appendChild(productPrice);
        productContainer.appendChild(addProdToCart);

        productsContainer.appendChild(productContainer);
    })
}

const onAddProdToCart = (prod) => {

    //

    const exists = cartProducts.find(cartP => cartP.title === prod.title);
    if(exists) {
        const index = cartProducts.indexOf(exists);
        cartProducts[index].quantity += 1; 
    } else {
        cartProducts.push({...prod, quantity: 1});
    }
    onRenderCartProducts();


    //


}

// llamada al back
const apiCall = async (flag) => {
    return new Promise((resolve, reject) => {
        loading.classList.toggle(CLASS_NAMES.DISPLAY_NONE);

        setTimeout(() => {
            loading.classList.toggle(CLASS_NAMES.DISPLAY_NONE);
            if(flag) {
                resolve(true);
            } else {
                resolve(false);
                alert('salio mal');
            }
        }, Math.floor(Math.random() * 5000) + 2000);
    });

}

const onRenderCartProducts = () => {
    cart.innerHTML = null;

    cartProducts.forEach( prod => {
        const card = document.createElement('div');
        card.className = CLASS_NAMES.CARD;

        //INFO
        const cardMainInfoContainer = document.createElement('div');
        cardMainInfoContainer.className = CLASS_NAMES.CARD_MAIN_INFO_CONTAINER;

        const title = document.createElement('h4');
        title.innerText = prod.title;
        title.className = CLASS_NAMES.CARD_TITLE;

        const img = document.createElement('img');
        img.src = prod.img;
        img.className = CLASS_NAMES.CARD_IMG;

        const price = document.createElement('h4');
        price.innerText = `$ ${prod.price}`;
        price.className = CLASS_NAMES.CARD_PRICE;

        cardMainInfoContainer.appendChild(title);
        cardMainInfoContainer.appendChild(img);
        cardMainInfoContainer.appendChild(price);

        //

        const cardQuantityContainer = document.createElement('div');
        cardQuantityContainer.className = CLASS_NAMES.CARD_QUANTITY_CONTAINER;


        const quantityTitle = document.createElement('p');
        quantityTitle.innerText = 'Quantity';

        const quantity = document.createElement('p');
        quantity.innerText = prod.quantity;

        cardQuantityContainer.appendChild(quantityTitle);
        cardQuantityContainer.appendChild(quantity);

        const deleteButton = document.createElement('button');
        deleteButton.className = CLASS_NAMES.BUTTON_DELETE;
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', () => onRemoveProduct(prod));


        cart.appendChild(cardMainInfoContainer);
        cart.appendChild(cardQuantityContainer);
        cart.appendChild(deleteButton);

    })

    calculateTotalAmount();

}

const buy = async () => {

    const response = await apiCall(true);

    if(response) {
        cartProducts = [];
        cart.innerHTML = null;
        calculateTotalAmount();
    } else {
        alert('funco mal')
    }
}


//

// EventListener

productImgDisplay.addEventListener('click', onClickPorductImgDisplay);
productImgInput.addEventListener('change', toBase64);
productSubmit.addEventListener('click', onCreateProduct);
clearAllProductsBtn.addEventListener('click', clearAllProducts);
buyButton.addEventListener('click', buy);