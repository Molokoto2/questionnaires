const exercises = []; // Tableau pour stocker les exercices
const daysOfWeek = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

document.getElementById('add-exercise-btn').addEventListener('click', function() {
    document.getElementById('exercise-form').style.display = 'block';
});

document.getElementById('exercise-form-element').addEventListener('submit', function(event) {
    event.preventDefault();

    let exerciseType = document.getElementById('exercise-type').value;
    let duration = parseInt(document.getElementById('duration').value);
    let intensity = parseInt(document.getElementById('intensity').value);
    let muscleGroup = document.getElementById('muscle-group').value;
    let date = document.getElementById('date').value;

    // Calculer la charge d'entraînement
    const charge = duration * intensity;

    // Ajouter l'exercice au tableau
    exercises.push({ exerciseType, duration, intensity, muscleGroup, date, charge });
    
    // Réinitialiser le formulaire et le masquer
    document.getElementById('exercise-form-element').reset();
    document.getElementById('exercise-form').style.display = 'none';

    // Mettre à jour le calendrier et les statistiques
    updateCalendar();
    updateStats();
});

// Fonction pour afficher le calendrier
function updateCalendar() {
    const calendarView = document.getElementById('calendar-view');
    calendarView.innerHTML = ''; // Effacer le contenu existant

    const currentDate = new Date();
    let firstDayOfWeek = currentDate.getDate() - currentDate.getDay(); // Trouver le premier jour de la semaine
    currentDate.setDate(firstDayOfWeek);

    for (let i = 0; i < 7; i++) {
        const day = new Date(currentDate);
        const formattedDate = day.toISOString().split('T')[0]; // Format YYYY-MM-DD
        const dayName = daysOfWeek[i];

        const dayDiv = document.createElement('div');
        dayDiv.textContent = `${dayName} ${day.getDate()}`;
        dayDiv.dataset.date = formattedDate;

        // Vérifier s'il y a des exercices pour ce jour
        const exercisesForDay = exercises.filter(ex => ex.date === formattedDate);
        if (exercisesForDay.length > 0) {
            dayDiv.style.backgroundColor = "#c8e6c9"; // Changer la couleur si des exercices sont ajoutés
        }

        dayDiv.addEventListener('click', function() {
            showExercisesForDay(formattedDate);
        });

        calendarView.appendChild(dayDiv);
        currentDate.setDate(currentDate.getDate() + 1);
    }
}

// Fonction pour afficher les exercices d'un jour
function showExercisesForDay(date) {
    const exercisesForDay = exercises.filter(ex => ex.date === date);
    let exerciseList = `Exercices pour ${date} :\n`;

    exercisesForDay.forEach(ex => {
        exerciseList += `Type: ${ex.exerciseType}, Durée: ${ex.duration} min, Intensité: ${ex.intensity}, Groupe musculaire: ${ex.muscleGroup}\n`;
    });

    alert(exerciseList); // Afficher les exercices sous forme d'alerte
}

// Fonction pour calculer les statistiques
function updateStats() {
    const totalCharge = exercises.reduce((acc, ex) => acc + ex.charge, 0);
    const totalDuration = exercises.reduce((acc, ex) => acc + ex.duration, 0);
    const uniqueExerciseTypes = [...new Set(exercises.map(ex => ex.exerciseType))];

    const contrainte = uniqueExerciseTypes.length; // Plus il y a de types différents, moins la contrainte est élevée
    const monotonie = uniqueExerciseTypes.length === 1 ? 1 : 0; // Monotonie élevée si un seul type d'exercice

    const indiceForme = totalCharge / totalDuration; // Simple ratio charge/durée
    const recoveryTime = totalDuration / 10; // Estimation simplifiée du temps de récupération
    const tracesPositives = totalDuration / 60; // Estimation simplifiée des traces positives

    // Mettre à jour les statistiques
    document.getElementById('charge').textContent = `Charge d'entraînement: ${totalCharge}`;
    document.getElementById('contrainte').textContent = `Contrainte d'entraînement: ${contrainte}`;
    document.getElementById('monotonie').textContent = `Monotonie: ${monotonie}`;
    document.getElementById('indice-forme').textContent = `Indice de forme: ${indiceForme.toFixed(2)}`;
    document.getElementById('recovery-time').textContent = `Temps de récupération: ${recoveryTime} heures`;
    document.getElementById('traces-positives').textContent = `Traces positives: ${tracesPositives.toFixed(2)} heures`;
}

// Initialisation du calendrier et des statistiques
updateCalendar();
updateStats();
