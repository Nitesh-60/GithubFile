const API_URL = `https://api.github.com/users`;

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

const getProfiledetails = (data) => {
    let profileData = ``;
    profileData += `
            <div id="profileImage">
                <img src="${data.avatar_url}" alt="profile-img width=15vw">
            </div>
            <div id="profileSummary">
                <h1 id="profileName">
                    ${data.name}  
                </h1>
                <div id="summaryContainer">
                    <div id="descriptions">
                        ${data.bio}
                    </div>
                    <div id="location">
                        ${data.location}
                    </div>
                    <div id="socialMedia">
                        <p>Linkedin</p>
                        <p>Github</p>
                    </div>
                </div>

            </div>`
    document.querySelector("#profileDetails").innerHTML = profileData
}

document.addEventListener('DOMContentLoaded', ()=>{
    const searchForm = document.querySelector("#searchForm");
    searchForm.addEventListener('submit', async (event)=>{
        event.preventDefault();;
        const searchInput = document.querySelector("#searchInput");
        const githubUserName = searchInput.value.trim();
        console.log(githubUserName); 
        if(githubUserName.length > 0){
           const gitProfile = await getGithubProfile(githubUserName)
           if(gitProfile.login){
                getProfiledetails(gitProfile)
                document.querySelector("#searchUserName").style.display = 'none'
                document.querySelector("#profileDetails").style.display = 'block, flex'
           }
        }
    })
})