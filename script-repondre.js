let responses = JSON.parse(localStorage.getItem('responses')) || [];

document.getElementById('repondre').addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const questionnaireId = urlParams.get('questionnaireId');
    const questionIndex = parseInt(urlParams.get('questionIndex'), 10);
    
    if (questionnaireId) {
        const decodedQuestionnaire = JSON.parse(atob(questionnaireId));
        const questionnaireToAnswer = document.getElementById('questionnaire-to-answer');
        questionnaireToAnswer.innerHTML = '';

        const q = decodedQuestionnaire[questionIndex];
        const div = document.createElement('div');
        div.classList.add('question');
        
        const label = document.createElement('label');
        label.textContent = q.question;
        div.appendChild(label);
        
        q.options.forEach((option, i) => {
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question-${questionIndex}`;
            input.value = option;
            div.appendChild(input);
            div.appendChild(document.createTextNode(option));
            div.appendChild(document.createElement('br'));
        });

        questionnaireToAnswer.appendChild(div);
    }
});

// Soumettre la réponse et passer à la question suivante
document.getElementById('form-reponse').addEventListener('submit', function(event) {
    event.preventDefault();

    const responseData = [];
    const urlParams = new URLSearchParams(window.location.search);
    const questionnaireId = urlParams.get('questionnaireId');
    const questionIndex = parseInt(urlParams.get('questionIndex'), 10);
    
    if (questionnaireId) {
        const decodedQuestionnaire = JSON.parse(atob(questionnaireId));

        const elements = document.getElementsByName(`question-${questionIndex}`);
        let answer = '';
        elements.forEach(element => {
            if (element.checked) {
                answer = element.value;
            }
        });

        responseData.push(answer);
        responses.push(responseData);
        localStorage.setItem('responses', JSON.stringify(responses));

        // Passer à la question suivante
        const nextQuestionIndex = questionIndex + 1;
        if (nextQuestionIndex < decodedQuestionnaire.length) {
            const nextLink = `${window.location.origin}/repondre.html?questionnaireId=${questionnaireId}&questionIndex=${nextQuestionIndex}`;
            window.location.href = nextLink;
        } else {
            alert('Merci pour vos réponses !');
            window.location.href = window.location.origin + '/index.html'; // Retour à la page d'accueil ou création.
        }
    }
});
