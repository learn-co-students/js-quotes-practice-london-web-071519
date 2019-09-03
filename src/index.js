// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
const quoteList = document.querySelector('#quote-list')
const form = document.querySelector('#new-quote-form')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    let quote = e.target[0].value
    let author = e.target[1].value
    createNewQuote(quote, author)
})

// document.addEventListener('DOMContentLoaded', () => {
const getAllQuotes = () => {
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(resp => resp.json())
    //send json to function that looks at each object in array individually
    .then((quotes) => quotes.forEach((quote) => initializeQuotes(quote)))
    .then(initializeLikeEvent)
    .then(initializeDeleteEvent)

}
// })

//function that iterates through to assign
function initializeQuotes(quote) {
    let quoteCard = document.createElement('li')
    quoteCard.classList.add('quote-card')
    quoteCard.innerHTML = `
    <blockquote class="blockquote">
      <p class=${quote.id}>${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>`
    quoteList.append(quoteCard)
}

// createNewQuote
function createNewQuote(quote, author) {
    let quoteCard = document.createElement('li')
    quoteCard.classList.add('quote-card')
    quoteCard.innerHTML = `
    <blockquote class="blockquote">
      <p class="mb-0">${quote}</p>
      <footer class="blockquote-footer">${author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>0</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>`
    quoteList.append(quoteCard)
    createLikeEvent()
    createDeleteEvent()
    postQuote(quote, author)
}
////like events
function initializeLikeEvent() {
    const [...likeButtons] = document.querySelectorAll('.btn-success'),
    grouped = [...likeButtons]
    grouped.forEach(likeButton => {
        likeButton.addEventListener('click', (e) => {
            e.target.children[0].innerText = parseInt(++e.target.children[0].innerText)
        })
    })
}
///create event listener for new quote
function createLikeEvent() {
    let likeButtons = document.querySelectorAll('.btn-success')
    let lastButton = likeButtons[likeButtons.length -1]
    lastButton.addEventListener('click', (e) => {
        e.target.children[0].innerText = parseInt(++e.target.children[0].innerText)
    })
}

////delete events
function initializeDeleteEvent() {
    const [...deleteButtons] = document.querySelectorAll('.btn-danger'),
    grouped = [...deleteButtons]
    grouped.forEach(deleteButton => {
        deleteButton.addEventListener('click', (e) => {
            deleteQuote(e.target.parentNode)
            // e.target.parentNode.parentNode.remove()
            .then(()=>e.target.parentNode.parentNode.remove())
        })
    })
}

function createDeleteEvent() {
    let lastButton = document.querySelectorAll('.btn-danger')[document.querySelectorAll('.btn-danger').length - 1]
    lastButton.addEventListener('click', (e) => {
        deleteQuote(e.target.parentNode)
        .then(()=>e.target.parentNode.parentNode.remove())
    })
}

//post to database
function postQuote(quote, author) {
    // let obj = {"quote": `${quote}`, "author": `${author}`}
    return fetch('http://localhost:3000/quotes',{
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "Accept":"application/json"
        },
        body:JSON.stringify({
            quote,
            author})
        })
}

// /////delete from the database
function deleteQuote(quoteBlock) {
    debugger
    let id = parseInt(quoteBlock.firstElementChild.classList[0])
    return fetch(`http://localhost:3000/quotes/${id}`,{
        method: "DELETE",
        })
}

getAllQuotes()