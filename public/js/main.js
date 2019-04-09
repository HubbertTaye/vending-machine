let numpadBtn = document.querySelectorAll('.numBtn')
let codeInput = document.querySelector('#machineCode')

Array.from(numpadBtn).forEach((btn)=>{
  btn.addEventListener('click', ()=>{
    //take value from whatever is clicked
     codeInput.textContent = codeInput.textContent + btn.textContent

  })
})

document.querySelector('#itemCodeBtn').addEventListener('click', () =>{
  //user inputs code, that code saved into a variable
  let code = codeInput.textContent
  //fetch to routes.js to find the item that relates to the code the user inputted
    fetch('vending', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'code': code
      })
    })
    .then(response => {
     if (response.ok) return response.json();
   })
   .then(data => {
     //take the json object response and take the url, item name and item price and put all into variables to use later
     let pic = data.value.url;
     let picName = data.value.name;
     let picPrice = data.value.price;
     //if there is no more in stock, do not display item
     if(data.value.stock === 0){
       document.querySelector('#nameDisplay').textContent = 'Sorry, there\'s no more left...'
     }else{
       //display item url and item name into dom for user to see and send price to another function
       document.querySelector('#nameDisplay').textContent = picName
       document.querySelector('#picDisplay').src = pic
       bankUpdate(picPrice)
    }
   })
})

//update bank
function bankUpdate(price){
  //extra feature: remove money when owner restocks vending machine
  //this function will update owner's bank aka wallet whenever someone buys a new item
  fetch('vendingBank', {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'price': price
    })
  })
  // .then(repsonse => {
  //   if(response.ok) return response.json();
  // })
  // .then(data =>{
  //   console.log(data)
  // })
}

//compare machineCode variable with inventory.code
//throw machineCode variable into fetch as a query parameter to compare to other inventory.code (for loop thru inventory in backend)
//(backend) return item image and name

//update bank(???)
