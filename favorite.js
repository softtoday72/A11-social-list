// 全域變數區
const dataPanel = document.querySelector("#data-Panel");
const baseUrl = "https://lighthouse-user-api.herokuapp.com/api/v1/users"
const personalUrl = baseUrl + '/'
const profiles = JSON.parse(localStorage.getItem('friendList'))
let filteredProfile = []
const modal = document.querySelector('#exampleModal')
const searchInput = document.querySelector('#search-input')
const searchForm = document.querySelector('#search-form')
const profilePerPage = 12
const paginator = document.querySelector('#paginator')

const removeFavorite = document.querySelector('#remove-from-favorite')


//函式區
function randerfile(data) {
  let rawHTML = ``
  data.forEach(element => {

    rawHTML += `<div class="row col-sm-3">
    <div class = "mb-2">
    <div class="card">
      <img src="${element.avatar}" class="card-img-top rounded-circle pt-2" alt="...">
      <div class="card-body">
        <h5 class="card-title">${element.name} ${element.surname}</h5>
      <div class="icon d-flex justify-content-between align-items-center">
        <a href="#" class="btn btn-primary"data-bs-toggle="modal" data-bs-target="#exampleModal" id="modal" data-id="${element.id}">More</a>
        <i class="fas fa-user-plus" id="remove-from-favorite" data-id="${element.id}"></i>
      </div>
        
      </div>
    </div>
  </div>
    </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

function showModal(id) {
  const modalTitle = document.querySelector('.modal-title')
  const modalAvatar = document.querySelector('.modalAvatar')
  const modalEmail = document.querySelector('.modalEmail')
  const modalAge = document.querySelector('.modalAge')
  const modalGender = document.querySelector('.modalGender')
  const modalRegion = document.querySelector('.modalRegion')
  const modalBirthday = document.querySelector('.modalBirthday')
  const modalUpdate = document.querySelector('.modalUpdate')
  //把上一個modal資料清空
  modalTitle.innerText = ``
  modalAvatar.src = ``
  modalEmail.innerHTML = `Email : `
  modalAge.innerHTML = `Age : `
  modalGender.innerHTML = `Gender : `
  modalRegion.innerHTML = `Region : `
  modalBirthday.innerHTML = `Birthday : `
  modalUpdate.innerHTML = `latest update : `
  //AJAX呼叫資料
  axios.get(personalUrl + id)
    .then(response => {
      const data = response.data
      modalTitle.innerText = `${data.name}  ${data.surname}`
      modalAvatar.src = data.avatar
      modalEmail.innerHTML = `Email : ${data.email}`
      modalAge.innerHTML = `Age : ${data.age}`
      modalGender.innerHTML = `Gender : ${data.gender}`
      modalRegion.innerHTML = `Region : ${data.region}`
      modalBirthday.innerHTML = `Birthday : ${data.birthday}`
      modalUpdate.innerHTML = `latest update : ${data.updated_at}`
    })
    .catch(error => {
      console.log(error)
    })
}

//分頁器
function renderPagination(amount) {
  const numberOfPages = Math.ceil(amount / profilePerPage)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

//刪除好友
function removeFriend(id) {
  if (!profiles || !profiles.length) return

  const profileIndex = profiles.findIndex(profile => profile.id === id)
  //如果找不到 , 就結束這個函式
  if (profileIndex === -1) return
  
  profiles.splice(profileIndex, 1)
  
  localStorage.setItem("friendList", JSON.stringify(profiles))

  randerfile(profiles)
  renderPagination(profiles.length)
}

//return 切割的小部分 profiles
function partOfProfiles(page) {
  const data = filteredProfile.length ? filteredProfile : profiles
  const startIndex = (page - 1) * profilePerPage
  return data.slice(startIndex, startIndex + profilePerPage)
}


//監聽器區
// model & remove from favorite 
dataPanel.addEventListener('click', function onFileClicked(event) {
  if (event.target.matches('#modal')) {
    showModal(Number(event.target.dataset.id))

  }

  if (event.target.matches('#remove-from-favorite')) {
    const id = event.target.dataset.id
    
    removeFriend(Number(id))
    
  }

})

//paging
paginator.addEventListener('click', function onClickedPaginator(event) {
  if (event.target.tagName !== 'A') {
    return
  }
  const page = event.target.dataset.page
  randerfile(partOfProfiles(page))
})

randerfile(partOfProfiles(1))
renderPagination(profiles.length)
