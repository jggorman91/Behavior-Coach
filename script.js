document.addEventListener('DOMContentLoaded', () => {

    // --- DATA: Built-in strategies ---
    let strategies = {
        'Calling Out': { /* ... existing built-in strategies ... */ },
        'Off-Task': { /* ... existing built-in strategies ... */ },
        // ... all other built-in strategies
    };

    // --- Element Selectors ---
    const screens = document.querySelectorAll('.screen');
    const logBehaviorBtn = document.getElementById('log-behavior-btn');
    const libraryBtn = document.getElementById('library-btn');
    const backBtns = document.querySelectorAll('.back-btn');
    const functionBtns = document.querySelectorAll('.function-btn');
    const commonBehaviorsSelect = document.getElementById('common-behaviors');
    const strategyText = document.getElementById('strategy-text');
    const effectiveBtn = document.getElementById('effective-btn');
    const ineffectiveBtn = document.getElementById('ineffective-btn');
    
    // New Elements for Custom BIP
    const loadPlanBtn = document.getElementById('load-plan-btn');
    const savePlanBtn = document.getElementById('save-plan-btn');
    const bipBehaviorName = document.getElementById('bip-behavior-name');
    const bipFunctionSelect = document.getElementById('bip-function');
    const bipStrategiesText = document.getElementById('bip-strategies');


    // --- State ---
    let currentState = {
        behavior: null,
        function: null,
        attemptedStrategies: [],
    };

    // --- Functions ---
    function showScreen(screenId) {
        screens.forEach(screen => screen.classList.add('hidden'));
        document.getElementById(screenId).classList.remove('hidden');
    }
    
    // NEW: Function to save custom plan to localStorage and update the app
    function saveCustomPlan() {
        const behavior = bipBehaviorName.value.trim();
        const func = bipFunctionSelect.value;
        const strategiesText = bipStrategiesText.value.trim();

        if (!behavior || !strategiesText) {
            alert('Please provide a behavior name and at least one strategy.');
            return;
        }

        // Split pasted text into an array of strategies, filtering out empty lines
        const strategyList = strategiesText.split('\n').filter(s => s.trim() !== '');

        if (strategyList.length === 0) {
            alert('Please enter at least one strategy.');
            return;
        }

        // Load existing custom plans from localStorage or create a new object
        let customPlans = JSON.parse(localStorage.getItem('customBIPs')) || {};

        // Add the new plan
        customPlans[behavior] = {
            [func]: strategyList
        };

        // Save back to localStorage
        localStorage.setItem('customBIPs', JSON.stringify(customPlans));

        alert(`Custom plan for "${behavior}" has been saved!`);
        bipBehaviorName.value = '';
        bipStrategiesText.value = '';
        
        loadCustomPlansIntoApp(); // Reload plans into the dropdown
        showScreen('home-screen');
    }
    
    // NEW: Function to load all plans (built-in and custom) into the dropdown
    function loadCustomPlansIntoApp() {
        let customPlans = JSON.parse(localStorage.getItem('customBIPs')) || {};
        
        // Combine built-in and custom strategies
        strategies = { ...strategies, ...customPlans };

        // Clear existing custom options from dropdown
        document.querySelectorAll('.custom-bip-option').forEach(opt => opt.remove());

        // Add custom plans to the behavior dropdown
        for (const behavior in customPlans) {
            const option = document.createElement('option');
            option.value = behavior;
            option.textContent = `(Custom) ${behavior}`;
            option.className = 'custom-bip-option';
            commonBehaviorsSelect.appendChild(option);
        }
    }

    // ... (All other existing functions like getStrategies, displayNewStrategy, etc.)


    // --- Event Listeners ---
    logBehaviorBtn.addEventListener('click', () => showScreen('log-behavior-screen'));
    libraryBtn.addEventListener('click', () => showScreen('library-screen'));
    loadPlanBtn.addEventListener('click', () => showScreen('custom-plan-screen')); // New listener
    savePlanBtn.addEventListener('click', saveCustomPlan); // New listener

    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showScreen(btn.dataset.target);
        });
    });

    // ... (All other existing event listeners for functionBtns, effectiveBtn, etc.)


    // --- Initial Setup ---
    loadCustomPlansIntoApp(); // Load any saved plans when the app starts
    showScreen('home-screen');
});
