const user = JSON.parse(localStorage.getItem("user"))


    if (user) {
        document.getElementById("user-name").textContent = `Welcome back, ${user.name}!`
        document.getElementById("user-id").textContent = `Your ID is: ${user.numid}` 

    }else{
        alert("User not found. Please try logging in again")
    }

