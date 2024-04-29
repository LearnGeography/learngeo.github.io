let searchParams = new URLSearchParams(window.location.search)

setup()
function setup() {
    if (!(searchParams.has("url"))) {
        window.location.href = "/"
    } else {
        let quizURL = "https://" + window.location.host + "/geography/quiz" + atob(searchParams.get("url"))
        formDiv = document.getElementById("form-container")
        formDiv.innerHTML = `<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdmVw7wO8HzBLRiUNQOuxEbDJIh0vMw7RqNr7w7-67pgmDI0w/viewform?embedded=true&entry.1624436263=${encodeURIComponent(quizURL)}" width="640" height="448" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>`
    }
}