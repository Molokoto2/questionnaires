const params = new URLSearchParams(window.location.search);
const questionnaireName = params.get('name');
const questionnaires = JSON.parse(localStorage.getItem('questionnaires')) || [];

const questionnaire = questionnaires.find(q => q.name === questionnaireName);
if (!questionnaire) {
    document.body.innerHTML = '<h1>Questionnaire introuvable</h1>';
} else {
    document.getElementById('questionnaire-title').innerText = questionnaire.name;

    const form = document.getElementById('questionnaire-form');
    questionnaire.questions.forEach((q, index) => {
        // Crée un div pour chaque question
        const div = document.createElement('div');
        div.innerHTML = `
            <h3>${q.question}</h3>
            ${q.responses.map((r, i) => `
                <label>
                    <input type="radio" name="q${index}" value="${r}" required> ${r}
                </label><br>
            `).join('')}
        `;
        form.appendChild(div);
    });

    document.getElementById('submit-response').addEventListener('click', function (event) {
        event.preventDefault(); // Empêche la soumission du formulaire

        const formData = new FormData(form);
        const responses = Array.from(formData.entries()).map(([key, value]) => ({
            question: questionnaire.questions[parseInt(key.replace('q', ''))].question,
            response: value,
        }));

        const allResponses = JSON.parse(localStorage.getItem('responses')) || {};
        if (!allResponses[questionnaire.name]) {
            allResponses[questionnaire.name] = [];
        }
        allResponses[questionnaire.name].push(responses);

        localStorage.setItem('responses', JSON.stringify(allResponses));

        alert('Merci pour vos réponses !');
        
        // Afficher une page blanche après soumission
        document.body.innerHTML = "";
        document.body.style.backgroundColor = "white";
    });
}
