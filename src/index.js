// Find DOM Elements
const form = document.querySelector('form#new-quote-form')
const ul = document.querySelector('ul#quote-list')
const deleteBtns = document.querySelectorAll('button.btn-danger')

// Fetch All Quotes from API Endpoint /quotes
const getQuotesWithLikes = () => {
fetch("http://localhost:3000/quotes?_embed=likes")
    .then(result => result.json())
    .then(quotes => quotes.forEach(parseQuoteWithLikes))
    .catch(error => alert(error.message))
}

// Parse quote object and render in HTML
const parseQuoteWithLikes = quote => {
    const li = document.createElement('li')
    li.classList.add('quote-list')
    li.setAttribute('name', 'quote')
    li.innerHTML = `
    <blockquote class="blockquote">
        <p class="mb-${quote.id}">${quote.quote}.</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quote.likes ? quote.likes.length : "0"}</span></button>
        <button class='btn-danger'>Delete</button>
    </blockquote>
    `
    const deleteBtn = li.querySelector('button.btn-danger')
    const likesBtn = li.querySelector('button.btn-success')
    deleteBtn.addEventListener('click', event => handleDeleteBtnEvent(event, li, quote.id))
    likesBtn.addEventListener('click', event => handleLikesBtnEvent(event, quote.id))

    ul.append(li)
}

// Handles form submission event and creates quote object which is passed to createQuote
const handleFormSubmit = event => {
    event.preventDefault()
    
    const quote = {
        quote: form.quote.value,
        author: form.author.value
    }
    createQuote(quote)
}

// Add event listener to from - calls handFormSubmit when form submitted
form.addEventListener('submit', handleFormSubmit)

// Takes quote object and saves this to the database. One DB confirmed save then renders new quote object to page
const createQuote = quote => {
    fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(quote)
    }).then(resp => resp.json()).then(parseQuoteWithLikes).catch(error => {
       alert(error.message)
    })
}

// Handles delete button event. Deletes quote from DB and removes from page without refreshing
const handleDeleteBtnEvent = (event, li, quoteId) => {
    fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: "DELETE"
    }).then(resp => resp.json()).then(() => li.remove()).catch(error => alert(error.message))
}

// Handles like button event. Creates new like and adds to DB - when successful updates DOM
const handleLikesBtnEvent = (event, quoteId) => {
    fetch('http://localhost:3000/likes', {
        method: "POST",
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({quoteId, createdAt: Math.floor(Date.now() / 1000)})
    }).then(resp => resp.json()).then(incrementDOMLikes(event)).catch(error => alert(error.message))
   
}

// Increment likes in the DOM
const incrementDOMLikes = event => {
    let currentLikes = event.target.innerText.split(' ')[1]
    currentLikes = parseInt(currentLikes) + 1
    currentLikes = currentLikes.toString()
    event.target.innerText = `Likes: ${currentLikes}`
}

const createLike = () => {}

getQuotesWithLikes()
