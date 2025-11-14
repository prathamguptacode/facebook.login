document.querySelector(".verifyotp").addEventListener('click',async ()=>{
    console.log('hello otp')
    const token=localStorage.getItem('tokenid')
    const otp=document.querySelector('.otpin').value;
    const res=await fetch('http://localhost:2000/verify',{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({otp})
    })
    const data=await res.json()
    if(res.ok){
        localStorage.clear()
        console.log("welcome to facebook")
        window.location.href='./welcome.html'
    }
    console.log(data)
})