const APIURL = 'https://api.github.com/users/'

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')
    //async- khai báo 1 hàm bất đồng bộ- tự động biến đổi 1 hàm thông thường thành một Promise và trả về kết quả trong hàm của nó
async function getUser(username) { //Async : khai báo một hàm bất đồng bộ
    try {
        //sử dụng thư viện axios và gửi yêu cầu đến APIURL('https://api.github.com/users/')
        const { data } = await axios(APIURL + username) //await- tạm dừng việc thực hiện các hàm async, khi được đặt trước một Promise, nó sẽ đợi cho đến khi Promise kết thúc và trả về kết quả/
            //trả về Promises và giải quyết với phản hồi data từ axios.
        createUserCard(data)
        getRepos(username)
    } catch (error) {
        if (error.response.status == 404) {
            createErrorCard('No profile with this username!')
        }
    }
}

async function getRepos(username) {
    try {
        const { data } = await axios(APIURL + username + '/repos?sort=created')
        addReposToCard(data)
    } catch (error) {
        createErrorCard('Problem fetching repos!')
    }
}

function createUserCard(user) {
    const userID = user.name || user.login
    const userBio = user.bio ? `<p>${user.bio}</p>` : ''
    const cardHTML = `
    <div class="card">
        <div>
            <img src="${user.avatar_url}" alt="${user.name}" class="avatar">        
        </div>
        <div class="user-info">
            <h2>${userID}</h2>
            ${userBio}
            <ul>
                <li>${user.followers}<strong>Followers</strong></li>
                <li>${user.following}<strong>Following</strong></li>
                <li>${user.public_repos}<strong>Repos</strong></li>
            </ul>
            <div id="repos"></div>
        </div>
    </div>
    `
    main.innerHTML = cardHTML
}

function createErrorCard(msg) {
    const cardHTML = `
    <div class="card">
        <h1>${msg}</h1>
    </div>
    `
    main.innerHTML = cardHTML
}

function addReposToCard(repos) {
    const reposEl = document.getElementById('repos')
    repos.slice(0, 5).forEach(
        repo => {
            const repoEl = document.createElement('a')
            repoEl.classList.add('repo')
            repoEl.href = repo.html_url
            repoEl.target = '_blank' //repoEl là element mà sự kiện đó diễn ra. _blank: mở tài liệu được liên kết trong một cửa sổ hoặc tab mới.
            repoEl.innerText = repo.name
            reposEl.appendChild(repoEl)
        }
    )
}
form.addEventListener('submit', (e) => {
    e.preventDefault()

    const user = search.value

    if (user) {
        getUser(user)
        search.value = ''
    }
})