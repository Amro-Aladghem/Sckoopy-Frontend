
function CreateTagsIcons(Tags)
{
    if (Tags == null) {
        return "";
    }

    let htmlsource = ``;
    for(Tage of Tags)
    {
        htmlsource += `<a id='Tag' href="" class="Post-Tag">${Tage.name}</a>`;
    }

    return htmlsource;
}

function GetPostImgIfExsits(PostImg)
{
    if (typeof PostImg === "string" && PostImg.trim() !== "") {

        return `<img src='${PostImg}' class="card-img-top img-fluid" >` ;
    }
    
    return "";
    
}

function IsLoggedUserPost(authorid)
{
    let user = JSON.parse(sessionStorage.getItem('LoggedUserInfo'));
    return  IsRightPageForEditing && user != null && authorid == user.userId;
}

function CreatPost(PostInfo)
{

    let Postsdiv = document.getElementById("Posts-container");

    let profileImage = getProfileImage(PostInfo.author.profileImageLink);

    let TagsString = CreateTagsIcons(PostInfo.tags);

    let PostImg = GetPostImgIfExsits(PostInfo.postImageLink);

    let author = PostInfo.author;

    let IsMyPost = IsLoggedUserPost(author.userId);

    let Time = PostInfo.createdDateTime.split('T')[0];

    let editbtn ="", deletebtn="";

    if(IsMyPost)
    {
        editbtn   = `<button onclick='editbtnclicked("${encodeURIComponent(JSON.stringify(PostInfo))}")' id='edit-btn' style=' margin-left: 5px; float: right' type="button" data-bs-target="#NewPostModel" class="btn btn-dark">edit</button>`;
        deletebtn =`<button onclick='deletebtnclicked("${encodeURIComponent(JSON.stringify(PostInfo))}")' id='delete-btn' style=' float: right' type="button" class="btn btn-danger" data-bs-target="#DeletePostModel">delete</button>`;
    }


   Postsdiv.innerHTML += `<div  class="Post">
                  <div class="card" >
                      <div class="card-header">
                      <img onclick="GoToUserProfile(event,this)"  data-user-id="${author.userId}" class="img-profile" src='${profileImage}' />
                      <a  onclick="GoToUserProfile(event,this)"  data-user-id="${author.userId}" class="user-name" >${author.userName}</a>
                      ${editbtn}
                      ${deletebtn}
                      </div>
                      ${PostImg}
                      <div post-id ='${PostInfo.postId}' class="card-body pt-0" onclick="GoToPostInfoPage(event,this)">
                          <p id="Post-time">${Time}</p>
                          <p class="card-text">${PostInfo.body}</p>
                          <div class="Post-Info">
                              <img src="pencil.png" id="Comment-img"/> 
                              <p id="Comments-num">(${PostInfo.commentCount}) Comments</p>  
                              ${TagsString}
                             <div id="comments">
                            </div>
                          </div>
                      </div>
                  </div>
              </div>`;
}

function GoToPostInfoPage(event,Post)
{
    if(!IsRightPageForEditing)
    {
        return;
    }

    if (event.target.tagName.toLowerCase() === 'a') {
        return; 
    }

    let postid = Post.getAttribute('post-id');
    window.location.href =`Post.html?id=${postid}`;
}

function GoToUserProfile(event,clickedLinkElement)
{
    let userid = clickedLinkElement.getAttribute('data-user-id');

    event.preventDefault();

    if(!userid)
    {
        return;
    }

    window.location.href="Profile.html?id="+userid;
}

function getProfileImage(profileImage) {
   if (typeof profileImage === "string" && profileImage.trim() !== "") {
     return profileImage;
   }
   return "boy.png"; 
}

function CreatPosts(PostsData)
{
    for (Post of PostsData)
    {
        CreatPost(Post);
    }
}


function editbtnclicked(PostInfo)
{
    let PostModel =  new bootstrap.Modal(document.getElementById("NewPostModel"),{});
    let oldpost = JSON.parse(decodeURIComponent(PostInfo));

    document.getElementById('Post-Id-input').value=oldpost.postId;
    document.getElementById('Model-Title').innerHTML="Edit";
    document.getElementById("Post-body").value= oldpost.body;
    document.getElementById("Post-Title").value = oldpost.title;
    document.getElementById('Post-btn-Process').innerHTML="edit";

    PostModel.toggle();
}   

function deletebtnclicked(PostInfo)
{
   let PostDeleteModel = new bootstrap.Modal(document.getElementById("DeletePostModel"),{});
   let oldpost = JSON.parse(decodeURIComponent(PostInfo));
   document.getElementById("delete-post-id-input").value=oldpost.postId;
   PostDeleteModel.toggle();

}

function confirmPostDelete(token){

    const postid = document.getElementById("delete-post-id-input").value;
   return axios.delete(`${baseURL}/posts/`+postid,{

                headers : {
                    "Authorization": `Bearer ${token}`,
                }
           })
          .then(()=>{
             return "The Post was deleted successfully !";
          })
          .catch((error)=>{
            return Promise.reject(error.message);
          })

}

function AddUpdatePost(PostObj,PostID="") {

    let dataform = new FormData();
    dataform.append('Title',PostObj.title);
    dataform.append('Body',PostObj.body);
    dataform.append('Image',PostObj.imagepath);
    dataform.append("UserId",PostObj.userId);
 
    if(PostID == "")
    {
         return axios.post(`${baseURL}/posts`,dataform,{
             headers : {
                 "Authorization": `Bearer ${PostObj.token}`,
                 "Content-Type" : "multipart/form-data"
             }
         })
         .then((response) => "The Post has been added successfully!")
         .catch((error) => Promise.reject(JSON.parse(error.message)));
    }
    else
    {
         const body = {"body":PostObj.body};
 
         return axios.put(`${baseURL}/posts/`+PostID,body,{
             headers : {
                 "Authorization": `Bearer ${PostObj.token}`,
             }
         })
         .then((response) => "The Post has been Updated successfully!")
         .catch((error) => Promise.reject(error.response || error.message));
    }
 
 }

 function IsClientLoggedIn()
{
    const token = sessionStorage.getItem("token");
    if(token)
      return true;
    else
      return false;
}

function SetUI(LoggedUserInfo=null)
{
    const LoggedDiv = document.getElementById("Logged-div");
    if(LoggedUserInfo)
    {
        let ProfileImg = getProfileImage(LoggedUserInfo.profileImageLink);
        LoggedDiv.innerHTML="";
        LoggedDiv.innerHTML=`<img class='img-profile' src='${ProfileImg}' />
                            <span onclick="ShowLoggedUserProfile()" class="user-name ">${LoggedUserInfo.userName}</span>
                            <button id="btn-logout" onclick='Logout()' type="button" class="btn btn-outline-danger btn-sm ms-4">Logout</button>`;
    }
    else
    {
        LoggedDiv.innerHTML="";
        LoggedDiv.innerHTML=` <button id="Log-btn" class="btn btn-outline-success btn-sm me-2" type="button" data-bs-toggle="modal" data-bs-target="#LoginModel">Login</button>
                <button id="Reg-btn" class="btn btn-outline-success btn-sm" type="button" data-bs-toggle="modal" data-bs-target="#RegisterModel" >Register</button>`
    }
}

function Register(NewRegisterObj)
{
   return new Promise((resolve,reject)=>{
       
       let dataform = new FormData();
       dataform.append("username",NewRegisterObj.username);
       dataform.append("password",NewRegisterObj.password);
       dataform.append("email",NewRegisterObj.email);
       dataform.append("Image",NewRegisterObj.image);


       axios.post(`${baseURL}/Register`,dataform ,{
           headers:{
              "Content-Type" : "multipart/form-data"
            }
       })
       .then((response)=>{
           sessionStorage.setItem("token",response.data.token);
           sessionStorage.setItem("LoggedUserInfo",JSON.stringify(response.data.userDTO));
           resolve(response.data.userDTO);
       })
       .catch((error)=>{
          reject(error);
       })
   })
}

function Login(UserInfo) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseURL}/Login`, {
            "username": UserInfo.username,
            "password": UserInfo.password
        }, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json", 
            }
        })
        .then((response) => {
            sessionStorage.setItem("token", response.data.token);
            sessionStorage.setItem("LoggedUserInfo",JSON.stringify(response.data.userDTO));
            resolve(response.data.userDTO);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

function Logout(body,token)
{

 return  axios.post(`${baseURL}/Logout`,body,{
    headers : {
                "Authorization": `Bearer ${token}`
                }
   })
   .then((response)=>{
     
   })
   .catch((error)=>{
     return new Promise.reject(error.message);
   })
   
  
}

function ShowLoggedUserProfile()
{
    let LoggedUser = JSON.parse(sessionStorage.getItem('LoggedUserInfo'));
    window.location.href=`Profile.html?id=${LoggedUser.userId}`;
}

function showAlert(message, type) {
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show custom-alert`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

   
    document.body.appendChild(alertDiv);

    
    setTimeout(() => {
      alertDiv.classList.remove('show'); 
      setTimeout(() => alertDiv.remove(), 150); 
    }, 4000);
}


document.getElementById("Reg-btn-Reg").addEventListener("click",()=>{

    let Image = document.getElementById("Profile-img-Path").files[0];
    let Password = document.getElementById("Reg-User-Password").value;
    let UserName= document.getElementById("Reg-User-name").value;
    let Email =document.getElementById("Reg-email").value;

    let NewRegisterObj ={
        username : UserName,
        password : Password,
        name     : UserName,
        image    : Image,
        email    : Email
    }

    Register(NewRegisterObj)
    .then((LoggedUser)=>{
        window.location.reload();
    })
    .catch((error)=>{
        alert(error.message);
    })

})

document.getElementById("Log-btn-Log").addEventListener("click",()=>{

   const Password = document.getElementById("Log-User-Password").value;
   const UserName = document.getElementById("Log-username").value;

   const UserInfo = {
    username : UserName,
    password : Password
   }

    Login(UserInfo)
   .then((UserData)=>{
    window.location.reload()
   })
   .catch((error)=>{
        showAlert('UserName or Password is not correct !','danger');
   })

})

document.getElementById("LoginModel").addEventListener("hidden.bs.modal", () => {
    document.body.focus();
});

document.getElementById("Logged-User-Profile").addEventListener('click',(event)=>{

    event.preventDefault();

   if(!IsClientLoggedIn())
   {
       alert("You must Logged in");
       return;
   }

   let LoggedUser = JSON.parse(sessionStorage.getItem('LoggedUserInfo'));
   window.location.href=`Profile.html?id=${LoggedUser.userId}`;
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
        userId    :userId
    };


    AddUpdatePost(PostObj,PostId)
    .then((result)=>{
        alert(result);
        window.location.reload();
    })
    .catch((error)=>{
        alert(error.message);
    })

});

document.getElementById("Post-btn-delete").addEventListener('click',()=>{

       let token = sessionStorage.getItem('token');
       confirmPostDelete(token)
       .then(()=>{
        window.location.reload();
       })
       .catch((error)=>{
         alert(error.request.message);
       })

})



const baseURL ='https://sckoopywebapi20241226164951.azurewebsites.net/api/v1';