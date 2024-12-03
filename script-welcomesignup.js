//Displays New user sign-up information on page 5

async function fetchLatestEntry() {
    try {
        const response = await fetch("/latest-entry")
        const latestEntry = await response.json()


//Formats the time to a more readable format

        const timestamp = new Date(latestEntry.timestamp)

        let hours = timestamp.getHours()
        let minutes = timestamp.getMinutes()
        const amorpm = hours >= 12 ? "pm" : "am"
        hours = hours % 12
        hours = hours ? hours: 12
        minutes = minutes < 10 ? "0" + minutes : minutes 
        const timeString = `${hours}:${minutes}${amorpm}`

        const dateString = `${timestamp.getMonth() + 1}/${timestamp.getDate()}/${timestamp.getFullYear()}`


        // Displays the New Users name, Id and log in time

        document.getElementById("newNameEntry").innerHTML = `Welcome and thank you for signing up ${latestEntry.name}!`
        document.getElementById("newIdEntry").innerHTML = `Your new volunteer ID is: ${latestEntry.numid}`
        document.getElementById("newDateEntry").innerHTML = `Time logged in: ${timeString} ${dateString}`

        } catch (error) {
        console.error("fetching latest entry error", error)
    }
}

fetchLatestEntry()