import {
  saveMyComment,
  onGetMyComment,
  deleteMyComment,
  updateComment
} from "./firebase.js"

const Reply = document.querySelectorAll('.contennerSection')

let currentForm = null
let id = ""

Reply.forEach(element => {
  const ReplyButton = element.querySelector('button')
  const formComment = element.querySelector('.section')
  const PlayMyComment = element.querySelector('.section')
  MyComment()


  ReplyButton.addEventListener("click", async () => {
    const name = element.querySelector('.avatar strong').textContent.trim()
    if (currentForm) {
      currentForm.remove()
    }

    const newForm = document.createElement('form')
    if (element.querySelector('.thisCommet')) {
      newForm.className = 'ThisComment'
    } else {
      newForm.className = 'formReply'
    }

    newForm.id = 'enviMycomment'
    newForm.innerHTML = `
      <img src="images/avatars/image-juliusomo.png" alt="Avatar">
      <textarea id="envicommit" cols="60" rows="4">@${name} </textarea>
      <button>REPLY</button>`

    formComment.appendChild(newForm)

    currentForm = newForm
    const textArea = newForm.querySelector('textarea')
    textArea.focus()
    const nameLength = name.length + 2
    textArea.setSelectionRange(nameLength, nameLength)

    newForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      const comment = newForm["envicommit"]
      await saveMyComment(comment.value)
      currentForm.remove()
    })
  })

  function MyComment() {
    const newDiv = document.createElement('div')
    if (element.querySelector('.thisCommet')) {
      newDiv.className = 'ThisMyComment'
    } else {
      newDiv.className = 'section'
    }
    onGetMyComment(async (querySnapshot) => {
      newDiv.innerHTML = ""
      querySnapshot.forEach((doc) => {
        const myComment = doc.data()
        const commenterName = myComment.comment.match(/@(\w+)/)

        if (commenterName && commenterName[1] === element.querySelector('.avatar strong').textContent.trim()) {
          newDiv.innerHTML += `  
          <div class="comments">
              <div class="plus-minus">
                  <img class="plus" src="images/icon-plus.svg" alt="Icon-Plus">
                  <span class="counter">10</span>
                  <img class="minus" src="images/icon-minus.svg" alt="Icon-Minus">
              </div>
              <div>
                  <div class="head-avatar">
                      <div class="avatar">
                          <img src="images/avatars/image-juliusomo.png" alt="Avatar">
                          <strong>juliusoma</strong>
                          <p class="you">you</p>
                          <p>2 days ago</p>
                      </div>
                      <div class="bts">
                          <button class="btn-delete" data-id="${doc.id}"><img src="images/icon-delete.svg" alt="Delete">Delete</button>
                          <button class="btn-edit" data-id="${doc.id}"><img src="images/icon-edit.svg" alt="Edit">Edit</button>
                      </div>
                  </div>
                  <div class="txt-comments">
                      <p>${myComment.comment}</p>
                      <div class="txtAreaEdit">
                          <textarea class="txtArea" data-id="${doc.id}" nome="meuTextarea" cols="60" rows="4"></textarea>
                          <button>UPDATE</button>
                      </div>
                  </div>
              </div>
          </div>`
        }
        PlayMyComment.appendChild(newDiv)
      })
      const btnsEdit = newDiv.querySelectorAll('.btn-edit')
      btnsEdit.forEach((btn) => {
        btn.addEventListener("click", ({ target: { dataset } }) => {
          const taskId = dataset.id
          const listItem = btn.closest('.section')
          const taskText = listItem.querySelector('.txt-comments p').textContent

          const textarea = listItem.querySelector('.txtArea')
          const btnEdit = listItem.querySelector('.txtAreaEdit button')
          const txt = listItem.querySelector('.txt-comments p')
          textarea.style.display = "block"
          textarea.focus()
          btnEdit.style.display = "block"
          txt.style.display = "none"

          textarea.value = taskText
          id = taskId
        })

        newDiv.addEventListener("click", async (e) => {
          if (e.target.tagName === 'BUTTON' && e.target.textContent === 'UPDATE') {
            e.preventDefault()
            const listItem = e.target.closest('.section')
            const textarea = listItem.querySelector('.txtArea')
            const updatedText = textarea.value

            await updateComment(id, { comment: updatedText })

            const btnEdit = listItem.querySelector('.txtAreaEdit button')
            const txt = listItem.querySelector('.txt-comments p')
            textarea.style.display = "none"
            btnEdit.style.display = "none"
            txt.style.display = "block"
          }
        })
      })

      const btnsDelete = newDiv.querySelectorAll('.btn-delete')
      btnsDelete.forEach((btn) =>
        btn.addEventListener("click", async ({ target: { dataset } }) => {
          const addDivConfirm = document.createElement("div")
          addDivConfirm.innerHTML = `
        <div>
          <div class="modal">
            <h1>Delete comment</h1>
            <p>Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
            <div class="bt-YesNo">
              <button class="no">NO, CANSEL</button>
              <button class="yes">YES, DELETE</button>
            </div>
          </div>
        </div>`
          addDivConfirm.classList.add("bgConfirm")
          document.body.appendChild(addDivConfirm)
          addDivConfirm.querySelector('.no').addEventListener("click", () => {
            addDivConfirm.remove()
          })
          addDivConfirm.querySelector('.yes').addEventListener("click", async () => {
            await deleteMyComment(dataset.id)
            addDivConfirm.remove()
          })
        })
      )
    })
  }
})
document.querySelector('.formSend').addEventListener("click", () => {
  if (currentForm) {
    currentForm.remove()
  }
})