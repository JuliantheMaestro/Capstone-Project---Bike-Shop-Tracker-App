//Javascript to submit login form 

document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault()

    const loginData = {
        name: document.getElementById("login-name").value,
        numid: document.getElementById("login-numid").value
    }

    try{
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData)
        })

        const result = await response.json()

        if (response.ok) {

            localStorage.setItem("user", JSON.stringify(result.user))

            alert(result.message)
            window.location.href = "/7WelcomeBackUserPage.html"
        } else {
            alert(result.message)
        }
        } catch (error) {
        console.error("Error:", error)
        alert("An error occurred. Please try again.")
    }
    
})

