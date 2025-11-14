async function welcome() {
    const res=await fetch('http://localhost:2000')
    const json=await res.json()
    console.log(json.message)
}
welcome()

document.querySelector('.loginbtn').addEventListener('click',async ()=>{
    const email=document.querySelector('#email').value;
    const password=document.querySelector('#password').value;
    await login(email,password)
})

async function login(email,password) {
    const res=await fetch('http://localhost:2000/login',{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email,password})
    })
    const json=await res.json()
    console.log(json)
    if(res.ok){
        window.location.href='./pages/welcome.html'
    }
}

document.querySelector('.createbtn').addEventListener("click",async ()=>{
    window.location.href='./pages/create.html'
})
