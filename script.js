document.addEventListener('DOMContentLoaded', () => {
    // Game state
    const gameState = {
        currentScreen: 'title-screen',
        character: null,
        affection: 50,
        scenarioIndex: 0,
        characterEmotions: {
            happy: {
                mouth: "M40 55 Q50 65 60 55"
            },
            neutral: {
                mouth: "M40 55 Q50 60 60 55"
            },
            sad: {
                mouth: "M40 60 Q50 55 60 60"
            },
            surprised: {
                mouth: "M40 55 Q50 60 60 55",
                eyes: "r4"  // Larger eyes
            },
            flirty: {
                mouth: "M40 55 Q50 62 60 55",
                leftEye: "M37 35 L43 33"  // Winking left eye
            }
        }
    };

    // DOM elements
    const screens = document.querySelectorAll('.screen');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const characterElements = document.querySelectorAll('.character');
    const affectionMeter = document.getElementById('affection-meter');
    const characterDisplay = document.getElementById('character-display');
    const characterNameEl = document.getElementById('character-name');
    const dialogueTextEl = document.getElementById('dialogue-text');
    const choicesContainer = document.getElementById('choices-container');
    const dateBg = document.getElementById('date-bg');
    const endingTitle = document.getElementById('ending-title');
    const endingText = document.getElementById('ending-text');
    const endingImage = document.getElementById('ending-image');

    // Character data
    const characters = {
        alex: {
            name: "Alex",
            color: "#FFD700",
            scenarios: [
                {
                    location: "café",
                    dialogue: "Hey there! Nice to meet you. I was thinking we could grab a coffee and then maybe go for a hike? I know this awesome trail nearby.",
                    emotion: "happy",
                    choices: [
                        { text: "Coffee and hiking sounds perfect!", affectionChange: 10 },
                        { text: "I'd prefer something less active for our first date.", affectionChange: -5 },
                        { text: "How about just coffee today and we'll see how it goes?", affectionChange: 5 }
                    ]
                },
                {
                    location: "park",
                    dialogue: "This is such a beautiful day! I love being outdoors. Do you come to this park often?",
                    emotion: "happy",
                    choices: [
                        { text: "I try to! Nature helps me recharge.", affectionChange: 10 },
                        { text: "Not really, I'm more of an indoor person.", affectionChange: -5 },
                        { text: "Sometimes. It's nice to get fresh air occasionally.", affectionChange: 5 }
                    ]
                },
                {
                    location: "restaurant",
                    dialogue: "I had a great time today! Would you be interested in going rock climbing with me next weekend?",
                    emotion: "flirty",
                    choices: [
                        { text: "That sounds exciting! I'd love to try it.", affectionChange: 15 },
                        { text: "I don't think rock climbing is for me, sorry.", affectionChange: -10 },
                        { text: "I might be a bit nervous, but I'll give it a shot!", affectionChange: 10 }
                    ]
                }
            ]
        },
        jordan: {
            name: "Jordan",
            color: "#87CEEB",
            scenarios: [
                {
                    location: "library",
                    dialogue: "Hi, it's nice to meet you. This bookstore has a great collection. Do you enjoy reading?",
                    emotion: "neutral",
                    choices: [
                        { text: "Absolutely! I always have a book with me.", affectionChange: 10 },
                        { text: "Not really, books aren't my thing.", affectionChange: -10 },
                        { text: "I enjoy it occasionally, when I find the right book.", affectionChange: 5 }
                    ]
                },
                {
                    location: "café",
                    dialogue: "I've been thinking about that philosophical concept we discussed earlier. It's quite fascinating how it applies to everyday life.",
                    emotion: "happy",
                    choices: [
                        { text: "I've been thinking about it too! Let's discuss more.", affectionChange: 15 },
                        { text: "That's a bit too deep for a casual date, isn't it?", affectionChange: -10 },
                        { text: "It's interesting, but maybe we can talk about something lighter?", affectionChange: 0 }
                    ]
                },
                {
                    location: "gallery",
                    dialogue: "This exhibit is thought-provoking. Art has such power to convey complex emotions, don't you think?",
                    emotion: "neutral",
                    choices: [
                        { text: "Completely agree. I'm moved by how this piece captures human vulnerability.", affectionChange: 15 },
                        { text: "I don't really get art, to be honest.", affectionChange: -10 },
                        { text: "Some art speaks to me, though I'm not an expert.", affectionChange: 5 }
                    ]
                }
            ]
        },
        taylor: {
            name: "Taylor",
            color: "#FF69B4",
            scenarios: [
                {
                    location: "studio",
                    dialogue: "Welcome to my art studio! I'm so excited to show you what I've been working on. Do you have any creative hobbies?",
                    emotion: "happy",
                    choices: [
                        { text: "I love creating things too! I'd be happy to share my work sometime.", affectionChange: 15 },
                        { text: "Not really, I don't have much of a creative side.", affectionChange: -5 },
                        { text: "I appreciate art but haven't found my creative outlet yet.", affectionChange: 5 }
                    ]
                },
                {
                    location: "concert",
                    dialogue: "This band's music always inspires me! The way they blend different genres is so innovative. What do you think?",
                    emotion: "happy",
                    choices: [
                        { text: "I agree! Their harmonies are incredible and the lyrics are so meaningful.", affectionChange: 10 },
                        { text: "They're okay, but I prefer more mainstream music.", affectionChange: -5 },
                        { text: "I'm enjoying discovering new music with you.", affectionChange: 5 }
                    ]
                },
                {
                    location: "café",
                    dialogue: "I've been thinking about collaborating on an art project with other local artists. Would you be interested in coming to the exhibition?",
                    emotion: "flirty",
                    choices: [
                        { text: "I wouldn't miss it! I'd love to support your creative journey.", affectionChange: 15 },
                        { text: "Art shows aren't really my scene, sorry.", affectionChange: -10 },
                        { text: "I'll try to make it if I'm free that day.", affectionChange: 0 }
                    ]
                }
            ]
        }
    };

    // Location backgrounds using CSS gradients
    const locations = {
        café: "linear-gradient(to bottom, #d7ccc8, #a1887f)",
        park: "linear-gradient(to bottom, #a5d6a7, #66bb6a)",
        restaurant: "linear-gradient(to bottom, #90caf9, #42a5f5)",
        library: "linear-gradient(to bottom, #bcaaa4, #8d6e63)",
        gallery: "linear-gradient(to bottom, #e0e0e0, #9e9e9e)",
        studio: "linear-gradient(to bottom, #ffcc80, #ff9800)",
        concert: "linear-gradient(to bottom, #ce93d8, #8e24aa)"
    };

    // Event Listeners
    startBtn.addEventListener('click', () => showScreen('character-select'));
    restartBtn.addEventListener('click', resetGame);

    characterElements.forEach(character => {
        character.addEventListener('click', () => {
            const characterId = character.dataset.id;
            selectCharacter(characterId);
        });
    });

    // Function to switch screens
    function showScreen(screenId) {
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        gameState.currentScreen = screenId;
    }

    // Reset game state
    function resetGame() {
        gameState.character = null;
        gameState.affection = 50;
        gameState.scenarioIndex = 0;
        updateAffectionMeter();
        showScreen('title-screen');
    }

    // Select character and start date
    function selectCharacter(characterId) {
        gameState.character = characters[characterId];
        
        // Create character avatar for date screen
        const avatar = document.querySelector(`.character[data-id="${characterId}"] svg`).cloneNode(true);
        characterDisplay.innerHTML = '';
        characterDisplay.appendChild(avatar);
        
        startDate();
    }

    // Start or continue the date
    function startDate() {
        showScreen('date-screen');
        
        if (gameState.scenarioIndex >= gameState.character.scenarios.length) {
            showEnding();
            return;
        }
        
        const scenario = gameState.character.scenarios[gameState.scenarioIndex];
        
        // Set background for current location
        dateBg.style.background = locations[scenario.location];
        
        // Display character name and dialogue
        characterNameEl.textContent = gameState.character.name;
        dialogueTextEl.textContent = scenario.dialogue;
        
        // Update character emotion
        updateCharacterEmotion(scenario.emotion);
        
        // Create choice buttons
        choicesContainer.innerHTML = '';
        scenario.choices.forEach(choice => {
            const button = document.createElement('button');
            button.classList.add('choice-btn');
            button.textContent = choice.text;
            button.addEventListener('click', () => makeChoice(choice));
            choicesContainer.appendChild(button);
        });
    }

    // Handle player choice
    function makeChoice(choice) {
        // Update affection
        gameState.affection += choice.affectionChange;
        gameState.affection = Math.max(0, Math.min(100, gameState.affection)); // Keep within 0-100
        updateAffectionMeter();
        
        // Show a brief reaction based on affection change
        if (choice.affectionChange > 0) {
            updateCharacterEmotion('happy');
        } else if (choice.affectionChange < 0) {
            updateCharacterEmotion('sad');
        }
        
        // Move to next scenario
        gameState.scenarioIndex++;
        
        // Short delay before proceeding
        setTimeout(() => {
            startDate();
        }, 1000);
    }

    // Update the affection meter
    function updateAffectionMeter() {
        affectionMeter.style.width = `${gameState.affection}%`;
        
        // Change color based on affection level
        if (gameState.affection > 75) {
            affectionMeter.style.backgroundColor = '#ff79c6';
        } else if (gameState.affection > 25) {
            affectionMeter.style.backgroundColor = '#ffb86c';
        } else {
            affectionMeter.style.backgroundColor = '#ff5555';
        }
    }

    // Update character's emotional expression
    function updateCharacterEmotion(emotion) {
        if (!gameState.character) return;
        
        const avatar = characterDisplay.querySelector('svg');
        const mouth = avatar.querySelector('path');
        const leftEye = avatar.querySelector('circle:nth-of-type(2)');
        const rightEye = avatar.querySelector('circle:nth-of-type(3)');
        
        // Reset eyes to default
        leftEye.setAttribute('r', '3');
        rightEye.setAttribute('r', '3');
        
        // Apply emotion changes
        const emotionData = gameState.characterEmotions[emotion];
        if (emotionData) {
            if (emotionData.mouth) {
                mouth.setAttribute('d', emotionData.mouth);
            }
            if (emotionData.eyes) {
                leftEye.setAttribute('r', emotionData.eyes.substring(1));
                rightEye.setAttribute('r', emotionData.eyes.substring(1));
            }
            if (emotionData.leftEye) {
                leftEye.outerHTML = `<path d="${emotionData.leftEye}" stroke="#000" stroke-width="2" fill="none"/>`;
            }
        }
        
        // Add a little bounce animation
        avatar.style.transform = 'scale(1.05)';
        setTimeout(() => {
            avatar.style.transform = 'scale(1)';
        }, 300);
    }

    // Show ending based on affection level
    function showEnding() {
        showScreen('ending-screen');
        
        // Create SVG for ending image
        const characterSvg = characterDisplay.querySelector('svg').cloneNode(true);
        
        if (gameState.affection >= 75) {
            endingTitle.textContent = "A Wonderful Connection!";
            endingText.textContent = `You and ${gameState.character.name} really hit it off! After a few more wonderful dates, your relationship continues to blossom. Who knows what the future holds?`;
            updateCharacterEmotion('happy');
        } else if (gameState.affection >= 40) {
            endingTitle.textContent = "A Pleasant Experience";
            endingText.textContent = `You and ${gameState.character.name} had a nice time together. You might stay friends, and who knows what could develop over time.`;
            updateCharacterEmotion('neutral');
        } else {
            endingTitle.textContent = "Not a Match";
            endingText.textContent = `Unfortunately, you and ${gameState.character.name} didn't quite click. That's okay! There are plenty of other fish in the sea.`;
            updateCharacterEmotion('sad');
        }
        
        // Add heart to ending based on affection
        const heartColor = gameState.affection >= 75 ? "#ff0066" : 
                          gameState.affection >= 40 ? "#ffaa00" : "#999999";
        
        endingImage.innerHTML = `
            <svg viewBox="0 0 100 100" width="200" height="200">
                <path d="M50 80 C10 40 10 10 30 10 C40 10 50 20 50 20 C50 20 60 10 70 10 C90 10 90 40 50 80 Z" 
                      fill="${heartColor}" />
                ${characterSvg.innerHTML}
            </svg>
        `;
    }
    
    // Initialize game
    updateAffectionMeter();
});

