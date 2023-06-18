//Global Variable Declarations
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const btnClear = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

//Display items on page load
displayItems = () => {
    const itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.forEach(item => addItemToDOM(item));

    checkUI();
}


addItem = (e) => {
    e.preventDefault();
    const itemValue = itemInput.value;

    if (itemValue === ''){
        alert("Please add an item");
        return;
    }

    if (isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }else{
        if (checkIfItemExists(itemValue)){
            alert('That Item already exists');
            checkUI();
            return;
        }
    }

    addItemToDOM(itemValue);

    addItemToStorage(itemValue);
    checkUI();

    itemInput.value = '';
}

//Add Items to the Shopping List
function addItemToDOM(item){
    const li = document.createElement('li');
    li.textContent = item;

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    itemList.appendChild(li);
}

//Create the button with the 'x'
function createButton(classes){
    const btn = document.createElement('button');
    btn.className = classes;

    const icon = createIcon('fa-solid fa-xmark');
    btn.appendChild(icon);
    return btn;
}

//Create the 'x' icon
function createIcon(classes){
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

//Clear the entire shopping list
clearList = () => {
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild);
    }

    localStorage.removeItem('items');
    checkUI();
};

onClickItem = (e) => {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    }else{
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item){
    const itemsFromStorage = getItemsFromStorage();

     return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode = true;

    itemList
        .querySelectorAll('li')
        .forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>  Update item';
    formBtn.style.backgroundColor = 'green';
    itemInput.value = item.textContent;
}

//Remove a specific shopping list item
removeItem = (item) => {
    if (confirm("Are you sure?")){
        removeItemFromStorage(item.textContent); 
        item.remove();
        checkUI();
    }
}

function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();

    itemsFromStorage = itemsFromStorage.filter(item => item !== item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

//Filter list items
filterItems = (e) => {
    const items = itemList.querySelectorAll('li');
    const filterValue = e.target.value.toLowerCase();
   
    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if(itemName.includes(filterValue))
            item.style.display = 'flex';
        else
            item.style.display = 'none';
    })   
}

//Add items to local storage
function addItemToStorage(item){
    const itemsFromStorage = getItemsFromStorage(); 

    itemsFromStorage.push(item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

//Retrieve items array from Local Storage
function getItemsFromStorage(){
    let itemsFromStorage;

    if (localStorage.getItem('items') === null)
        itemsFromStorage = [];
    else
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));

    return itemsFromStorage;
}

//Show-Hide Filter Input and Clear Button
function checkUI(){
    itemInput.value = '';
    const items = itemList.querySelectorAll('li');

    if(items.length === 0){
        btnClear.style.display = 'none';
        itemFilter.style.display = 'none';
    }else{
        btnClear.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
}

//Initialize app
function init(){
    //Event Listeners
    itemForm.addEventListener('submit', addItem);
    btnClear.addEventListener('click', clearList);
    itemList.addEventListener('click', onClickItem);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);
    checkUI();
}

init();

