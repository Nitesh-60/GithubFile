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
    let repoList = ``;
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
    document.querySelector("#repoDetails").innerHTML = repoList

}



const updatePaginationBar = (profile, currentPage, perPage, githubUserName) => {
  const paginationContainer = document.getElementById("paginationBar");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(profile.public_repos / perPage);
  const visiblePages = 5;

  // Calculate the start and end of the visible window
  let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  let endPage = Math.min(totalPages, startPage + visiblePages - 1);

  // Adjust the window if it goes beyond the limits
  if (endPage - startPage + 1 < visiblePages) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  // Function to create page link and add event listener
  const createPageLink = (pageNumber) => {
    const pageLink = document.createElement("a");
    pageLink.href = "#";
    pageLink.classList.add("page-link");
    pageLink.textContent = pageNumber;

    pageLink.addEventListener("click", function () {
      renderRepo(githubUserName, pageNumber, perPage);
    });

    if (pageNumber === currentPage) {
      pageLink.classList.add("active");
    }

    return pageLink;
  };

  
  // Add "Olser" button
  const firstPageButton = createPageLink(1);
  firstPageButton.textContent = "Older";
  paginationContainer.appendChild(firstPageButton);

  // Add "Previous" button
  const previousButton = createPageLink(currentPage - 1);
  previousButton.textContent = "<<";
  paginationContainer.appendChild(previousButton);


  // Add sliding page links
  for (let i = startPage; i <= endPage; i++) {
    const pageLink = createPageLink(i);
    paginationContainer.appendChild(pageLink);
  }

  // Add "Next" button
  const nextButton = createPageLink(currentPage + 1);
  nextButton.textContent = ">>";
  paginationContainer.appendChild(nextButton);

  // Add "Newer" button
  const lastPageButton = createPageLink(totalPages);
  lastPageButton.textContent = "Newer";
  paginationContainer.appendChild(lastPageButton);

  
};



const renderRepo = async (githubUserName, page, perPage) => {
  try {
    const gitRepos = await getGithubRepo(githubUserName, page, perPage);
    const completeGithubProfile = await getGithubProfile(githubUserName);

    getRepoList(gitRepos);
    updatePaginationBar(completeGithubProfile, page, perPage,githubUserName);
  } catch (error) {
    console.error(error);
  }
};


        

document.addEventListener('DOMContentLoaded', ()=>{
    
    const searchForm = document.querySelector("#searchForm");
    let page = 1;
    let perPage = 10;
    let githubUserName= ''

    searchForm.addEventListener('submit', async (event)=>{
        
        event.preventDefault();;
        
        const searchInput = document.querySelector("#searchInput");
        githubUserName = searchInput.value.trim();
        
        if(githubUserName.length > 0){
           
            const gitProfile = await getGithubProfile(githubUserName)
           
           if(gitProfile.login){
                // const gitRepos = await getGithubRepo(githubUserName,page,perPage)
                getProfiledetails(gitProfile)
                // getRepoList(gitRepos)
                renderRepo(githubUserName,page,perPage)
                
                
                document.querySelector("#searchUserName").style.display = 'none'
                document.querySelector("#profileDetails").style.display = 'block, flex'
                document.querySelector("#paginationContainer").style.display = 'block'

                
            }
        }

    }) 

    const repositoryButton = document.querySelector("#getRepositoryBtn");
    if(repositoryButton !== null){
        repositoryButton.addEventListener('click', async ()=>{
            console.log("Clicked")
            perPage = document.querySelector("#perPage").value;
            page=1;
            renderRepo(githubUserName,page,perPage)
            document.querySelector("#paginationContainer").style.display = 'block'
        })
    } 

    

    
    


})
