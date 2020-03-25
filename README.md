# JSON Array Translator
Simple web app for translating the text content of a JSON array using the [Yandex Translate API](https://tech.yandex.com/translate/)

## Usage

1. Paste the JSON array to the text input area on the left. You may need to properly format your JSON array before using the translator. Ensure that all keys and values of the JSON items in the array are surrounded by double quotes. You can use [this web tool](https://jsonformatter.curiousconcept.com/) to properly format your JSON arrays.
2. Select the target language to translate the content to. Click on the "Translate" button to begin the translation of the content.

## Demo

<video src="json_array_translator_demo.mov"></video>

## API Key
You can use your own API key for the app. You can get a free API key by signing up at the [Yandex website](https://tech.yandex.com/translate/). You can update the API key located at the top of the js/script.js file.

## Limitations
1. The app is currently configured to read and translate only the following keys in a JSON array object:

- "title"
- "description"
- "txt"

2. The app does not iterate over any nested JSON arrays, so you will need to translate nested arrays separately.
3. The app currently only translates from English so you will need to ensure that the content of your JSON array is in english.
4. The Yandex Translate API has usage limits for the free tier.
