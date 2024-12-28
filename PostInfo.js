
function GetPostById(PostID)
{
    return axios.get(`https://sckoopywebapi20241226164951.azurewebsites.net/api/v1/posts/${PostID}`)
           .then((response)=>{
              CreatPost(response.data.data);
              return response.data.data.comments;
           })
           .catch((error)=>{
              return Promise.reject("Sorry,something Error at loading!");
           })
}

function CreatComment(comment,commentsdiv)
{
    let ProfileImg = getProfileImage(comment.author.profileImageLink);

    let author = comment.author;

    commentsdiv.innerHTML += `<li>
                                    <div class="comment" >
                                        <img class="img-profile" src='${ProfileImg}' />
                                        <a href="Profile.html?id=${author.userId}" data-user-id='${author.userId}' class="user-name">${author.userName}</a>
                                        <p>${comment.body}</p>
                                    </div>
                                </li>   
                                `;
}

function CreatAddCommentbar(commentdiv)
{
    commentdiv.innerHTML += ` <div class="input-group mb-3">
                                <input id='comment-body' type="text" class="form-control" placeholder="Add a comment" aria-label="Recipient's username" aria-describedby="Add-comment">
                                <button class="btn btn-outline-success" type="button" id="Add-comment">Add</button>
                            </div>` ;
}

function CreatComments(comments)
{
    let commentdiv = document.getElementById("comments");

    commentdiv.innerHTML = `<div class="border p-3 overflow-auto" style="max-height: 200px;">
                                <ul class="list-group" id='comments-list'>
                                    
                                </ul>
                            </div>`;

    let comments_List = document.getElementById('comments-list');                        

    for (comment of comments)
    {
       CreatComment(comment,comments_List);
    }

    CreatAddCommentbar(commentdiv);
   
}

function AddNewComment(body,token)
{
    return axios.post(`https://sckoopywebapi20241226164951.azurewebsites.net/api/v1/posts/${postId}/comment`,body,{
        headers:{
            "Authorization" : "Bearer "+ token
        }
    })
    .then(()=>{
        return "Comment has been added successfully!";
    })
    .catch((error)=>{
        return Promise.reject(error.request);
    })
}

function CreatEventOnAddCommentbtn()
{
    document.getElementById('Add-comment').addEventListener("click",()=>{
        
        let token = sessionStorage.getItem('token');
        if(!token)
        {
            alert('you must sign in first!');
            return;
        }

        let commentbody = document.getElementById('comment-body').value;
        
        if(!commentbody)
        {
            alert("you must add somthing!");
            return;
        }

        let userId = JSON.parse(sessionStorage.getItem("LoggedUserInfo")).userId;
        let body = {
            "body" : commentbody,
            "UserId" :userId
        }

        AddNewComment(body,token)
        .then((message)=>{
            alert(message);
            window.location.reload();
        })
        .catch((message)=>{
            alert(message);
        })
        

    })
}

function loadpost()
{
    GetPostById(postId)
    .then((comments)=>{
        CreatComments(comments);
        CreatEventOnAddCommentbtn();
    })
    .catch((erorr)=>{
        alert(error);
    })
}

function ReloadPostInfo()
{
    let token = sessionStorage.getItem('token');
    if(token)
    {
       let UserInfo = JSON.parse(sessionStorage.getItem("LoggedUserInfo"));
       SetUI(UserInfo);
    }
    
    loadpost(true);
}

const params = new URLSearchParams(window.location.search);
const postId = params.get('id');
const IsRightPageForEditing=false;


ReloadPostInfo();

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