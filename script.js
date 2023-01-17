const APIURL = 'https://api.github.com/users/'

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

getUser('aisl1n')

async function getUser(username) {
    const resp = await fetch(APIURL + username);
    if (resp.status == 404) {
        handleUserNotFind(username)
    } else {
        const respData = await resp.json();
        createUserCard(respData)
        getRepos(username)
    }

}

function handleUserNotFind(username) {
    const errorCard = `
        <h1 class="error-message">Não foi possível encontrar o usuário: "${username}"</h1>
    `
    main.innerHTML = errorCard;
}

async function getRepos(username) {
    const resp = await fetch(APIURL + username + '/repos');
    const respData = await resp.json();

    addReposToCard(respData)
}

function createUserCard(user) {

    if (user.bio === null) {
        user.bio = ''
    }

    const cardHTML = `
        <div class="card">
            <div>
                <img class="avatar" src="${user.avatar_url}" alt="${user.name || user.login}" />
            </div>
            <div class="user-info">
                <a class="profile" href="${user.html_url}">${user.name || user.login.charAt(0).toUpperCase() + user.login.slice(1)}</a>
                <span>${user.location != null ? user.location : ''}</span>
                <p>${user.bio}</p>
                <ul class="info">
                    <li><strong>Followers</strong>${user.followers}</li> 
                    <li><strong>Following</strong>${user.following}</li> 
                    <li><strong>Repos</strong>${user.public_repos}</li> 
                </ul>
                <div class="repos" id="repos">
                </div>
            </div>
        </div>
    `;

    main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
    const reposEl = document.getElementById('repos')
    repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 10)
        .forEach(repo => {
            const repoEl = document.createElement('a')
            repoEl.classList.add('repo');

            repoEl.href = repo.html_url;
            repoEl.target = "_blank";
            repoEl.innerText = repo.name;

            reposEl.appendChild(repoEl)
        })
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = search.value;

    if (user) {
        getUser(user);
        search.value = ""
    }
})