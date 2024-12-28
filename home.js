
function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

function loadPosts(isreload=false)
{
    let NextURL ="";

    if(isreload)
        {
            document.getElementById("Posts-container").innerHTML="";
            NextURL = `${baseURL}/posts?page=1&limit=3`;
        }
        else{
            NextURL = sessionStorage.getItem("PostsNextPageURL");
        }

       if(NextURL == 'null')
        {
            alert('No More Posts');
            return;
        }


    GetPosts(isreload,NextURL)
    .then((NextURL)=>{
       sessionStorage.setItem("PostsNextPageURL",NextURL);
    })
    .catch((error)=>{
       alert(error);
   });    
}

function GetPosts(reload=false,NextURL)
{
   return new Promise((resolve,reject)=>{
     
     
    axios.get(NextURL)
    .then((response)=>{
      CreatPosts(response.data.data.posts);
      resolve(response.data.data.nextURL);
    })
    .catch((error)=>{
        reject(error);
    })

   })
}

function infiniteScroll() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

    
    if (scrollTop + clientHeight >= scrollHeight - 50) {

       loadPosts();
    }
}

function addnewpostbtnclick()
{
    let PostModel =  new bootstrap.Modal(document.getElementById("NewPostModel"),{});

    document.getElementById('Post-Id-input').value="";
    document.getElementById('Model-Title').innerHTML="Add New";
    document.getElementById("Post-body").value = "";
    document.getElementById("Post-Title").value = "";
    document.getElementById("Post-img-Path").files[0]="";
    document.getElementById('Post-btn-Process').innerHTML="post";

    PostModel.toggle();
}

function ReloadHomePage()
{
     let token = sessionStorage.getItem('token');
     if(token)
     {
        let UserInfo = JSON.parse(sessionStorage.getItem("LoggedUserInfo"));
        SetUI(UserInfo);
        document.getElementById("AddPost-btn").style.visibility="visible";
     }
     
     loadPosts(true);
}

const IsRightPageForEditing=true;

ReloadHomePage();

window.addEventListener("scroll", debounce(infiniteScroll, 300));

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










