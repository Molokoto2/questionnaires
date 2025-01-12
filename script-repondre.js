document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const questionnaireId = urlParams.get('questionnaireId');
    const questionIndex = parseInt(urlParams.get('questionIndex'), 10);

    if (questionnaireId) {
        const decodedQuestions = JSON.parse(atob(questionnaireId));
        const currentQuestion = decodedQuestions[questionIndex];
        const questionnaireToAnswer = document.getElementById('questionnaire-to-answer');
        questionnaireToAnswer.innerHTML = '';

        const questionDiv = document.createElement('div');
        const label = document.createElement('label');
        label.textContent = currentQuestion.question;
        questionDiv.appendChild(label);

        currentQuestion.options.forEach((option, i) => {
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question-${questionIndex}`;
            input.value = option;
            questionDiv.appendChild(input);
            questionDiv.appendChild(document.createTextNode(option));
            questionDiv.appendChild(document.createElement('br'));
        });

        questionnaireToAnswer.appendChild(questionDiv);
    }
});

document.getElementById('form-reponse').addEventListener('submit', function(event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const questionnaireId = urlParams.get('questionnaireId');
    const questionIndex = parseInt(urlParams.get('questionIndex'), 10);

    if (questionnaireId) {
        const decodedQuestions = JSON.parse(atob(questionnaireId));

        const elements = document.getElementsByName(`question-${questionIndex}`);
        let selectedAnswer = '';
        elements.forEach(element => {
            if (element.checked) {
                selectedAnswer = element.value;
            }
        });

        // Si aucune réponse n'est sélectionnée
        if (!selectedAnswer) {
            alert('Vous devez sélectionner une réponse.');
            return;
        }

        // Enregistrer la réponse dans le localStorage
        let responses = JSON.parse(localStorage.getItem('responses')) || [];
        responses.push({ questionIndex, selectedAnswer });
        localStorage.setItem('responses', JSON.stringify(responses));

        // Passer à la question suivante
        const nextQuestionIndex = questionIndex + 1;
        if (nextQuestionIndex < decodedQuestions.length) {
            const nextLink = `${window.location.origin}/repondre.html?questionnaireId=${questionnaireId}&questionIndex=${nextQuestionIndex}`;
            window.location.href = nextLink;
        } else {
            alert('Merci pour vos réponses!');
            window.location.href = window.location.origin;  // Retour à la page d'accueil.
        }
    }
});
