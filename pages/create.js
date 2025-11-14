
document.querySelector('.signup').addEventListener("click",async ()=>{
    const firstName=document.querySelector('.firstName').value;
    const surName=document.querySelector('.surName').value;
    const birthDate=document.querySelector('.birthDate').value;
    const birthMonth=document.querySelector('.birthMonth').value;
    const birthYear=document.querySelector('.birthYear').value;
    const gender=document.querySelector('.gender').value;
    const email=document.querySelector('.email').value;
    const password=document.querySelector('.password').value;

    const res=await fetch('http://localhost:2000/signup',{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({firstName,surName,birthDate,birthMonth,birthYear,gender,email,password})
    })
    const json=await res.json()
    if(res.ok){
        console.log(json)
        const token=json.token
        localStorage.setItem('tokenid',`${token}`)
        window.location.href='./otppage.html'
    }
    else{
        console.log(json)
    }
})