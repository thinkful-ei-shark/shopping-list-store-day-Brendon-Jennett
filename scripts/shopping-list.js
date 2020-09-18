const store = {
  items: [],
  hideCheckedItems: false,

};

const generateItemElement = function (item) {
  let itemTitle = `<span class="shopping-item shopping-item__checked">${item.name}</span>`;
  if (!item.checked) {
    itemTitle = `
     <span class='shopping-item'>${item.name}</span>
    `;
  }
  if (item.rename) {
    //itemTitle has the edit we need
    itemTitle = `
      <form class="js-edit-item">
        <input class="shopping-item" type="text" value="${item.name}" />
      </form>
    `;
  }

  return `
    <li class="js-item-element" data-item-id="${item.id}">
      ${itemTitle}
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
          <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
          <span class="button-label">delete</span>
        </button>
        <button class="shopping-item-rename js-item-rename">
          <span class="button-label">rename</span>
        </button>
      </div>
    </li>`;
};
//c Use titleRename here and set it to change class according to boolean value
const handleRenameItem = function () {
  $('.js-shopping-list').on('click', '.js-item-rename', function (event) {
    // change attribute type to text
    let id = getItemIdFromElement(event.currentTarget)
    const foundItem = store.items.find(item => item.id === id);
    foundItem.rename = !foundItem.rename
    render()
  })
}


//////////////////////////////////////////////////////////////
//                                                          //
// Next function will submit name to store.items[index].name//
const insertNewName = function () {
  $('.js-shopping-list').on('click', '.js-item-rename', function (event) {
    let id = getItemIdFromElement(event.currentTarget)
    if (id.rename === true) {
      id.name = $('.js-edit-item').val()
    }
  })

}

const generateShoppingItemsString = function (shoppingList) {
  const items = shoppingList.map((item) => generateItemElement(item));
  return items.join('');
};

const render = function () {
  // Filter item list if store prop is true by item.checked === false
  let items = [...store.items];
  console.log(...store.items)
  if (store.hideCheckedItems) {
    items = items.filter(item => !item.checked);
  }
  // render the shopping list in the DOM
  const shoppingListItemsString = generateShoppingItemsString(items);
  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
};

const addItemToShoppingList = function (itemName) {
  store.items.push({ id: cuid(), name: itemName, checked: false, rename: false, });
};

const handleNewItemSubmit = function () {
  $('#js-shopping-list-form').submit(function (event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    render();
  });
};

const toggleCheckedForListItem = function (id) {
  const foundItem = store.items.find(item => item.id === id);
  foundItem.checked = !foundItem.checked;
};

const handleItemCheckClicked = function () {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const id = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(id);
    render();
  });
};

const getItemIdFromElement = function (item) {
  return $(item)
    .closest('.js-item-element')
    .data('item-id');
};

/**
 * Responsible for deleting a list item.
 * @param {string} id
 */
const deleteListItem = function (id) {
  const index = store.items.findIndex(item => item.id === id);
  store.items.splice(index, 1);
};

const handleDeleteItemClicked = function () {
  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // get the index of the item in store.items
    const id = getItemIdFromElement(event.currentTarget);
    // delete the item
    deleteListItem(id);
    // render the updated shopping list
    render();
  });
};

const editListItemName = function (id, itemName) {
  const item = store.items.find(item => item.id === id);
  item.name = itemName;
};

/**
 * Toggles the store.hideCheckedItems property
 */
const toggleCheckedItemsFilter = function () {
  store.hideCheckedItems = !store.hideCheckedItems;
};

/**
 * Places an event listener on the checkbox
 * for hiding completed items.
 */
const handleToggleFilterClick = function () {
  $('.js-filter-checked').click(() => {
    toggleCheckedItemsFilter();
    render();
  });
};

const handleEditShoppingItemSubmit = function () {
  $('.js-shopping-list').on('submit', '.js-edit-item', event => {
    event.preventDefault();
    const id = getItemIdFromElement(event.currentTarget);
    const itemName = $(event.currentTarget).find('.shopping-item').val();
    editListItemName(id, itemName);
    render();
  });
};

const bindEventListeners = function () {
  handleRenameItem();
  insertNewName();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleEditShoppingItemSubmit();
  handleToggleFilterClick();
};

// This object contains the only exposed methods from this module:
export default {
  render,
  bindEventListeners
};
