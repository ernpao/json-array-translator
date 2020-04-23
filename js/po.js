const format = 'html'


window.onload = (function () {
    init();
});

function init() {
    initErrorDialog();
    $("#translate-button").click(translateButtonPressed)
    getAvailableLanguages(function (languageArray) {

        Object.keys(languageArray).forEach(function (key) {
            var language = languageArray[key].language;
            $("#language-select").append(`<option value="${language}">${language}</option>`)
        });

        hidePreloader();
    });
}

function initErrorDialog() {
    var dialog = document.querySelector('#error-dialog');
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
    });
}

function showErrorDialog(title, message) {
    $("#error-message").html(`
        <div>${message}</div>
    `);
    $("#error-message-title").html(`
        <div>${title}</div>
    `);

    var dialog = document.querySelector('#error-dialog');
    dialog.showModal();
}

function showPreloader(message) {
    $(".preloader .preloader-content").text(message)
    $(".preloader").removeClass("hide-preloader")
}

function hidePreloader() {
    $(".preloader").addClass("hide-preloader")
}

async function translateButtonPressed() {
    try {
        let input = $("#input").val();
        translateInput(input);
    } catch (error) {
        showErrorDialog("Input Error:", error.message);
        console.error(error.message);
        return;
    }
}

function getTargetLanguage() {
    var targetLang = $("#language-select option:selected").val()
    console.log(targetLang)
    return targetLang
}

var inputTextLines = []

async function translateInput(inputText) {

    let output = []

    showPreloader("Translating the input...")
    inputTextLines = inputText.match(/[^\r\n]+/g);


    for (var i = 0; i < inputTextLines.length; i++) {
        showPreloader(`Translated ${i + 1} item(s) of the array out of ${inputTextLines.length}`)
        let text = inputTextLines[i];
        if (text.indexOf('msgstr') == 0) {
            const textToTranslate = text.substring(8, text.length - 1)
            text = await googleTranslate(textToTranslate, getTargetLanguage())
            text = `msgstr "${text}"\n`
        }
        // inputTextLines[i] = text
        output.push(text)
    }

    $("#output").val(output.join('\n'))
    hidePreloader();
}

function printTextLines() {
    return inputTextLines.join('\n')
}

async function googleTranslate(text, targetLanguage) {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}&target=${targetLanguage}&q=${text}&format=html&model=base`);
    const data = await response.json()
    const translatedText = data.data.translations[0].translatedText
    return translatedText;
}

function getAvailableLanguages(callback) {
    const ui = 'en';
    fetch(`https://translation.googleapis.com/language/translate/v2/languages?key=${apiKey}`).then((data) => {
        return data.json();
    }).then(function (json) {
        callback(json.data.languages)
    })
}

