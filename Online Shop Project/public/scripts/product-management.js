// Delete product on the frontend

const deleteProductButtons = document.querySelectorAll('.product-list-item button');

async function deleteProduct(event) {

    // event.target is element that caused the event
    const button = event.target;

    // obtain productid and csrf token of a particular delete button through 'data-productid' in html
    const productId = button.dataset.productid;
    const csrfToken = button.dataset.csrf;

    // Configure request to send to server, fetch returns a promise
    const response = await fetch('/admin/products/' + productId + '?_csrf=' + csrfToken, {
        method: 'DELETE'
    });

    if (!response.ok) {
        alert('Something went wrong!');
        return;
    }

    // Removes the product list item of particular delete button clicked
    button.parentElement.parentElement.parentElement.remove();
}

for (const deleteProductButton of deleteProductButtons) {
    deleteProductButton.addEventListener('click', deleteProduct);
}