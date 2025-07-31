document.addEventListener('DOMContentLoaded', () => {

    // --- DATA: Strategies from the provided document ---
    const strategies = {
        'Calling Out': {
            [cite_start]Attention: "Use **Differential Reinforcement**. Intentionally give enthusiastic praise when the student raises their hand, and calmly ignore them when they call out. This teaches a better way to get their need for attention met[cite: 348, 349].",
            Escape: "This is unusual for this behavior. Consider if the student is calling out to distract from a task they find difficult. [cite_start]Try **Scaffolding** the task or offering support[cite: 186]."
        },
        'Off-Task': {
            Attention: "The student may be trying to get peer attention. [cite_start]Try a **High-Probability Request Sequence** to build momentum, followed by the on-task request[cite: 350, 351, 352]. [cite_start]Also, ensure you are providing ample positive attention for on-task behavior[cite: 360].",
            Escape: "The student is likely avoiding the task. [cite_start]Offer **Structured Choices** to increase their sense of autonomy, such as choosing which three problems to solve first or what color pen to use[cite: 182, 183].",
            Sensory: "The doodling or fidgeting may be a necessary sensory input. Could you provide a less distracting outlet, like a stress ball or allowing doodling on a separate notepad while listening?"
        },
        'Refusing Work': {
            [cite_start]Escape: "This is a classic escape behavior, likely due to frustration or lack of skills[cite: 185, 186]. **Do not engage in a power struggle.** Instead, use **Effective Scaffolding**. [cite_start]Break the task into smaller chunks, model the first step, or provide sentence starters[cite: 186]. [cite_start]A time-out here would be a reward[cite: 67].",
            Attention: "The refusal is gaining a significant amount of your attention. [cite_start]Use **Planned Ignoring** of the refusal for a moment, engage with a nearby compliant student, and then calmly return to the student with a simple, direct prompt or a choice[cite: 358].",
            Tangible: "The student may be refusing work because they want to do a preferred activity instead. [cite_start]Set up a **Behavior Contract**: 'First, complete these two problems, then you can have 5 minutes on the computer'[cite: 355]."
        },
        'Arguing': {
            Escape: "The argument is a way to delay or escape the task. **Avoid getting drawn into the argument.** Use a simple, clear, and direct phrase: 'This is not negotiable. It's time to begin your work.' [cite_start]Then, disengage and focus on other students[cite: 301].",
            Attention: "The student is seeking to engage you in a power struggle, which is a form of attention. Calmly state the expectation and the logical consequence for not meeting it, then walk away. 'If you continue to argue, you will lose the privilege of choosing your partner. [cite_start]The choice is yours.'[cite: 331, 332]."
        },
        'Physical Aggression': {
            [cite_start]Default: "Your primary goal is safety and de-escalation[cite: 278]. **Immediately shift to De-escalation Strategies.** Use a calm, low tone of voice. Say, 'I can see you're very upset.' Ensure the safety of other students. [cite_start]Do not try to teach or reason with the student until they are in the 'Recovery' phase[cite: 287, 315]."
        },
         'Emotional Outburst': {
            [cite_start]Default: "The student is dysregulated and their rational brain is offline[cite: 285, 286]. [cite_start]**Your calm presence is the primary de-escalation tool [cite: 284][cite_start].** Validate their feeling, not the behavior: 'It sounds like you're feeling really frustrated.'[cite: 296]. [cite_start]Offer a controlled choice to a calming space: 'Would you like to go to the calm-down corner or put your head down here?'[cite: 304]."
        },
        'Avoidance': {
            [cite_start]Escape: "This behavior signals an attempt to escape an academic or social struggle[cite: 38, 53]. Investigate the root cause. [cite_start]Provide academic support, check for understanding, and break the task into smaller steps[cite: 68]. Praise any effort to start."
        },
        'default': {
            Attention: "Use **Differential Reinforcement**. [cite_start]Praise desired behaviors enthusiastically while using planned ignoring for the minor, attention-seeking misbehavior[cite: 348, 358].",
            [cite_start]Escape: "Offer **Structured Choices** to increase buy-in or **Scaffold** the task to reduce frustration[cite: 182, 186].",
            Sensory: "The behavior itself may be meeting a need. Can you provide a safer or less disruptive replacement behavior that serves the same sensory function?",
            [cite_start]Tangible: "Use a clear 'First/Then' statement or create a simple **Behavior Contract**[cite: 355]. 'First, you complete your task, then you can earn the tangible item.'"
        }
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
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    // --- State ---
    let currentState = {
        behavior: null,
        function: null,
    };

    // --- Functions ---
    function showScreen(screenId) {
        screens.forEach(screen => {
            screen.classList.add('hidden');
        });
        document.getElementById(screenId).classList.remove('hidden');
    }

    function getStrategy(behavior, func) {
        // Check for specific behavior-function pair
        if (strategies[behavior] && strategies[behavior][func]) {
            return strategies[behavior][func];
        }
        // Check for default strategies for the behavior (e.g., aggression, outburst)
        if (strategies[behavior] && strategies[behavior]['Default']) {
            return strategies[behavior]['Default'];
        }
        // Fallback to default strategies for the function
        if (strategies['default'][func]) {
            return strategies['default'][func];
        }
        return "No specific strategy found. Focus on building a positive relationship and re-examining the environment for triggers.";
    }

    // --- Event Listeners ---
    logBehaviorBtn.addEventListener('click', () => showScreen('log-behavior-screen'));
    libraryBtn.addEventListener('click', () => showScreen('library-screen'));

    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showScreen(btn.dataset.target);
        });
    });

    functionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedBehavior = commonBehaviorsSelect.value;
            const customBehavior = document.getElementById('custom-behavior').value;

            if (selectedBehavior === 'default' && !customBehavior) {
                alert('Please select or describe a behavior first.');
                return;
            }

            currentState.behavior = selectedBehavior !== 'default' ? selectedBehavior : 'default';
            currentState.function = btn.dataset.function;
            
            const strategy = getStrategy(currentState.behavior, currentState.function);
            strategyText.innerHTML = strategy; // Use innerHTML to render the <strong> and <b> tags
            showScreen('strategy-screen');
        });
    });

    effectiveBtn.addEventListener('click', () => {
        alert('Great! This effectiveness rating would be saved to personalize future recommendations.');
        // In a real app, you would save this preference:
        // Ex: saveEffectiveness(currentState.behavior, currentState.function, 'effective');
        commonBehaviorsSelect.value = 'default';
        document.getElementById('custom-behavior').value = '';
        showScreen('home-screen');
    });

    ineffectiveBtn.addEventListener('click', () => {
        alert('Thank you for the feedback. The app will prioritize other strategies next time.');
        // In a real app, you would deprioritize this strategy:
        // Ex: saveEffectiveness(currentState.behavior, currentState.function, 'ineffective');
        // And potentially offer an alternative. For now, we go back.
         showScreen('log-behavior-screen');
    });

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            // Basic toggle for one-at-a-time accordion
             if (content.style.maxHeight) {
                content.style.maxHeight = null;
                content.style.paddingTop = null;
                content.style.paddingBottom = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                content.style.padding = "15px";
            }
        });
    });

    // --- Initial Setup ---
    showScreen('home-screen');
});