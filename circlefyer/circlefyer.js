var resultView = undefined;
var userInput = undefined;

function loadApp() {
    // Bind UI elements to global variables based on id
    resultView = document.getElementById('result');
    userInput = document.getElementById('userInput');
}

// Handles the pasting action from clipboard
// Falls back to manual paste if permissions were declined
function handlePaste() {
    navigator.permissions.query({name: "clipboard-read"}).then((result, reject) => {
        if (result.state === "granted" || result.state === "prompt") {
            navigator.clipboard.readText().then(clipText => {
                userInput.value = clipText;
                circleMe();
            }).catch(handlePasteError);
        }
    }).catch(handlePasteError);
}

// Handles the paste permission error
function handlePasteError() {
    window.alert("Permission to access clipboard was denied. Please manually paste and press the newly available Circle me! button.");
    document.getElementById("circleme").style.display = "";
    document.getElementById("pasteandcircleme").style.display = "none";
}

// Replaces squares with circles
function circleMe() {
    let text = userInput.value;
    let rebuilt = '';

    for (let i = 0; i < text.length; i++) {
        let currentChar = text[i].codePointAt(0).toString(16);
        let nextChar = undefined;
       
        if (text[i+1] !== undefined) nextChar = text[i+1].codePointAt(0).toString(16);
       
        console.log(currentChar + " " + nextChar);
       
        // Replace each one of 🟩🟨⬜ with 🟢🟡⚪ respectively

        if (currentChar === "d83d" && nextChar === "dfe9") {
            rebuilt += '🟢';
            i++;
        }
        else if (currentChar === "d83d" && nextChar === "dfe8") {
            rebuilt += '🟡';
            i++;
        }
        else if (currentChar === "2b1b") {
            rebuilt += '⚪';
        }
        else {
            rebuilt += text[i];
        }
    }

    resultView.innerText = rebuilt;
}

// Used by Paste and circle me! button
function pasteAndCircleMe() {
    handlePaste();
}