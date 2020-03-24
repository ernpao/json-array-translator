const apiKey = 'trnsl.1.1.20200211T090504Z.1f2c47a0dc5df3f9.6e23ac2ea27bf90d29553db179f7cec431d301e9'
const format = 'html'


window.onload = (function () {
    init();
});

function init() {
    initErrorDialog();
    $("#translate-button").click(translateButtonPressed)
    getAvailableLanguages(function (languageJsonData) {
        // console.log(languageJsonData)


        Object.keys(languageJsonData).forEach(function (key) {
            var language = languageJsonData[key];
            // console.log(language)
            $("#language-select").append(`<option value="${key}">${language}</option>`)
        });

        var languageSelect = $("#language-select")

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

function translateButtonPressed() {
    const input = $("#input").val();

    try {
        var json = JSON.parse(input);
        translateJsonArray(json);
    } catch (error) {
        showErrorDialog("Input Error:", error.message);
        console.error(error.message);
        return;
    }

    console.log("Success!")
}

function getTranslationDirection() {
    var targetLang = "en-" + $("#language-select option:selected").val()
    console.log(targetLang)
    return targetLang
}

async function translateJsonArray(jsonArray) {
    showPreloader("Translating the JSON array...")
    if (jsonArray != null && jsonArray.length > 0) {
        const total = jsonArray.length;
        let count = 0;
        let resultArray = []
        const languageDirection = getTranslationDirection();
        jsonArray.map(async function (item) {
            var title = item.title
            var newTitle = await yandexTranslate(title, languageDirection);

            item.title = newTitle;

            if (item.description != null) {
                var newDescription = await yandexTranslate(item.description, languageDirection)
                item.description = newDescription
            }

            if (item.txt != null) {
                var newTxt = await yandexTranslate(item.txt, languageDirection)
                item.txt = newTxt
            }

            resultArray.push(item)
            count++;

            showPreloader(`Translated ${count} item(s) of the array out of ${total}`)
            if (count == total) {
                hidePreloader();
                console.log(resultArray)
                const compressOutput = $("#compress-output").is(":checked")
                const resultString = (compressOutput) ? JSON.stringify(resultArray) : JSON.stringify(resultArray, null, 4)
                $("#input").val("")
                $("#output").val(resultString)
            }

        })
    }
}

async function yandexTranslate(text, languageDirection) {
    const json = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${apiKey}&lang=${languageDirection}&text=${text}&format=${format}`);
    const data = await json.json()
    return data.text.join(" ").replace("\\'", "'");
}

function getAvailableLanguages(callback) {
    const ui = 'en';
    fetch(`https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=${apiKey}&ui=${ui}`).then((data) => {
        return data.json();
    }).then(function (json) {
        // console.log(json.langs)
        callback(json.langs)
    })
}

function getLength(input) {
    return input.length;
}

function translateArrayItemTitle(jsonArray) {
    const result = jsonArray.map((item) => {



    });

    return result;
}