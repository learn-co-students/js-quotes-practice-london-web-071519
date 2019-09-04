// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. // DEFER script :) 

const listUl = document.querySelector("#quote-list")
const url = "http://localhost:3000/quotes?_embed=likes"

document.addEventListener('DOMContentLoaded', findQuotes)

function findQuotes() {
  return fetch("http://localhost:3000/quotes?_embed=likes")
    .then(resp => resp.json())
    .then(allQuotes)
}

function allQuotes(quotes) {
   quotes.forEach(quote => {
      listQuotes(quote)
   })
}


function listQuotes(quote) {
   let li = document.createElement("li")
   li.classList.add = "quote-card"
   let block = document.createElement("blockquote")
   block.classList.add = "blockquote"
   block.innerHTML = `<p>${quote.quote}</p> 
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>`
   let likesBtn = document.createElement("button")
   let deleteBtn = document.createElement("button")
   likesBtn.className = 'btn-success'
   likesBtn.innerText = "Likes"
   likesBtn.addEventListener('click', e => {likePost(quote.id); likeQuote(e)})
   deleteBtn.addEventListener('click', e => {deleteQuote(quote.id); deleteQuoteFromPage(e)})
   let span = document.createElement("span")
   span.innerText = `${quote.likes.length}`
   likesBtn.append(span)
   deleteBtn.className = 'btn-danger'
   deleteBtn.innerText = "Delete" 
      li.append(block)
      li.append(likesBtn)
      li.append(deleteBtn)
      listUl.append(li) 
} 

function likePost(id) {
      fetch("http://localhost:3000/likes", {
         method: "POST", 
         headers: {
            "Content-Type": "application/json", 
            Accept: "application/json"
         },
         body: JSON.stringify({
           quoteId: id})
     } 
      ).then(resp => resp.json())
   }

   function likeQuote(e) {
      e.target.childNodes[1].innerText = parseInt(e.target.childNodes[1].innerText) + 1
   }

   function deleteQuote(id) {
      return fetch(`http://localhost:3000/quotes?_embed=likes/${id}`, {
         method: "DELETE"
      })
   }

   function deleteQuoteFromPage(e) {
      e.target.parentNode.remove()
   }