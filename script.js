Of course. To make the app provide a new strategy in real time when a user clicks "Not Effective," you need to update the logic in your `script.js` file.

The goal is to:

1.  Keep track of the strategies already shown for a specific behavior.
2.  When "Not Effective" is clicked, find a *different* strategy for the same behavior.
3.  Display the new strategy immediately without making the user start over.
4.  If no other strategies are available, inform the user.

Here is the updated `script.js` file with these changes implemented. The key modifications are made to the `strategies` data structure (to allow for multiple strategies) and the event listener for the `ineffective-btn`.

### **Updated `script.js`**

```javascript
document.addEventListener('DOMContentLoaded', () => {

    // --- DATA: Strategies updated to be arrays, allowing for multiple options ---
    const strategies = {
        'Calling Out': {
            Attention: [
                "Use **Differential Reinforcement**. Intentionally give enthusiastic praise when the student raises their hand, and calmly ignore them when they call out.",
                "Use a **High-Probability Request Sequence**. First, give a few simple commands you know the student will follow (e.g., 'Touch your nose'), then give the target request ('Please wait for your turn').",
                "Try **Planned Ignoring** for the calling out, paired with giving immediate positive attention for any appropriate, quiet behavior."
            ],
            Escape: [
                "This is unusual for this behavior. Consider if the student is calling out to distract from a task they find difficult. Try **Scaffolding** the task or offering support."
            ]
        },
        'Off-Task': {
            Attention: [
                "Use a **Proximity Control** strategy. Simply move and stand near the student to non-verbally cue them back to the task, while providing positive attention for on-task behavior.",
                "Try a **High-Probability Request Sequence** to build momentum, followed by the on-task request."
            ],
            Escape: [
                "Offer **Structured Choices** to increase their sense of autonomy, such as choosing which three problems to solve first or what color pen to use.",
                "The task may be too long. Break it into smaller, more manageable chunks and provide reinforcement upon completion of each chunk.",
                "Use a 'First/Then' statement. 'First, complete this one row of problems, then you can take a 2-minute break'."
            ],
            Sensory: [
                "The doodling or fidgeting may be a necessary sensory input. Provide a less distracting outlet, like a stress ball, resistance band on their chair, or allowing doodling on a separate notepad while listening."
            ]
        },
        'Refusing Work': {
            Escape: [
                "Use **Effective Scaffolding**. Do not engage in a power struggle. Break the task into smaller chunks, model the first step, or provide sentence starters.",
                "Offer **Structured Choices** related to the assignment. 'Would you like to write your answer or draw it? Do you want to do the odd problems or the even problems?'",
                "Implement **Behavioral Momentum**. Start with 3-5 simple requests the student is likely to follow ('Give me a high-five,' 'Tap the table') before giving the low-probability request ('Please start your work')."
            ],
            Attention: [
                "Use **Planned Ignoring** of the refusal for a moment, engage with a nearby compliant student, and then calmly return to the student with a simple, direct prompt or a choice.",
                "State the expectation and the positive outcome. 'When you finish your work, you will be able to choose a book to read.' Then, walk away to avoid a power struggle."
            ],
            Tangible: [
                "Set up a **Behavior Contract**: 'First, complete these two problems, then you can have 5 minutes on the computer'."
            ]
        },
        'Arguing': {
            Escape: [
                "**Avoid getting drawn into the argument.** Use a simple, clear, and direct phrase: 'This is not negotiable. It's time to begin your work.' Then, disengage and focus on other students.",
                "Use a calm, neutral tone and act as a 'broken record,' repeating the expectation once or twice without engaging with the content of the argument."
            ],
            Attention: [
                "Calmly state the expectation and the logical consequence for not meeting it, then walk away. 'If you continue to argue, you will lose the privilege of choosing your partner. The choice is yours.'."
            ]
        },
        'Physical Aggression': {
            Default: [
                "Your primary goal is safety and de-escalation. **Immediately shift to De-escalation Strategies.** Use a calm, low tone of voice. Say, 'I can see you're very upset.' Ensure the safety of other students. Do not try to teach or reason with the student until they are in the 'Recovery' phase."
            ]
        },
         'Emotional Outburst': {
            Default: [
                "The student is dysregulated. **Your calm presence is the primary de-escalation tool.** Validate their feeling, not the behavior: 'It sounds like you're feeling really frustrated.'",
                "Offer a controlled choice to a calming space: 'Would you like to go to the calm-down corner or put your head down here?'"
            ]
        },
        'Avoidance': {
            Escape: [
                "This behavior signals an attempt to escape an academic or social struggle. Investigate the root cause. Provide academic support, check for understanding, and break the task into smaller steps. Praise any effort to start."
            ]
        },
        'default': {
            Attention: [
                "Use **Differential Reinforcement**. Praise desired behaviors enthusiastically while using planned ignoring for the minor, attention-seeking misbehavior."
            ],
            Escape: [
                "Offer **Structured Choices** to increase buy-in or **Scaffold** the task to reduce frustration."
            ],
            Sensory: [
                "The behavior itself may be meeting a need. Can you provide a safer or less disruptive replacement behavior that serves the same sensory function?"
            ],
            Tangible: [
                "Use a clear 'First/Then' statement or create a simple **Behavior Contract**. 'First, you complete your task, then you can earn the tangible item.'"
            ]
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
        attemptedStrategies: [],
    };

    // --- Functions ---
    function showScreen(screenId) {
        screens.forEach(screen => {
            screen.classList.add('hidden');
        });
        document.getElementById(screenId).classList.remove('hidden');
    }

    function getStrategies(behavior, func) {
        if (strategies[behavior] && strategies[behavior][func]) {
            return strategies[behavior][func];
        }
        if (strategies[behavior] && strategies[behavior]['Default']) {
            return strategies[behavior]['Default'];
        }
        if (strategies['default'][func]) {
            return strategies['default'][func];
        }
        return ["No specific strategy found. Focus on building a positive relationship and re-examining the environment for triggers."];
    }

    function displayNewStrategy() {
        const availableStrategies = getStrategies(currentState.behavior, currentState.function);
        const newStrategies = availableStrategies.filter(s => !currentState.attemptedStrategies.includes(s));

        if (newStrategies.length > 0) {
            const strategy = newStrategies[0];
            currentState.attemptedStrategies.push(strategy);
            strategyText.innerHTML = strategy;
        } else {
            strategyText.innerHTML = "No additional strategies are available for this combination. Consider observing the behavior again to confirm its function or consult the Resource Library.";
            ineffectiveBtn.style.display = 'none'; // Hide button if no more options
        }
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

            // Reset state for a new behavior log
            currentState.attemptedStrategies = [];
            currentState.behavior = selectedBehavior !== 'default' ? selectedBehavior : 'default';
            currentState.function = btn.dataset.function;

            ineffectiveBtn.style.display = 'inline-block'; // Ensure button is visible
            displayNewStrategy();
            showScreen('strategy-screen');
        });
    });

    effectiveBtn.addEventListener('click', () => {
        alert('Great! This effectiveness rating would be saved to personalize future recommendations.');
        commonBehaviorsSelect.value = 'default';
        document.getElementById('custom-behavior').value = '';
        showScreen('home-screen');
    });

    ineffectiveBtn.addEventListener('click', () => {
        // Instead of going back, just display a new strategy
        displayNewStrategy();
    });

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
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
```
