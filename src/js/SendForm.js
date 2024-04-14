import {
  saveTask,
  onGetTasks,
  deleteTask,
  updateTask
} from "./firebase.js"

const EnviForm = document.getElementById('enviform')
const BoxCommit = document.querySelector('.myComment')

let id = ""

window.addEventListener("DOMContentLoaded", async () => {
  onGetTasks((querySnapshot) => {
    BoxCommit.innerHTML = ""
    querySnapshot.forEach((doc) => {
      const task = doc.data()
      BoxCommit.innerHTML += `
      <div class="section">
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
          <p>${task.Commit}</p>
          <div class="txtAreaEdit">
          <textarea class="txtArea" data-id="${doc.id}" nome="meuTextarea" cols="60" rows="4"></textarea>
          <button>UPDATE</button>
          </div>
          </div>
        </div>
      </div>
    </div>`
    })

    const btnsEdit = BoxCommit.querySelectorAll('.btn-edit')
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

      BoxCommit.addEventListener("click", async (e) => {
        if (e.target.tagName === 'BUTTON' && e.target.textContent === 'UPDATE') {
          e.preventDefault()
          const listItem = e.target.closest('.section')
          const textarea = listItem.querySelector('.txtArea')
          const updatedText = textarea.value

          await updateTask(id, { Commit: updatedText })

          const btnEdit = listItem.querySelector('.txtAreaEdit button')
          const txt = listItem.querySelector('.txt-comments p')
          textarea.style.display = "none"
          btnEdit.style.display = "none"
          txt.style.display = "block"
        }
      })
    })

    const btnsDelete = BoxCommit.querySelectorAll('.btn-delete')
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
          await deleteTask(dataset.id)
          addDivConfirm.remove()
        })
      })
    )

    const plusMinsElements = document.querySelectorAll('.plus-minus')
    plusMinsElements.forEach(element => {
      const counter = element.querySelector('.counter')
      const plusButton = element.querySelector('.plus')
      const minusButton = element.querySelector('.minus')

      plusButton.addEventListener("click", () => {
        counter.textContent = parseInt(counter.textContent) + 1
      })

      minusButton.addEventListener("click", () => {
        if (parseInt(counter.textContent) > 0) {
          counter.textContent = parseInt(counter.textContent) - 1
        }
      })
    })
  })
})

EnviForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  const Commit = EnviForm["envicommit"]
  await saveTask(Commit.value)
  id = ""
  EnviForm.reset()
  BoxCommit.focus()
})