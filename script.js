const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const items = itemList.querySelectorAll('li');
const formBtn = itemForm.querySelector('button');

let isEditMode = false;

const displayItems = () => {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.forEach(item => addItemToDOM(item));

  checkUI();
};

const onAddItemSubmit = e => {
  e.preventDefault();

  const newItem = itemInput.value;

  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  if (isEditMode) {
    const itemTodEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemTodEdit.textContent);
    itemTodEdit.classList.remove('edit-mode');
    itemTodEdit.remove();

    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert(`The ${newItem} already exists!`);
      return;
    }
  }

  addItemToDOM(newItem);

  addItemToStorage(newItem);

  checkUI();

  itemInput.value = '';
};

const addItemToDOM = item => {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  itemList.appendChild(li);
};

const addItemToStorage = item => {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.push(item);

  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

const createButton = classes => {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
};

const createIcon = classes => {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
};

const getItemsFromStorage = () => {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
};

const setItemToEdit = item => {
  isEditMode = true;

  itemList
    .querySelectorAll('li')
    .forEach(item => item.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  itemInput.value = item.textContent;
  formBtn.style.backgroundColor = '#228b22';
};

const onClickItem = e => {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
};

const checkIfItemExists = item => {
  const itemsFromStorage = getItemsFromStorage();

  if (itemsFromStorage.includes(item)) {
    return true;
  } else {
    return false;
  }
};

const removeItem = item => {
  if (confirm('Are you sure?')) {
    item.remove();

    removeItemFromStorage(item.textContent);

    checkUI();
  }
};

const removeItemFromStorage = item => {
  let itemsFromStorage = getItemsFromStorage();

  itemsFromStorage = itemsFromStorage.filter(el => el !== item);

  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

const clearItems = () => {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  localStorage.removeItem('items');

  checkUI();
};

const filterItems = e => {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach(item => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) !== -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
};

const checkUI = () => {
  itemInput.value = '';

  const items = itemList.querySelectorAll('li');

  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;
};

const init = () => {
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();
};

init();
