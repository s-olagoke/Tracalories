// Storage Controller
const StorageCtrl = (() => {
  
  // Public Methods
  return {
  
    storeItem: (item) => {
      let items;
      
      // Check if any items in LS
      if (localStorage.getItem('items') === null) {
        items = [];
        
        // Push new item
        items.push(item);
        // Set localStorage
        localStorage.setItem('items', JSON.stringify(items))
        
      } else {
        // Get what is already in localStorage
        items = JSON.parse(localStorage.getItem('items'));
        // push new item
        items.push(item);
        
        // Reset localStorage
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: () => {
      let items;
      if(localStorage.getItem('items') === null) {
         items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'))
      }
      return items;
    },
    updateItemStorage: (updatedItem) => {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: (id) => {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach((item, index) => {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: () => {
      localStorage.clear();
    }
  }
  
})();


// Item Controller
const ItemCtrl = (()=> {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }
  
  
  // Data Structurec
  const data = {
    // items: [
    //   // {id: 0, name: 'Steak Dinner', calories: 1200},
    //   // {id: 1, name: 'Cookies', calories: 400},
    //   // {id: 2, name: 'Eggs', calories: 300},
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };
 
  // Public Methods
  return {
    
    getItems: ()=> {
      return data.items
    },
    addItem: (name, calories ) => {
      
      let ID;
      // Create id
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      
      // Calories to number
      calories = parseInt(calories);
      
      // Create new Item
      newItem = new Item(ID, name, calories);
      
      // Add to items Array
      data.items.push(newItem);
      
      return newItem;
    },
    getItemById: (id) => {
      let found = null;
      
      // Loop through item
      data.items.forEach((item) => {
        if (item.id === id) {
          found = item
        }
      });
      return found;
    },
    updateItem: (name, calories) => {
      // Calories to number
      calories = parseInt(calories);
      
      let found = null;
      
      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          
          found = item;
        }
      });
      
      return found;
    },
    deleteItem: (id) => {
      // Get the Ids
      ids = data.items.map((item) => {
        return item.id
      });
      
      // Get the index
      const index = ids.indexOf(id);
      
      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: () => {
      data.items = [];
    },
    setCurrentItem: (item) => {
      data.currentItem = item;
    },
    getCurrentItem: () => {
      return data.currentItem;
    },
    getTotalCalories: () => {
      let total = 0; 
      
      data.items.forEach((item) => {
        total += item.calories;
      });
      // Set total calories in data structure
      data.totalCalories = total;
      
      // return total
      return data.totalCalories;
    },
    logData: function () {
      return data
    }
  }
})();


// UI Controller
const UICtrl = (()=> {
  const UISelectors = {
    itemList: `#item-list`,
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    clearBtn: '.clear-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  // Public methods
  return {
    populateItemList: (items) => {
      let html ='';
      
      items.forEach((item) => {
        html += `
        <li class="collection-item" id="item-${item.id}">
        <strong>${item.name} </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="fas fa-pencil-alt edit-item"></i>
        </a>
      </li>
        `;
      });
      
      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: () => {

      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: (item) => {
      // SHow list
      document.querySelector(UISelectors.itemList).style.display = 'block'
      // Create Element
      const li = document.createElement('li');
      // Add classes
      li.className = 'collection-item';
      // Add id
      li.id = `item-${item.id}`;
      // Add Html
      li.innerHTML = `
        <strong>${item.name} </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="fas fa-pencil-alt edit-item"></i>
        </a>
      `;
      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: (item) => {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      
      // Convert node list to aray
      listItems = Array.from(listItems);
      
      listItems.forEach((listItem) => {
        const itemID = listItem.getAttribute('id');
        
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML =
          `
          <strong>${item.name} </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="fas fa-pencil-alt edit-item"></i>
          </a>
          ` ;
        }
      })
    },
    deleteListItem: (id) => {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: () => {
      document.querySelector(UISelectors.itemNameInput).value ='';
      document.querySelector(UISelectors.itemCaloriesInput).value ='';
    },
    addItemToForm: () => {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      
      UICtrl.showEditState();
    },
    removeItems: () => {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      
      // Turn nodelist into array
      listItems = Array.from(listItems);
      listItems.forEach((item) => {
        item.remove();
      });
    },
    hideList: () => {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: (totalCalories) => {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories
    },
    clearEditState: () => {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: () => {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelectors: () => {
      return UISelectors
    }
  }
})();



// App Controller
const App = ((ItemCtrl, StorageCtrl, UICtrl)=> {
  
  const loadEventListeners = function() {
    // Get UI Selectors
    const UISelectors =  UICtrl.getSelectors();
    
    // Add item events
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    
    // Disable submit on enter
    document.addEventListener('keypress', function(e) {
      if(e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false
      }
    });
    
    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
    
    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
    
     // Back Btn event
     document.querySelector(UISelectors.backBtn).addEventListener('click', back);
     
      // Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
    
     // Delete item event
     document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
}
  
  
  // Add item submit
  const itemAddSubmit = (e) => {
    // Get form input from UICtrl
    const input = UICtrl.getItemInput();
    
    // Check for name and calories input
    if (input.name !== '' && input.calories !=='') {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      
      // Add item UI list
      UICtrl.addListItem(newItem);
      
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Addtotal calories to UI
      UICtrl.showTotalCalories(totalCalories);
      
      // Store in Local Storage
      StorageCtrl.storeItem(newItem);
      
      // Clear fileds
      UICtrl.clearInput();
    }
    
    e.preventDefault();
  }
  
  // Edit Item
  const itemEditClick = (e) => {
    if (e.target.classList.contains('edit-item')) {
      // Get list item ID
      const listId = e.target.parentNode.parentNode.id;
      
      // Break into an array
      const listIdArr = listId.split('-');
      
      // Get actual id
      const id = parseInt(listIdArr[1]);
      
      // Get Item
      const itemToEdit = ItemCtrl.getItemById(id);
      
      // Set currentItem
      ItemCtrl.setCurrentItem(itemToEdit);
      
      // Add item to form
      UICtrl.addItemToForm();
    }
    
    e.preventDefault();
  }
  
  // Item update
  const itemUpdateSubmit = (e) => {
    
    // Get item input
    const input = UICtrl.getItemInput();
    
    // Update Item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    
    
    
    // Update UI
    UICtrl.updateListItem(updatedItem);
    
     // Get total calories
     const totalCalories = ItemCtrl.getTotalCalories();
     // Addtotal calories to UI
     UICtrl.showTotalCalories(totalCalories);
     
    //  Update localstorage
    StorageCtrl.updateItemStorage(updatedItem)
     
     // Clear fileds
     UICtrl.clearEditState();
    
    e.preventDefault();
    
    
  }
  
  const back = (e) => {
    UICtrl.clearEditState();
    e.preventDefault();
  }
  
  
  // Delete button event
  const itemDeleteSubmit = (e) => {
    
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();
    
    // Delete From Data Structure
    ItemCtrl.deleteItem(currentItem.id);
    
      // Delete from UI
      UICtrl.deleteListItem(currentItem.id);
      
       // Get total calories
     const totalCalories = ItemCtrl.getTotalCalories();
     // Addtotal calories to UI
     UICtrl.showTotalCalories(totalCalories);
     
    //  Delete from localstorage
    StorageCtrl.deleteItemFromStorage(currentItem.id);
     
     // Clear fileds
     UICtrl.clearEditState();
    
    e.preventDefault();
  }
  
  
  // clear item event
  const clearAllItemsClick = (e) => {
    // Delete all item from data structure
    ItemCtrl.clearAllItems();
    
       // Get total calories
       const totalCalories = ItemCtrl.getTotalCalories();
       // Addtotal calories to UI
       UICtrl.showTotalCalories(totalCalories);
    
    // Remove from UI
    UICtrl.removeItems();
    
    // Clear from LS
    StorageCtrl.clearItemsFromStorage();
    
    // Hide UL
    UICtrl.hideList();
    
    e.preventDefault();
  }
  
  // public mehtods
  return {
    init: () => {
      // Clear Edit state / initial set
      UICtrl.clearEditState();
      
      // Fetch items from data structure
      const items = ItemCtrl.getItems();
      
      // check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
          
      // Populate list with items
      UICtrl.populateItemList(items);
      }
      
       // Get total calories
       const totalCalories = ItemCtrl.getTotalCalories();
       // Addtotal calories to UI
       UICtrl.showTotalCalories(totalCalories);
    
      
      // Load EventListeners  
      loadEventListeners();
    }
  }
})(ItemCtrl, StorageCtrl, UICtrl);

// init app
App.init()