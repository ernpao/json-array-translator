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
