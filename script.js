const API_URL = `https://api.github.com/users`;
const Fixes_Avatar = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhLja_b1nZD7bzgvwtJ0JlhlQaKR3ModNySg&usqp=CAU`

const errorMessage = (status) => {
    const messageBlock = document.querySelector("#messageBlock")
    let errorString = ``;
    if(status === 404){
        errorString = `
        <div style="
            width:55vw;
            color: black;
            font-size: xx-large;
            padding: 16px;
            background-color:rgb(202, 103, 103)";
        >
            Profile does not exist
        </div>`;
    }
    messageBlock.innerHTML = errorString;

    setTimeout(()=> messageBlock.innerHTML = ``, 3000)
}

const getGithubProfile = async (username) =>{

    try {
        const response = await fetch(`${API_URL}/${username}`);
        if(response.status !== 200){
            if(response.status === 404){
                errorMessage(response.status)
            }
            new Error(`Error code - ${response.status}`);
        }

        const data = await response.json();
        return data
        
    } catch (error) {
        console.log(error);
    }

;}

const getGithubRepo = async (username,page,perPage) =>{

    try {
        const response = await fetch(`${API_URL}/${username}/repos?page=${page}&per_page=${perPage}`);
        if(response.status !== 200){
            new Error(`Error code - ${response.status}`);
        }

        const data = await response.json();
        return data
        
    } catch (error) {
        console.log(error);
    }

;}

const getProfiledetails = (data) => {
    let profileData = ``;
    profileData += `
            <div id="profileImage">
                <img src="${data.avatar_url}" alt="profile-img width=15vw ">
            </div>`
    profileData += `<div id="profileSummary">
                <h1 id="profileName">
                    ${data.name}  
                </h1>`
    profileData += `<div id="summaryContainer">`
    profileData += ` <div id="descriptions">`
    if(data.bio !== null){
        profileData += `Bio: ${data.bio}`
    }
    profileData += ` </div>`
    profileData += `<div id="location">
                        Location: ${data.location}
                    </div>
                    <div id="socialMedia">`
    if(data.twitter_username !== null){
        profileData += `<a href="https://www.twitter.com/${data.twitter_username}" target="_blank" >Twiter</a>`
    }
    profileData +=  `<a href="https:/github.com/${data.login}" target="_blank">Github</a>`
    profileData +=  `</div>`
    profileData +=  `</div>`
    profileData += `</div>`
    document.querySelector("#profileDetails").innerHTML = profileData
}

const getRepoList = (repos) =>{
    let repoList = ``
    repoList += `<div id="paginationContainer">` 
    repoList += `<div class="header">Repositories</div>`
    repoList += `<div class="repositoryNumber">
            <label for="perPage">Repositories Per Page:</label>
            
            <select class="paginationContainer" id="perPage">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
            <button id="getRepositoryBtn">Get Repository</button>
        </div>`
    repoList += `</div>`
    repoList += `<div id="repoDetails">`
    if(repos.length){
        repos.forEach((repo)=>{
            repoList += `<div class="repos">
                        <div class="repoName">
                            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                        </div>
                        <div class="repoDescriptions">
                            ${repo.description !== null ? repo.description : "" }
                        </div>`

            repoList += `<div class="repoTopics">`
            if(repo.topics){
                repo.topics.forEach((topic)=>{
                    repoList += `<li> ${topic}</li>`
                })
            repoList += `</div>`
        }     
         repoList += `</div>`
        })
    }
    repoList += `</div>
                </div>`
    
    document.querySelector("#repoContainer").innerHTML = repoList

}

// const getPaginatedRepositories = async(username,perPage,page)=>{
//     try {
//         const response = await fetch(`${API_URL}/${username}/repos?page=${page}&per_page=${perPage}`);
//         if(response.status !== 200){
//             new Error(`Error code - ${response.status}`);
//         }

//         const data = await response.json();
//         return data
        
//     } catch (error) {
//         console.log(error);
//     }
// }

document.addEventListener('DOMContentLoaded', ()=>{
    
    const searchForm = document.querySelector("#searchForm");
    let page = 1;
    let perPage = 10;
    
    searchForm.addEventListener('submit', async (event)=>{
        
        event.preventDefault();;
        
        const searchInput = document.querySelector("#searchInput");
        const githubUserName = searchInput.value.trim();
        
        if(githubUserName.length > 0){
           
            const gitProfile = await getGithubProfile(githubUserName)
           
           if(gitProfile.login){
                let gitRepos = await getGithubRepo(githubUserName,page,perPage)
                getProfiledetails(gitProfile)
                getRepoList(gitRepos)
                
                document.querySelector("#searchUserName").style.display = 'none'
                document.querySelector("#profileDetails").style.display = 'block, flex'
                // document.querySelector("#repoContainer").style.display = 'block,flex'
           }
        }

        const repositoryButton = document.querySelector("#getRepositoryBtn");

        repositoryButton.addEventListener("click", async (event)=>{
            event.preventDefault()
            console.log("Clicked")
            perPage = document.querySelector("#perPage").value;
            page=1;
            let gitRepos = await getGithubRepo(githubUserName,page,perPage)
            getRepoList(gitRepos)
        })
    })  
})
