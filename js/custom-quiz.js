// I haven't updated this code to be neater, so it's a bit... chaotic

let questionList
let capitalList
let fullCountryList
let remainingQuestions
let whereIs
let quizOver
let question_box
let feedback_box
let points_box
let guesses_box
let points
let totalQuestionCount
let questionNumber
let loadedData
let possibleQuizzes
let searchParams
let quizName
let doCapitals
let checkBoxes
let binaryExcludeData
let finalString
let shortenedURL
let actualCountryNames
let areaNames
let updateSave = true
// const Swal = require('sweetalert2')

window.onload = function() {
    console.log("setup...")
    setupData()
}

function setupData() {
    checkBoxes = document.getElementById("check-countries")
    // points_box = document.getElementById("points") // get points box
    // question_count_box = document.getElementById("questions") // get questions box
    // guesses_box = document.getElementById("guesses") // get guesses box
    // guesses_box.innerHTML = "0/0 guesses correct"

    // correctGuesses = 0
    // incorrectGuesses = 0
    // possibleQuizzes = [  // possible quizzes
    //                 "africa-countries", 
    //                 "africa-capitals", 
    //                 "south-america-countries", 
    //                 "south-america-captials",
    //                 "north-america-countries",
    //                 "north-america-capitals",
    //                 "central-america-countries",
    //                 "central-america-capitals",
    //                 "europe-countries",
    //                 "europe-capitals",
    //                 "middle-east-countries",
    //                 "middle-east-capitals"
    //                 ]
    searchParams = new URLSearchParams(window.location.search);
    quizName = searchParams.get("q")
    if (!searchParams.has("q")) { // if invalid url, redirect to home
        location.href = "/"
    }
    const urlToLoad = "/js/json/maps/" + quizName + ".json"
    loadFromJSON(urlToLoad)
    }

// function finishSetup() {
    // let mapScale = 1;
    // let map = document.getElementById("main_map");
    // if (map.width == 0) {
    //     location.reload()
    // }
    // map.width *= mapScale;

    // totalQuestionCount = questionList.length
    // remainingQuestions = structuredClone(questionList)
    // quizOver = false
    // points = 0
    // questionNumber = 0
    // changeQuestionNumber()

    // setNewRandomCountry("none");
// }

function mapLoaded() {
    console.log("map loaded")

    document.getElementById("message-box").style.textAlign = "left"
    document.getElementById("loading-spinner").hidden = true
    
    let displayQuizName = structuredClone(quizName)
    displayQuizName = displayQuizName.replaceAll("-",  " ")
    displayQuizName = toTitleCase(displayQuizName)
    document.getElementById("base-title").innerHTML = displayQuizName + ": "
    // console.log("quiz name fancy: " + displayQuizName)
    document.getElementsByTagName("title")[0].text = "Customize Quiz - " + displayQuizName + " - Geography Genius"; // update page title
    document.getElementById("message-box").innerHTML = "Customize Quiz - " + displayQuizName

    let fancyInnerHTML = ""
    let dataMaphilight
    let extraStyles
    if (searchParams.has("c")) {
        isCustomQuiz = true
        excludeData = base64ToBinary(searchParams.get("c"), fullCountryList.length)
        console.log(excludeData)


    } else {
        isCustomQuiz = false
        excludeData = ""
    }

    console.log(fullCountryList)

    for (let i = 0, countryData = loadedData.countryData; i < countryData.length; i++) {
        if (isCustomQuiz) {
            // console.log(excludeData, fullCountryList)
            // if (excludeData.charAt(fullCountryList.indexOf(countryData[i].countryName)) == "1") {
                dataMaphilight = "data-maphilight='{\"stroke\":false,\"fillColor\":\"000000\",\"fillOpacity\":0.1,\"alwaysOn\":true}'";
                extraStyles = 'style="cursor:default" '
                
                const index = questionList.indexOf(countryData[i].countryName);
                if (index > -1) { // only splice array when item is found
                    questionList.splice(index, 1); // 2nd parameter means remove one item only
                    if (doCapitals) {
                        capitalList.splice(index, 1);
                    }
                }
            // } else {
            //     dataMaphilight = ""
            //     extraStyles = ""
            // }
        } else {
            dataMaphilight = ""
            extraStyles = ""
        }//onclick="submitCountry(' + "'" + countryData[i].countryName + "'" + ')" no more onlick
        let id
        id = spaceToHyphen(countryData[i].countryName)
        if (fancyInnerHTML.includes('"thing-' + id + '"')) {
            id += "-2"
        }
        fancyInnerHTML = fancyInnerHTML + '<area shape="poly"' + ' id="thing-' + id + '" ' + dataMaphilight + ' ' + extraStyles + 'coords="' + countryData[i].countryCoords + '" />'
    

// } else {
        // excludeData = ""
    }
    let checkboxesString = ""
    let i = 0
    let sortedCountryList = structuredClone(fullCountryList)
    sortedCountryList.sort() // sorting
    while (i < sortedCountryList.length) {
        checkboxesString += '<td valign="top" style="font-size:small;" min-width="200px" width="230px">'
        for (let count = 0, displayName; count < 28 && i < sortedCountryList.length; i++, count++) {
            displayName = sortedCountryList[i]

            // if (doCapitals == true) { // removed temperarily
                // displayName = calcCapitalFromCountry(displayName)
            // }

            checkboxesString += `<input type="checkbox" id="${spaceToHyphen(sortedCountryList[i]) + "-checkbox"}" class="country-checkbox" name="${spaceToHyphen(sortedCountryList[i]) + "-checkbox"}" value="${spaceToHyphen(sortedCountryList[i])}" onchange="setCountryState('${spaceToHyphen(sortedCountryList[i])}', !this.checked)">\n<label for="${spaceToHyphen(sortedCountryList[i]) + "-checkbox"}"> ${displayName}</label><br>\n`
        }
        checkboxesString += "</td>"
    }



    checkBoxes.innerHTML = checkboxesString



    document.getElementById("map-land").innerHTML = fancyInnerHTML
    generateHighlightJS() // add the highlighting
    // setTimeout(() => {finishSetup()}, 200);
    // finishSetup()
    document.getElementById("main_map").hidden = false
    
    // console.log("exclude data: " + excludeData)
    finishSetup()

    $(function(){
    $('.map').maphilight({
       fillColor: '000000',//'4ead45',//'fff4a1',
       fillOpacity:0.1,
       stroke:false,
    });
    })

    // $('input-description').on('keyup', function(){
    //     $(this).val($(this).val().replace(/[\r\n\v]+/g, ''));
    // });

    // constrainInput = (event) => { 
    //     event.target.value = event.target.value.replace(/[\r\n\v]+/g, '')
    // }
      
    // document.querySelectorAll('textarea').forEach(el => {
    //     el.addEventListener('keydown', constrainInput)
    // })
    // document.querySelectorAll('textarea').forEach(el => {
    //     el.addEventListener('keyup', constrainInput)
    // })

}

function constrainInputV2(el) {
    el.value = el.value.replaceAll("\r", "")
    el.value = el.value.replaceAll("\n", "")
    el.value = el.value.replaceAll("\v", "")
    return
}

function finishSetup() {
    // console.log("running...")
    if (!(excludeData == "")) {
        // console.log("loading state...")
        loadState(excludeData)
    } else {
        selectAllCountries()
    }
    // document.getElementById("message-box").hidden = true
    document.getElementById("ui-section").hidden = false
    // document.getElementById("text_box").hidden = false
    // document.getElementById("everything").hidden = false
    document.getElementById("quiz-footer").hidden = false // so footer isn't visible during loading
    // document.getElementById("map_land").hidden = false
    document.getElementById("main_map").hidden = false
}

function generateHighlightJS() {
    areaNames = document.getElementsByTagName("area")
    actualCountryNames = []
    for (let i = 0; i < areaNames.length; i++) {
        let id = areaNames[i].id
        actualCountryNames.push(id.slice(6))
    }
    // console.log(actualCountryNames)
    // let jsString
    // let code = "function clickToggle() {\n"
    // // for (let i = 0; i < fullCountryList.length; i++) { // old code
    // //     jsString = '$("#thing-' + spaceToHyphen(fullCountryList[i]) + '").click(function(a){a.preventDefault();a=$("#thing-' + spaceToHyphen(fullCountryList[i]) + '").mouseout().data("maphilight")||{};a.alwaysOn=!a.alwaysOn,setCountryVisible("' + i + '", a.alwaysOn),$("#thing-' + spaceToHyphen(fullCountryList[i]) + '").data("maphilight",a).trigger("alwaysOn.maphilight")});'
    // //     // console.log(jsString)
    // //     code += jsString
    // // }
    // for (let i = 0; i < actualCountryNames.length; i++) {
    //     jsString = '$("#thing-' + spaceToHyphen(actualCountryNames[i]) + '").click(function(a){a.preventDefault();a=$("#thing-' + spaceToHyphen(actualCountryNames[i]) + '").mouseout().data("maphilight")||{};a.alwaysOn=!a.alwaysOn,setCountryVisible("' + i + '", a.alwaysOn),$("#thing-' + spaceToHyphen(actualCountryNames[i]) + '").data("maphilight",a).trigger("alwaysOn.maphilight")});'
    //     // console.log(jsString)
    //     code += jsString
    // }
    // code += "\n}"
    // document.getElementById("country-scripts").innerHTML = code
    // clickToggle()
    for ([i, n] of actualCountryNames.entries()) {
        // console.log(n)
        let el = document.getElementById("thing-" + spaceToHyphen(n))
        el.addEventListener("click", handleClick)
        el.setAttribute("data-i", i)
        // el.setAttribute("data-name", n)
    }
}

function handleClick() {
    // console.log(this)
    // e.preventDefault()
    let a = $("#" + this.id).mouseout().data("maphilight")||{}
    a.alwaysOn =! a.alwaysOn
    setCountryVisible(this.dataset.i, a.alwaysOn)
    $("#" + this.id).data("maphilight", a).trigger("alwaysOn.maphilight")
}

function setCountryState(country, state) {
    let el = document.getElementById("thing-" + country)
    let a = $("#thing-" + country).data("maphilight")||{}
    a.alwaysOn = state
    setCountryVisible(el.dataset.i, a.alwaysOn, false)
    $("#thing-" + country).data("maphilight", a).trigger("alwaysOn.maphilight")
}

function loadFromJSON(url) {
    $.getJSON(url)
    .done(function(data) {
        loadedData = data
        questionList = loadedData.countryList
        fullCountryList = structuredClone(questionList)
        console.log(fullCountryList)
        if (loadedData.info.capitals == "true") {
            doCapitals = true
            capitalList = loadedData.capitalList
        }
        let imgUrlLabeled = loadedData.info.imgUrl.replaceAll(".png", "") + "-labeled"

        binaryExcludeData = ""
        while (binaryExcludeData.length < fullCountryList.length) {
            binaryExcludeData += "0"
        }
        // if (loadedData.info.custom == "true") {   // no more exclude list
        //     isCustomQuiz = true
        //     excludeList = loadedData.excludeList
        // }
        console.log("loaded question list")
        let headerLinks = document.getElementsByClassName("h-a")
        let areaOfWorld = loadedData.info.area
        
        if(areaOfWorld == "Americas") {
            headerLinks[3].classList = "h-a active"
        }
        if(areaOfWorld == "Africa") {
            headerLinks[4].classList = "h-a active"
        }
        if(areaOfWorld == "Europe") {
            headerLinks[5].classList = "h-a active"
        }
        if(areaOfWorld == "Asia") {
            headerLinks[6].classList = "h-a active"
        }
        if(areaOfWorld == "Oceania") {
            headerLinks[7].classList = "h-a active"
        }

        let imageURL = "/images/maps/" + loadedData.info.imgUrl
        // let imageURL = "/images/maps/" + quizName + ".png"
        document.getElementById("cool-image").innerHTML = '<img id="main_map" hidden="true" src="' + imageURL + '" alt="" usemap="#map-area" class="map" onload="mapLoaded()"/>'

        setTimeout(function(){
        addTitleAndDescription()
        // document.getElementsByClassName("labeled-map")[0].innerHTML = `<img id="main_map" hidden="true" src="/images/maps/${imgUrlLabeled}.png" onload="mapLoaded()">`
        }, 0);
        // mapLoaded() // img does it instead
    })

    .fail(function() {
        alert(`Failed to load quiz - Try again later`)
        console.log("JSON request failed - quiz failed to load.");
        // if (!possibleQuizzes.includes(quizName)) {
            // var failText = "404 - Quiz not found"
        // } else {
            var failText = "Hm, it looks like the quiz failed to load. It might not exist. Reload the page, or try again later."
            document.getElementById("message-box").style.textAlign = "left"
            document.getElementById("loading-spinner").hidden = true
            // }
        document.getElementById("message-box").innerHTML = failText;
        // document.getElementsByClassName("map")[0].remove()
    })
}

function addTitleAndDescription() {
    if (searchParams.has("t")) {
        try {
            document.getElementById("input-title").value = base64ToBytes(searchParams.get("t"))
        }
        catch {
            console.log("Error - failed to decode quiz title with atob")
            document.getElementById("input-title").value = "[Invalid Quiz Title]"
        }
    }
    if (searchParams.has("d")) {
        try {
            document.getElementById("input-description").value = base64ToBytes(searchParams.get("d"))
        }
        catch {
            console.log("Error - failed to decode quiz description with atob")
            document.getElementById("input-description").value = "[Invalid Quiz Description]"
        }
    }
}

// function changeQuestionNumber() {
//     questionNumber += 1
//     questionNumber = Math.min(questionNumber, totalQuestionCount)
//     let question_count_box = document.getElementById("questions")
//     question_count_box.innerHTML = "Question " + questionNumber + "/" + totalQuestionCount
// }

function getRandomCountry() {
    return(remainingQuestions[Math.floor(Math.random()*remainingQuestions.length)]);
}

// function setNewRandomCountry(oldCountry) {
//     question_box = document.getElementById("text_box")
//     feedback_box = document.getElementById("feedback")

//     whereIs = getRandomCountry()
//     if (!(isQuizOver())) {
//         if (!(oldCountry == "none")) {
//             // correctGuesses += 1
//             if (doCapitals) {
//                 // feedback_box.innerHTML = "Correct, that's " + calcCapitalFromCountry(oldCountry) + ", the capital of " + oldCountry
//                 feedback_box.innerHTML = "Correct, that's " + oldCountry + ", whose capital is  " + calcCapitalFromCountry(oldCountry)
//                 question_box.innerHTML = "What country is " + calcCapitalFromCountry(whereIs) + " the capital of?"
//             } else {
//                 feedback_box.innerHTML = "Correct, that's " + oldCountry
//                 question_box.innerHTML = "Where is " + whereIs + "?"
//             }

//         } else {
//             // feedback_box.innerHTML = "Click a country to start."
//             if (doCapitals) {
//                 question_box.innerHTML = "What country is " + calcCapitalFromCountry(whereIs) + " the capital of?"
//             } else {
//                 question_box.innerHTML = "Where is " + whereIs + "?"
//             }
//         }
//     }
    
// }

function isQuizOver() {
    if (remainingQuestions.length == 0) {
        let percent = Math.round(points / (totalQuestionCount * pointsPerQuestion) * 100)
        // You scored " + points + "/" + totalQuestionCount * pointsPerQuestion + " (" + percent + "%)

        let extraText = ""
        if (guesses_box.hidden == false) {
            extraText += " You got " + correctGuesses + " guesses correct, and " + incorrectGuesses + " incorrect."
        }
        if (points_box.hidden == false) {
            extraText += " You got " + percent + "% score."
        }

        feedback_box.innerHTML = "Quiz over." + extraText
        question_box.innerHTML = ""
        quizOver = true
        return true
    } else {
        return false
    }
}

function removeOldCountryFromList(country) {
    const index = remainingQuestions.indexOf(country);
        if (index > -1) {
            remainingQuestions.splice(index, 1);
            // console.log(remainingQuestions)                  //for debugging
            // console.log("question list" + questionList)
        }
}

// function skipQuestion() {
//     removeOldCountryFromList(whereIs)
//     setNewRandomCountry('none')
//     feedback_box.innerHTML = ""
//     isQuizOver()
//     changeQuestionNumber()
// }

function submitCountry(country) {
    if (quizOver) {
        alert("The quiz is over.")
        return
    }

    if (isCustomQuiz) {
        if (excludeData.charAt(fullCountryList.indexOf(country)) == "1") {
            if (doCapitals) {
                alert(calcCapitalFromCountry(country) + " is not part of this quiz.")
            } else {
                alert(country + " is not part of this quiz.")
            }
            return
        }
    }

    // console.log(country, whereIs)
    if (country == whereIs) {
        // console.log("right country")
        correctGuesses += 1
        // updateGuessBox()

        changeQuestionNumber()
        removeOldCountryFromList(country)
        setNewRandomCountry(whereIs)
    } else {
        // console.log("wrong country")
        incorrectGuesses += 1
        // updateGuessBox()

        if (doCapitals) {
            feedback_box.innerHTML = "Incorrect, that's " + calcCapitalFromCountry(country) + ", the capital of " + country + ". Try again."
        } else {
            feedback_box.innerHTML = "Incorrect, that's " + country + ". Try again."
        }
        if (doCapitals) {
            question_box.innerHTML = "What country is " + calcCapitalFromCountry(whereIs) + " the capital of?"
        } else {
            question_box.innerHTML = "Where is " + whereIs + "?"
        }
        
    }
}

// function updateGuessBox() {
//     guesses_box.innerHTML = correctGuesses + "/" + (correctGuesses + incorrectGuesses) + " guesses correct"
// }

function calcCapitalFromCountry(country) {
    return(capitalList[questionList.indexOf(country)])
}

function setCountryVisible(countryNumber, value, updateCheckbox = true) {
    if (updateSave) {
        let bit
        if (value == true) {
            bit = "1"
        } else {
            bit = "0"
        }
        let index = fullCountryList.indexOf(actualCountryNames[countryNumber].replaceAll("_", " "))
        if (updateCheckbox) {
            let countries = document.getElementsByClassName("country-checkbox")
            document.getElementById(spaceToHyphen(fullCountryList[index]) + "-checkbox").checked = (bit == 0) ? true : false
        }
        // console.log(value, bit, parseInt(countryNumber))
        // binaryExcludeData = setCharAt(binaryExcludeData, fullCountryList[countryNumber], bit)
        // console.log("changing " + )
        binaryExcludeData = binaryExcludeData.replaceAt(index, bit)
        // console.log(binaryExcludeData)

        // saveStateToURL()
    }
}

function selectAllCountries() {
    let countries = document.getElementsByClassName("country-checkbox")
    for (let i = 0; i < countries.length; i++) {
        countries[i].checked = true
        setCountryState(countries[i].id.replace("-checkbox", ""), false)
    }
    saveStateToURL()
}

function deselectAllCountries() {
    let countries = document.getElementsByClassName("country-checkbox")
    for (let i = 0; i < countries.length; i++) {
        countries[i].checked = false
        setCountryState(countries[i].id.replace("-checkbox", ""), true)
    }
    saveStateToURL()
}

function saveCustom() {
    document.getElementById("save-custom-quiz").innerHTML = "Please wait..."
    setTimeout(() => {actuallySaveCustomQuiz()}, 100);
}

function shortenQuizURL() {
    saveStateToURL()
    let finalString
    finalString = window.location.href
    finalString = finalString.replaceAll("customize-quiz", "quiz")
    let backupString = structuredClone(finalString)
    let response
    try {
        response = httpGet(`https://tinyurl.com/api-create.php?url=${finalString}`)
    }
    catch(err) {
        httpResponseStatus = 500
    }
    if (!(httpResponseStatus == 200)) {
        console.log("Error")
        return finalString
    } else {
        console.log(httpResponseStatus)
        response = response.slice(20)

        finalString = "https://" + window.location.hostname + "/q/" + response
        return finalString
    }
}

function actuallySaveCustomQuiz() {
    // let countries = document.getElementsByClassName("country-checkbox")
    // let encodedString = ""
    // for (let i = 0; i < countries.length; i++) {
    //     if (countries[i].checked == true) {
    //         encodedString += "0"
    //     } else {
    //         encodedString += "1"
    //     }
    // }
    // encodedString = binaryToBase64(encodedString)
    saveStateToURL()
    finalString = window.location.href
    finalString = finalString.replaceAll("customize-quiz", "quiz")
    let backupString = structuredClone(finalString)

    // fetch(`https://tinyurl.com/api-create.php?url=${finalString}`)
    //     .then((response) => response.text())
    //     .then((text) => text.slice(20))
    //     .then((short) => setShortenedURL(short))
    // setTimeout(() => {finishSaving()}, 500);
    let response
    let shareMessage
    let icon
    try {
        response = httpGet(`https://tinyurl.com/api-create.php?url=${finalString}`)
    }
    catch(err) {
        httpResponseStatus = 500
    }

    if (!(httpResponseStatus == 200)) {
        console.log("Error")
        shareMessage = `Encountered http error ${httpResponseStatus} while attempting to contact the server - instead, use the link below`
        icon = "info"
    } else {
        shareMessage = "Copy the link below to share this custom quiz"
        icon = "success"
        console.log(httpResponseStatus)
        response = response.slice(20)

        finalString = "https://" + window.location.hostname + "/q/" + response
    }
    document.getElementById("save-custom-quiz").innerHTML = "Save & Share"
    // console.log("Final quiz url: " + finalString)
    Sweetalert2.fire({
        title: 'Save & Share',
        html: `<span id="main-copy-text">${shareMessage}</span><br><input type="text" readonly="readonly" id="finished-url" onclick="copyQuizURL()" style="width: 400px;margin: 10px;font-size: 15px;"value="${finalString}">`,
        icon: icon,
        confirmButtonText: 'Done'
    })
}

function copyQuizURL() {
    let copyText = document.getElementById("finished-url")
    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);
    
    // Alert the copied text
    document.getElementById("main-copy-text").innerHTML = "Copied to clipboard!"
}

function loadState(data) {
    // console.log(data)
    let sortedList = structuredClone(fullCountryList)
    sortedList.sort()

    let countries = document.getElementsByClassName("country-checkbox")
    let isChecked
    // console.log(countries)
    for (let i = 0; i < countries.length; i++) {
        if (data[i] == "0") {
            isChecked = true
        } else {
            isChecked = false
        }
        let index = sortedList.indexOf(fullCountryList[i])
        // console.log("name & index: " + name + ", " + index)
        countries[index].checked = isChecked
    }

    binaryExcludeData = excludeData

    // console.log("---")
    // console.log(data, actualCountryNames)
    // for (let i = 0; i < actualCountryNames.length; i++) {
    //     if (data[i] == "0") {
    //         document.getElementById("thing-" + actualCountryNames[i]).click()
    //         console.log("including " + actualCountryNames[i])
    //     }
    // }

    updateSave = false

    for (let i = 0; i < fullCountryList.length; i++) {
        if (data[i] == "0") {
            document.getElementById("thing-" + spaceToHyphen(fullCountryList[i])).click()
            console.log("including " + fullCountryList[i])
        }
    }

    updateSave = true

}

function saveStateToURL() {
    // constrainInputV2(document.getElementById("input-description"))
    // let saveString = ""
    // for (let i = 0; i < fullCountryList.length; i++) {
    //     saveString += "0"
    // }

    // let countries = document.getElementsByClassName("country-checkbox")
    // for (let i = 0; i < countries.length; i++) {
    //     let cIndex = fullCountryList.indexOf((countries[i].value).replaceAll("_", " "))
    //     console.log(countries[i].value + " - " + cIndex)

    //     if (countries[i].checked == true) {
    //         // saveString += "0"
    //         saveString = saveString.replaceAt(cIndex, "0")
    //     } else {
    //         // saveString += "1"
    //         saveString = saveString.replaceAt(cIndex, "1")
    //     }
    // }

    saveString = binaryExcludeData

    if (Math.round(parseInt(saveString)) == 0) {
        if (searchParams.has("c")) {
            searchParams.delete("c")
        }
    } else {
        if (searchParams.has("c")) {
            searchParams.set("c", binaryToBase64(saveString))
        } else {
            searchParams.append("c", binaryToBase64(saveString))
        }
    }

    if ((document.getElementById("input-title").value) == "") {
        if (searchParams.has("t")) {
            searchParams.delete("t")
        }
    }
    if (searchParams.has("t")) {
        searchParams.set("t", bytesToBase64(document.getElementById("input-title").value))
    } else {
        if (!(document.getElementById("input-title").value) == "") {
            searchParams.append("t", bytesToBase64(document.getElementById("input-title").value))
        }
    }

    if ((document.getElementById("input-description").value) == "") {
        if (searchParams.has("d")) {
            searchParams.delete("d")
        }
    }
    if (searchParams.has("d")) {
        searchParams.set("d", bytesToBase64(document.getElementById("input-description").value))
    } else {
        if (!(document.getElementById("input-description").value) == "") {
            searchParams.append("d", bytesToBase64(document.getElementById("input-description").value))
        }
    }

    updateURLParams() 
}

function updateURLParams() {
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + searchParams.toString();
    window.history.pushState({path:newurl},'',newurl);
}

function playQuiz() {
    saveStateToURL()
    window.location.href = window.location.href.replace("customize-quiz", "quiz")
}

function submitQuizToShare() {
    Sweetalert2.fire({
        title: 'Submit this quiz',
        html: `<span>Submit this quiz to be added to be added to the <a href="/geography/custom-quizzes">custom quiz list.</a>`,
        icon: "info",
        confirmButtonText: 'Submit',
        showCancelButton: true,
    }).then((result) => {
        if (result.isConfirmed) {
            saveStateToURL()
            window.open(`/misc/submit-quiz?data=${btoa(window.location.search/*shortenQuizURL()*/)}`, '_blank').focus();
        }
    })
}

function invertSelection() {
    let countries = document.getElementsByClassName("country-checkbox")
    for (let i = 0; i < countries.length; i++) {
        // countries[i].checked = !countries[i].checked
        countries[i].click()
    }
    saveStateToURL()
}