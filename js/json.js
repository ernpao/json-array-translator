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


async function translateInput(jsonString) {
    showPreloader("Translating your JSON string...")

    let json = {};

    try {
        json = JSON.parse(jsonString);
    } catch (error) {
        showErrorDialog("Input Error:", error.message);
        console.error(error.message);
        return;
    }

    let outputStr = await translateJson(json)
    let output = JSON.stringify(outputStr, null, 4)
    $("#output").val(output)

    hidePreloader();
}

async function translateJson(json) {

    let output = {}

    let jsonKeys = Object.keys(json)


    for (var x = 0; x < jsonKeys.length; x++) {

        showPreloader(`Translating item ${x + 1} out of ${jsonKeys.length} keys`)

        let key = jsonKeys[x]
        let item = json[key];
        let translatedItem

        if (item.isArray) {
            translatedItem = []

            for (var i = 0; i < item.length; i++) {

                let subitem = item[i];
                if (subitem.indexOf('/') != 0) {
                    translatedItem = await googleTranslate(subitem, getTargetLanguage());
                    translatedItem.push(translatedSubitem)
                }
            }

            output[key] = translatedItem

        } else if (typeof item == 'string') {
            if (item.indexOf('/') != 0) {
                translatedItem = await googleTranslate(item, getTargetLanguage());
                output[key] = translatedItem
            } else {
                output[key] = item
            }

        } else if (typeof item == 'object') {
            translatedItem = await translateJson(item);
            output[key] = translatedItem
        }



    }

    return output;
}


