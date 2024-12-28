
function GetUserPersonalInfo()
{
    return axios.get(`${baseURL}/users/${UserId}`)
           .then((response)=>{
              return response.data.data;
           })
           .catch((error)=>{
             return Promise.reject(error.response)
           })
}

function GetAllUserPost()
{
    return axios.get(`${baseURL}/users/${UserId}/posts`)
           .then((response)=>{
              CreatPosts(response.data.data);
           })
           .catch((error)=>{
             return Promise.reject(error.response);
           });
}

function PutPersonalInfoData(UserData)
{
    let infodiv = document.getElementById("UserInfo");

    let profile_image =getProfileImage(UserData.profileImageLink);

    infodiv.innerHTML = ` <img id="Profile-img-Info" src="${profile_image}" />
                          <div id="User-PersonalInfo">
                            <h6>${UserData.userName}</h6>
                            <h6>${UserData.email}</h6>
                          </div>
                          <div id="User-Sckoopy-Info">
                            <span class="Number" >${UserData.postCount}</span>
                            <span>posts</span>
                            <br>
                            <span class="Number" >${UserData.commentsCount}</span>
                            <span>comments</span>
                          </div>`;
}

function LoadUserProfile()
{

    GetUserPersonalInfo()
    .then((UserData)=>{
        PutPersonalInfoData(UserData);
    })
    .catch((error)=>{
        alert(error);
    })

    GetAllUserPost()
    .catch((error)=>{
        alert(error);
    })

}

function ReloadUserProfilePage()
{
    let token = sessionStorage.getItem('token');
     if(token)
     {
        let UserInfo = JSON.parse(sessionStorage.getItem("LoggedUserInfo"));
        SetUI(UserInfo);
     }
     
     LoadUserProfile();
}

const params = new URLSearchParams(window.location.search);
const UserId = params.get('id');

const IsRightPageForEditing=true;

ReloadUserProfilePage()

document.getElementById("Post-btn-delete").addEventListener('click',()=>{

    let token = sessionStorage.getItem('token');
    confirmPostDelete(token)
    .then(()=>{
    document.getElementById("Posts-container").innerHTML="";
       GetAllUserPost();
       let PostDeleteModel =   bootstrap.Modal.getInstance(document.getElementById("DeletePostModel"));
       PostDeleteModel.hide();
    })
})

document.getElementById("Post-btn-Process").addEventListener("click",()=>{
    

    if(!IsClientLoggedIn())
        {
            alert("You must Logged in first to Add New Post!");
            return;
        }
    
        const PostTitle = document.getElementById("Post-Title").value;
        const Postbody  = document.getElementById("Post-body").value;
        const PostImg   = document.getElementById("Post-img-Path").files[0]
        let token       = sessionStorage.getItem("token");
        let PostId      = document.getElementById("Post-Id-input").value;
        const userId = JSON.parse(sessionStorage.getItem("LoggedUserInfo")).userId;
    
        let PostObj ={
            imagepath : PostImg ,
            title     : PostTitle,
            body      : Postbody,
            token     : token ,
            userId   :userId
        };
    
    
        AddUpdatePost(PostObj,PostId)
        .then((result)=>{
            alert(result);
            window.location.reload();
        })
        .catch((error)=>{
            alert(error);
        })
    

});

const logbtn = document.getElementById("btn-logout");

if(logbtn)
{
    logbtn.addEventListener("click",()=>{
        
        const token = sessionStorage.getItem("token");
        const userId = JSON.parse(sessionStorage.getItem("LoggedUserInfo")).userId;
            
        const body ={
            UserId : userId
        }
         
        Logout(body,token)
        .then(()=>{
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("LoggedUserInfo");
         
            window.location.reload();
        })
        .catch(()=>{
            alert("Logout faild")
        })


    })
}