// 全域變數區
const dataPanel = document.querySelector("#data-Panel");
const baseUrl = "https://lighthouse-user-api.herokuapp.com/api/v1/users"
const personalUrl = baseUrl + '/'
const profiles = []
const modal = document.querySelector('#exampleModal')
let filteredProfile = []
const searchInput = document.querySelector('#search-input')
const searchForm = document.querySelector('#search-form')
const profilePerPage = 12
const paginator = document.querySelector('#paginator')
const addToFavorite = document.querySelector('#add-to-favorite')
//API 回傳資料格式
// {
// "id": 601,
// "name": "Guillaume",
// "surname": "Vincent",
// "email": "guillaume.vincent@example.com",
// "gender": "male",
// "age": 25,
// "region": "CH",
// "birthday": "1995-05-05",
// "avatar": "https://randomuser.me/api/portraits/men/88.jpg",
// "created_at": "2020-04-01T09:37:57.270Z",
// "updated_at": "2020-04-01T09:37:57.270Z"
// }

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
        <i class="fas fa-user-plus" id="add-to-favorite" data-id="${element.id}"></i>
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

function renderSearch(keyword) {
  filteredProfile = profiles.filter(profile => {
    return profile.name.toLowerCase().includes(keyword)
  })
  // filteredProfile = profiles.filter(profile => 
  //   profile.name.toLowerCase().includes(keyword) 
  // )
}

function renderPagination(amount) {
  const numberOfPages = Math.ceil(amount / profilePerPage)
  let rawHTML = ``
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}
//return 切割的小部分 profiles
function partOfProfiles(page) {
  const data = filteredProfile.length ? filteredProfile : profiles
  const startIndex = (page - 1) * profilePerPage
  return data.slice(startIndex, startIndex + profilePerPage)
}

function addToFriend(id) {
  //呼叫friendList資料夾, 如果沒有就建立空陣列
  const list = JSON.parse(localStorage.getItem("friendList")) || []
  const profile = profiles.find(profile => profile.id === id)
  //先確認點到的ID是否存在 list中
  if (list.some(profile => profile.id === id)) {
    return alert('已在好友清單中')
  }
  list.push(profile)
  //把資料存到friendList資料夾 , 之後提供給另一個分頁用
  localStorage.setItem("friendList", JSON.stringify(list))

}



//監聽器區
// model & add to favorite 
dataPanel.addEventListener('click', function onFileClicked(event) {
  if (event.target.matches('#modal')) {
    showModal(Number(event.target.dataset.id))
  }

  if (event.target.matches('#add-to-favorite')) {
    const id = Number(event.target.dataset.id)
    addToFriend(id)

  }

})
//search
searchForm.addEventListener('click', function onSearchClicked(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  renderSearch(keyword)
  randerfile(partOfProfiles(1))
  renderPagination(filteredProfile.length)
})
//paging
paginator.addEventListener('click', function onClickedPaginator(event) {
  if (event.target.tagName !== 'A') {
    return
  }
  const page = event.target.dataset.page
  randerfile(partOfProfiles(page))
})



//Ajax 呼叫資料
axios.get(baseUrl)
  .then(response => {
    // profiles.push(...response.data.results)
    for (const profile of response.data.results) {
      profiles.push(profile)
    }
    renderPagination(profiles.length)
    randerfile(partOfProfiles(1))

  })