//Generates random 4 digit ID for the user

function generateRandomID() {
    return Math.floor(1000 + Math.random() * 9000)
}


//New user sign-up form submission 

document.getElementById("userForm").addEventListener("submit", async function(event) {
    event.preventDefault()
    
    const randomID = generateRandomID()
    
    const formData = {
        numid: randomID,
        name: document.getElementById("input-name").value,
        email: document.getElementById("input-email").value,
        phonenumber: document.getElementById("input-phonenumber").value,
        mechanic_experience: document.getElementById("mechanic-experience").value,
        comments: document.getElementById("comments").value
    }
    
    try{
        const response = await fetch("/post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })

    const result = await response.json()

        if (response.ok) {
            alert(result.message)
            window.location.href = "/5WelcomeSignupPage.html"
        } else {
            alert(result.message)
        }
        } catch (error) {
        console.error("Error:", err)
        alert("An error occurred. Please try again.")
    }
    
})

