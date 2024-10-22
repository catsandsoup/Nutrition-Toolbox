document.addEventListener('DOMContentLoaded', () => {
    const bmiForm = document.getElementById('bmi-form');
    const energyForm = document.getElementById('energy-form');

    bmiForm.addEventListener('submit', calculateBMI);
    energyForm.addEventListener('submit', calculateTDEE);
});

function calculateBMI(e) {
    e.preventDefault();
    const weight = parseFloat(document.getElementById('weight').value);
    const heightCm = parseFloat(document.getElementById('height').value);
    
    if (weight <= 0 || heightCm <= 0) {
        displayResult('bmi-result', 'Please enter valid weight and height values.');
        return;
    }
    
    const heightM = heightCm / 100; // Convert centimeters to meters
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

function displayResult(elementId, message) {
    const resultElement = document.getElementById(elementId);
    resultElement.textContent = message;
    resultElement.style.display = 'block';
}