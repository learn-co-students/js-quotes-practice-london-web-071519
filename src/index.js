// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
myQuotelist = document.querySelector('#quote-list')


window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
});

function deleteQuote(e) {
  // debugger;
  elementId = e.target.id;
  e.preventDefault;
  fetch(`http://localhost:3000/quotes/${elementId}`, {
    method: 'DELETE',
  })
.then(updateQuotes); // parses JSON response into native JavaScript objects 
}
  
function addLike(e) {
  
  e.preventDefault()
  elementId = parseInt(e.target.id)
  fetch('http://localhost:3000/likes', {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
    },
    body: JSON.stringify(
      { quoteId: elementId }
    )
}).then(updateQuotes)

}


function updateQuotes() {
fetch('http://localhost:3000/quotes?_embed=likes')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    myQuotelist.innerHTML = ""
    myJson.forEach(function(element) {
      let myQuote = document.createElement('li')
        myQuote.innerHTML = `
        <li class='quote-card'>
        <blockquote class="blockquote">
         <p class="mb-0">"${element.quote}"</footer>
         <br>
         
         <p class="mb-0">- ${element.author}</footer>
         
         <br>
          <button id=${element.id} class='btn-success'>Likes: <span>${element.likes.length}</span></button>
         <button id=${element.id} class='btn-danger'>Delete</button>
         
        </blockquote>
        <br>
        </li>`
        myQuotelist.prepend(myQuote)
        let deleteButton = myQuote.querySelector('.btn-danger')
        deleteButton.addEventListener('click', deleteQuote)
        let likeButton = myQuote.querySelector('.btn-success')
        likeButton.addEventListener('click', addLike)
      });
  });
}
updateQuotes()


  function creatingQuote(e) {
    e.preventDefault()
    fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
    },
    body: JSON.stringify({
    quote: e.target[0].value,
    author: e.target[1].value
    })
    })
    .then(updateQuotes)
  }

  newSubmit = document.querySelector('#new-quote-form')
  newSubmit.addEventListener('submit', e => creatingQuote(e))

  

  