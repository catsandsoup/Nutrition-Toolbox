document.addEventListener('DOMContentLoaded', () => {
    const forms = {
        'bmi-form': calculateBMI,
        'energy-form': calculateTDEE,
        'body-fat-form': calculateBodyFat,
        'protein-form': calculateProteinIntake,
        'anthropometric-form': calculateAnthropometric,
        'rmr-form': calculateRMR,
        'hydration-form': calculateHydration,
        'nutrient-ratio-form': calculateNutrientRatio
    };

    Object.entries(forms).forEach(([formId, calculationFunction]) => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', calculationFunction);
        }
    });
});

function calculateBMI(e) {
    e.preventDefault();
    const weight = parseFloat(document.getElementById('weight').value);
    const heightCm = parseFloat(document.getElementById('height').value);
    if (weight <= 0 || heightCm <= 0) {
        displayResult('bmi-result', 'Please enter valid weight and height values.');
        return;
    }
    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    displayResult('bmi-result', `Your BMI is: ${bmi.toFixed(2)}`);
}

function calculateTDEE(e) {
    e.preventDefault();
    const weight = parseFloat(document.getElementById('weight-energy').value);
    const height = parseFloat(document.getElementById('height-energy').value);
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const pal = parseFloat(document.getElementById('pal').value);
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    const tdee = bmr * pal;
    displayResult('energy-result', `Your Total Daily Energy Expenditure (TDEE) is: ${tdee.toFixed(2)} calories`);
}

function calculateBodyFat(e) {
    e.preventDefault();
    const gender = document.getElementById('bf-gender').value;
    const waist = parseFloat(document.getElementById('bf-waist').value);
    const neck = parseFloat(document.getElementById('bf-neck').value);
    const height = parseFloat(document.getElementById('bf-height').value);
    let bodyFat;

    if (gender === 'male') {
        bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else {
        const hip = parseFloat(document.getElementById('bf-hip').value);
        bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
    }

    displayResult('body-fat-result', `Your estimated body fat percentage is: ${bodyFat.toFixed(2)}%`);
}

function calculateProteinIntake(e) {
    e.preventDefault();
    const weight = parseFloat(document.getElementById('protein-weight').value);
    const activity = document.getElementById('protein-activity').value;
    const goal = document.getElementById('protein-goal').value;

    let proteinMultiplier;
    if (goal === 'lose') {
        proteinMultiplier = 2.0;
    } else if (goal === 'gain') {
        proteinMultiplier = 2.2;
    } else {
        proteinMultiplier = 1.8;
    }

    if (activity === 'active') {
        proteinMultiplier += 0.2;
    }

    const proteinIntake = weight * proteinMultiplier;
    displayResult('protein-result', `Your recommended daily protein intake is: ${proteinIntake.toFixed(2)} grams`);
}

function calculateAnthropometric(e) {
    e.preventDefault();
    const waist = parseFloat(document.getElementById('anthro-waist').value);
    const hip = parseFloat(document.getElementById('anthro-hip').value);
    const height = parseFloat(document.getElementById('anthro-height').value);
    const weight = parseFloat(document.getElementById('anthro-weight').value);

    const whr = waist / hip;
    const whrRisk = whr > 0.9 ? 'High' : 'Low';

    const bmi = weight / ((height / 100) ** 2);
    let bmiCategory;
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi < 25) bmiCategory = 'Normal weight';
    else if (bmi < 30) bmiCategory = 'Overweight';
    else bmiCategory = 'Obese';

    displayResult('anthropometric-result', `
        Waist-to-Hip Ratio: ${whr.toFixed(2)} (Risk: ${whrRisk})
        BMI: ${bmi.toFixed(2)} (Category: ${bmiCategory})
    `);
}

function calculateRMR(e) {
    e.preventDefault();
    const weight = parseFloat(document.getElementById('rmr-weight').value);
    const height = parseFloat(document.getElementById('rmr-height').value);
    const age = parseInt(document.getElementById('rmr-age').value);
    const gender = document.getElementById('rmr-gender').value;
    const formula = document.getElementById('rmr-formula').value;

    let rmr;
    switch (formula) {
        case 'harris-benedict':
            rmr = gender === 'male' ?
                88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age) :
                447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
            break;
        case 'mifflin-st-jeor':
            rmr = gender === 'male' ?
                (10 * weight) + (6.25 * height) - (5 * age) + 5 :
                (10 * weight) + (6.25 * height) - (5 * age) - 161;
            break;
        case 'katch-mcardle':
            const leanBodyMass = weight * (1 - (parseFloat(document.getElementById('body-fat-percentage').value) / 100));
            rmr = 370 + (21.6 * leanBodyMass);
            break;
    }

    displayResult('rmr-result', `Your Resting Metabolic Rate (RMR) is: ${rmr.toFixed(2)} calories per day`);
}

function calculateHydration(e) {
    e.preventDefault();
    const weight = parseFloat(document.getElementById('hydration-weight').value);
    const activity = document.getElementById('hydration-activity').value;
    const climate = document.getElementById('hydration-climate').value;

    let baseHydration = weight * 0.033; // 33 ml per kg of body weight
    if (activity === 'moderate') baseHydration *= 1.2;
    else if (activity === 'active') baseHydration *= 1.4;

    if (climate === 'hot') baseHydration *= 1.2;
    else if (climate === 'humid') baseHydration *= 1.1;

    displayResult('hydration-result', `Your recommended daily water intake is: ${baseHydration.toFixed(2)} liters`);
}

function calculateNutrientRatio(e) {
    e.preventDefault();
    const carbsRatio = parseFloat(document.getElementById('carbs-ratio').value);
    const proteinRatio = parseFloat(document.getElementById('protein-ratio').value);
    const fatRatio = parseFloat(document.getElementById('fat-ratio').value);
    const totalCalories = parseFloat(document.getElementById('total-calories').value);

    if (carbsRatio + proteinRatio + fatRatio !== 100) {
        displayResult('nutrient-ratio-result', 'Error: The sum of macronutrient percentages must equal 100%');
        return;
    }

    const carbsCalories = totalCalories * (carbsRatio / 100);
    const proteinCalories = totalCalories * (proteinRatio / 100);
    const fatCalories = totalCalories * (fatRatio / 100);

    const carbsGrams = carbsCalories / 4;
    const proteinGrams = proteinCalories / 4;
    const fatGrams = fatCalories / 9;

    displayResult('nutrient-ratio-result', `
        Carbohydrates: ${carbsGrams.toFixed(2)}g (${carbsCalories.toFixed(2)} calories)
        Protein: ${proteinGrams.toFixed(2)}g (${proteinCalories.toFixed(2)} calories)
        Fat: ${fatGrams.toFixed(2)}g (${fatCalories.toFixed(2)} calories)
    `);
}

function displayResult(elementId, message) {
    const resultElement = document.getElementById(elementId);
    resultElement.innerHTML = message;
    resultElement.style.display = 'block';
}