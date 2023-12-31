
// Load valid words from wordlist.txt
const wordListRequest = new XMLHttpRequest();
wordListRequest.open('GET', 'wordlist.txt', false);  // synchronous request
wordListRequest.send();

let validWords = [];

if (wordListRequest.status === 200) {
    validWords = wordListRequest.responseText.split('\n').map(word => word.trim().toLowerCase());
} else {
    console.error('Error loading wordlist:', wordListRequest.statusText);
}

// Function to check if a sentence can be decoded with any Caesar shift value
function checkSentenceValidity() {
    // Get the sentence from the input field
    const sentence = document.getElementById('sentence-input').value.toLowerCase();

    // Initialize variables to store results
    let resultsHTML = '';
    let decodedShifts = [];

    // Try decoding the sentence with different Caesar shift values
    for (let shift = 0; shift <= 25; shift++) {
        const decodedSentence = applyCaesarDecipherToSentence(sentence, shift);
        const { validWordCount, highlightedSentence } = highlightValidWords(decodedSentence);

        resultsHTML += `<p>Shift ${shift}: ${highlightedSentence} (${validWordCount} valid words)</p>`;

        if (validWordCount > 0) {
            decodedShifts.push({ shift, decodedSentence });
        }
    }

    // Display the result
    const resultDiv = document.getElementById('result');
    result = reverse(sentence);
    resultsHTML += `<p> Reverse: ${result[0]} (${result[1]} valid words)</p>`;
    if (decodedShifts.length > 0 && result[0] < 1) {
        resultDiv.innerHTML = `<strong>${sentence}</strong> can be decoded with the following Caesar shifts: `;
        decodedShifts.forEach(entry => {
            resultDiv.innerHTML += `<strong>${entry.shift}</strong>, `;
        });
        resultDiv.innerHTML = resultDiv.innerHTML.slice(0, -2) + `.<br>`;

        decodedShifts.forEach(entry => {
            resultDiv.innerHTML += `Shift ${entry.shift}: ${entry.decodedSentence}<br>`;
        });
    }
    else if (decodedShifts.length > 0 && result[0] > 0) {
        resultDiv.innerHTML = `<strong>${sentence}</strong> can be decoded with the following Caesar shifts and reverse method: `;
        decodedShifts.forEach(entry => {
            resultDiv.innerHTML += `<strong>${entry.shift}</strong>, `;
        });
        resultDiv.innerHTML = resultDiv.innerHTML.slice(0, -2) + `.<br>`;

        decodedShifts.forEach(entry => {
            resultDiv.innerHTML += `Shift ${entry.shift}: ${entry.decodedSentence}<br>`;
        });
    }
    else if (result[0] > 0) {
        resultDiv.innerHTML = `<strong>${sentence}</strong> can be decoded with the reverse method: `;
    }
    else {
        resultDiv.innerHTML = `<strong>${sentence}</strong> cannot be decoded with any Caesar shift.`;
    }

    // Display all attempted shifts and results
    resultDiv.innerHTML += resultsHTML;
}
function reverse(sentence) {
    const { validWordCount, highlightedSentence } = highlightValidWords(reverseString(sentence));
    result = [validWordCount, highlightedSentence];
    return result;
}
// Function to count valid words in a sentence and highlight them
function highlightValidWords(sentence) {
    const words = sentence.split(/\s+/);
    let validWordCount = 0;
    const highlightedWords = words.map(word => {
        const isWordValid = validWords.includes(word);
        if (isWordValid) {
            validWordCount++;
            return `<span class="valid-word">${word}</span>`;
        } else {
            return word;
        }
    });
    const highlightedSentence = highlightedWords.join(' ');
    return { validWordCount, highlightedSentence };
}

// Function to apply Caesar decipher to a sentence
function applyCaesarDecipherToSentence(sentence, shift) {
    const words = sentence.split(/\s+/);
    return words.map(word => applyCaesarDecipher(word, shift)).join(' ');
}

// Function to apply Caesar decipher to a word
function applyCaesarDecipher(word, shift) {
    let result = '';
    for (let i = 0; i < word.length; i++) {
        const charCode = word.charCodeAt(i);
        let decryptedCharCode;
        if (charCode >= 97 && charCode <= 122) { // lowercase letters
            decryptedCharCode = (charCode - 97 - shift + 26) % 26 + 97;
        } else if (charCode >= 65 && charCode <= 90) { // uppercase letters
            decryptedCharCode = (charCode - 65 - shift + 26) % 26 + 65;
        } else {
            decryptedCharCode = charCode; // non-alphabetic characters
        }
        result += String.fromCharCode(decryptedCharCode);
    }
    return result;
}
function reverseString(str) {
    if (str === "") // This is the terminal case that will end the recursion
        return "";

    else
        return reverseString(str.substr(1)) + str.charAt(0);
}
