//Collect form data when user clicks on submit button for 4volunteer sign up page

const formEl = document.querySelector("form")

formEl.addEventListener("submit", () => {

    const formData = new FormData(formEl)
    const data = Object.fromEntries(formData)
     
    fetch("http://localhost:5000/api/volunteers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
      .then(data => console.log(data))
      .catch(error => console.log(error))
})