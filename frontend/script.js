const API_URL = 'http://127.0.0.1:5000';
let selectedAge = 3;  // Default 1-5 years
let selectedGender = 'male';

document.addEventListener('DOMContentLoaded', () => {
    // Gender buttons
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            selectedGender = e.target.dataset.gender;
            document.getElementById('selectedGender').textContent = 
                e.target.textContent.trim() + ' selected';
        });
    });

    // Age buttons
    document.querySelectorAll('.age-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.age-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            selectedAge = parseInt(e.target.dataset.age);
            document.getElementById('selectedAge').textContent = 
                e.target.textContent.trim() + ' selected';
        });
    });
});

document.getElementById('symptomForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const symptom = document.getElementById('symptom').value.toLowerCase().trim();
    
    const btn = document.getElementById('checkBtn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.querySelector('.loader');
    
    btn.disabled = true;
    btnText.style.opacity = '0';
    loader.classList.remove('hidden');
    
    try {
        const response = await fetch(`${API_URL}/check-symptom`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symptom, age: selectedAge, gender: selectedGender })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showResults(data);
        } else {
            alert('Symptom not found. Try: fever, cough, headache, runny nose...');
        }
    } catch (error) {
        alert('Backend not running?\n1. cd backend\n2. pip install fastapi uvicorn\n3. uvicorn app:app --reload');
    } finally {
        btn.disabled = false;
        btnText.style.opacity = '1';
        loader.classList.add('hidden');
    }
});

function showResults(data) {
    document.getElementById('confidence').textContent = data.confidence;
    document.getElementById('progress').style.width = data.confidence + '%';
    document.getElementById('medication').textContent = data.dosage;
    document.getElementById('ageLabel').textContent = `Age: ${data.age_category}`;
    document.getElementById('genderLabel').textContent = `Gender: ${data.gender}`;
    document.getElementById('diseases').innerHTML = 
        data.diseases.map(d => `<span>${d}</span>`).join('');
    
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}
