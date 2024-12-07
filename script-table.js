
let currentPage = 1
const rowsPerPage = 7
let fetchedData = []


function makeTable(data) {
    const tableBody = document.getElementById("adminData-table").querySelector("tbody")
    tableBody.innerHTML = ""


    const startIndex = (currentPage - 1)* rowsPerPage
    const endIndex = startIndex + rowsPerPage
    const paginatedData = data.slice(startIndex, endIndex)

    paginatedData.forEach((user) => {
        const row = document.createElement("tr")


        const idCell = document.createElement("td")
        idCell.textContent = user.numid 

        const nameCell = document.createElement("td")
        nameCell.textContent = user.name

        const phoneCell = document.createElement("td")
        phoneCell.textContent = user.phonenumber

        const emailCell = document.createElement("td")
        emailCell.textContent = user.email

        const experienceCell = document.createElement("td")
        experienceCell.textContent = user.mechanic_experience

        const timesLoggedInCell = document.createElement("td")
        timesLoggedInCell.textContent = user.timesLoggedIn

        const commentsCell = document.createElement("td")
        commentsCell.textContent = user.comments


        row.appendChild(idCell)
        row.appendChild(nameCell)
        row.appendChild(phoneCell)
        row.appendChild(emailCell)
        row.appendChild(experienceCell)
        row.appendChild(timesLoggedInCell)
        row.appendChild(commentsCell)



        tableBody.appendChild(row)
    })

    updatePaginationControls(data.length)
}


function updatePaginationControls(totalRows) {
    const paginationContainer = document.getElementById("pageupdown-controls")
    paginationContainer.innerHTML = ""

    const totalPages = Math.ceil(totalRows / rowsPerPage)


    //Previous Button

    const prevButton = document.createElement("button")
    prevButton.textContent = "Previous"
    prevButton.classList.add("pagination-arrow")
    prevButton.disabled = currentPage === 1
        
            prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--
                makeTable(fetchedData)
            }})
            paginationContainer.appendChild(prevButton)



    //Next Button

    const nextButton = document.createElement("button")
    nextButton.textContent = "Next"
    nextButton.classList.add("pagination-arrow")
    nextButton.disabled = currentPage === totalPages
    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++
            makeTable(fetchedData)
        }
    })
    paginationContainer.appendChild(nextButton)

}
    //Get data from Mongodb to build table
    function fetchData() {

        fetch("http://localhost:3019/api/allnames")
            .then (response => response.json())
            .then (data => {
                fetchedData = data
                makeTable(fetchedData)
        })
}

fetchData()



//Sync Google Calendar Api

document.getElementById('sync-calendar-btn').addEventListener('click', async function () {
    try {
        // Send request to your server to sync the calendar
        const response = await fetch('/sync-calendar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            alert('Calendar synced successfully!')

            // Open Google Calendar in a new tab
            window.open('https://calendar.google.com', '_blank')
        } else {
            const data = await response.json()
            alert('Error syncing calendar: ' + data.message)
        }
    } catch (error) {
        console.error('Error:', error)
        alert('Failed to sync calendar.')
    }
});







