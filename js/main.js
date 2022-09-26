// Import the Bootstrap bundle
//
// This includes Popper and all of Bootstrap's JS plugins.

import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";


//
// Place any custom JS here
//

if (error) {
    document.getElementById('title').innerText = 'Invalid QR code.';
    throw new Error('Invalid QR code.');
}

const question = evnt.questions[questionId].question;
const answer = evnt.questions[questionId].answer;

document.getElementById('title').innerHTML = question.html || question.text;

document.getElementById('answer').addEventListener('submit', (event) => {
    event.preventDefault();

    const regexp = new RegExp(answer.regexp, 'i');

    const correct = regexp.test(document.getElementById('value').value);

    if (correct) {
        document.getElementById('title').innerText = answer.value;
    }
});