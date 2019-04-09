//store restock buttons and trash icons in a variable as an array
let restock = document.querySelectorAll('.restockBtn')
let trash = document.querySelectorAll('.fa-minus-circle')

//restock button
Array.from(restock).forEach((el) => {
  el.addEventListener('click', () =>{
    //restock items
    const stock = parseInt(el.parentNode.childNodes[1].value)
    let item = el.parentNode.parentNode.childNodes[1].textContent
    item = item.replace('Name: ', '')
    const pic = el.parentNode.parentNode.childNodes[5].src
    fetch('owner', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': item,
        'url': pic,
        'stock': stock
      })
    }) //closes put fetch
    .then(response => {
     window.location.reload(true);
   })
  }) //closes event listener
}) //closes restock forEach

//delete button
Array.from(trash).forEach(function(el){
  el.addEventListener('click', ()=>{
    //grab name, url put into variables
    let item = el.parentNode.parentNode.parentNode.childNodes[1].textContent
    //take name: out of the item string so it the variable only contains the item name
    item = item.replace('Name: ', '');
    const pic = el.parentNode.parentNode.parentNode.childNodes[5].src
    // send info to fetch with a delete method
    fetch('owner', {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': item,
        'url': pic
      })
    }) //closes delete fetch
    .then((response) =>{
      window.location.reload(true)
    })
  }) //closes event listener
}) //closes trash forEach
