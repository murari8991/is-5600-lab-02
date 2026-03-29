document.addEventListener('DOMContentLoaded', () => {
  // Parse the JSON data from the variables made available by the script tags
  const stocksData = JSON.parse(stockContent);
  const userData = JSON.parse(userContent);

  // Initial render of the user list
  generateUserList(userData, stocksData);

  // Get references to the action buttons (Assuming these IDs/classes based on standard forms)
  const deleteButton = document.querySelector('#btnDelete');
  const saveButton = document.querySelector('#btnSave');

  // Register the event listener on the delete button
  if (deleteButton) {
    deleteButton.addEventListener('click', (event) => {
      // we don't want the form to submit (since we will lose form state)
      event.preventDefault();

      // find the index of the user in the data array 
      const userId = document.querySelector('#userID').value;
      const userIndex = userData.findIndex(user => user.id == userId);
      
      // remove the user from the array
      if (userIndex !== -1) {
        userData.splice(userIndex, 1);
      }
      
      // render the user list
      generateUserList(userData, stocksData);
    });
  }

  // Register the event listener on the save button
  if (saveButton) {
    saveButton.addEventListener('click', (event) => {
      // we don't want the form to submit (since we will lose form state)
      event.preventDefault();

      // find the user object in our data
      const id = document.querySelector('#userID').value;

      for (let i = 0; i < userData.length; i++) {
        // found relevant user, so update object at this index and redisplay
        if (userData[i].id == id) {
          userData[i].user.firstname = document.querySelector('#firstname').value;
          userData[i].user.lastname = document.querySelector('#lastname').value;
          userData[i].user.address = document.querySelector('#address').value;
          userData[i].user.city = document.querySelector('#city').value;
          userData[i].user.email = document.querySelector('#email').value;

          generateUserList(userData, stocksData);
          break; // Exit loop once the user is found and updated
        }
      }
    });
  }
});

/**
 * Loops through the users and renders a ul with li elements for each user
 * @param {*} users  
 * @param {*} stocks
 */
function generateUserList(users, stocks) {
  // get the list element and for each user create a list item and append it to the list
  const userList = document.querySelector('.user-list');
  
  // clear out the list from previous render
  userList.innerHTML = '';
  
  users.map(({ user, id }) => {
    const listItem = document.createElement('li');
    listItem.innerText = user.lastname + ', ' + user.firstname;
    listItem.setAttribute('id', id);
    userList.appendChild(listItem);
  });

  // register the event listener on the list
  // Note: Using onclick instead of addEventListener to prevent duplicate listeners upon re-rendering
  userList.onclick = (event) => handleUserListClick(event, users, stocks);
}

/**
 * Handles the click event on the user list
 * @param {*} event  
 * @param {*} users
 * @param {*} stocks
 */
function handleUserListClick(event, users, stocks) {
  // get the user id from the list item
  const userId = event.target.id;
  
  // find the user in the userData array
  // we use a "truthy" comparison here because the user id is a number and the event target id is a string
  const user = users.find(user => user.id == userId);
  
  if (user) {
    // populate the form with the user's data
    populateForm({ user, id: user.id });
    
    // render the portfolio items for the user
    renderPortfolio(user, stocks);
  }
}

/**
 * Populates the form with the user's data
 * @param {*} data  
 */
function populateForm(data) {
  // use destructuring to get the user and id from the data object
  const { user, id } = data;
  document.querySelector('#userID').value = id;
  document.querySelector('#firstname').value = user.user.firstname;
  document.querySelector('#lastname').value = user.user.lastname;
  document.querySelector('#address').value = user.user.address;
  document.querySelector('#city').value = user.user.city;
  document.querySelector('#email').value = user.user.email;
}

/**
 * Renders the portfolio items for the user
 * @param {*} user  
 * @param {*} stocks
 */
function renderPortfolio(user, stocks) {
  // get the user's stock data
  const { portfolio } = user;
  
  // get the portfolio list element
  const portfolioDetails = document.querySelector('.portfolio-list');
  
  // clear the list from previous render
  portfolioDetails.innerHTML = '';
  
  // map over portfolio items and render them
  portfolio.map(({ symbol, owned }) => {
    // create a list item and append it to the list
    const symbolEl = document.createElement('p');
    const sharesEl = document.createElement('p');
    const actionEl = document.createElement('button');
    
    symbolEl.innerText = symbol;
    sharesEl.innerText = owned;
    actionEl.innerText = 'View';
    actionEl.setAttribute('id', symbol);
    
    portfolioDetails.appendChild(symbolEl);
    portfolioDetails.appendChild(sharesEl);
    portfolioDetails.appendChild(actionEl);
  });

  // register the event listener on the list
  portfolioDetails.onclick = (event) => {
    // let's make sure we only handle clicks on the buttons
    if (event.target.tagName === 'BUTTON') {
      viewStock(event.target.id, stocks);
    }
  };
}

/**
 * Renders the stock information for the symbol
 * @param {*} symbol  
 * @param {*} stocks
 */
function viewStock(symbol, stocks) {
  // begin by hiding the stock area until a stock is viewed
  const stockArea = document.querySelector('.stock-form');
  if (stockArea) {
    // find the stock object for this symbol
    const stock = stocks.find(function (s) { return s.symbol == symbol; });

    if (stock) {
      document.querySelector('#stockName').textContent = stock.name;
      document.querySelector('#stockSector').textContent = stock.sector;
      document.querySelector('#stockIndustry').textContent = stock.subIndustry;
      document.querySelector('#stockAddress').textContent = stock.address;

      document.querySelector('#logo').src = `logos/${symbol}.svg`;
    }
  }
}