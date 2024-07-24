document.addEventListener("DOMContentLoaded", () => {
    const drawCardBtn = document.getElementById("drawCardBtn");
    const autoRollBtn = document.getElementById("autoRollBtn");
    const stopAutoRollBtn = document.getElementById("stopAutoRollBtn");
    const cardDisplay = document.getElementById("cardDisplay");
    const collectionList = document.getElementById("collectionList");
    const unlockedList = document.getElementById("unlockedList");
    const upgradeLuckBtn = document.getElementById("upgradeLuckBtn");
    const upgradeCost = document.getElementById("upgradeCost");
    const chancesList = document.getElementById("chancesList");
    const filterCheckboxes = document.querySelectorAll(".filter-checkbox");
    const applyFilterBtn = document.getElementById("applyFilterBtn");
    const finalMessage = document.getElementById("finalMessage");
    const rollCounter = document.getElementById("rollCounter"); // Roll counter element
    const achievementPopupContainer = document.getElementById("achievementPopupContainer"); // Container for popups
    const raritySelect = document.getElementById("raritySelect");
    const backgroundCardSelect = document.getElementById("backgroundCardSelect");

    let cards = [];
    let autoRollInterval = null;
    let autoRollSpeed = 50; // Speed of auto-roll in milliseconds (1 second)
    let unlockedCards = new Set();
    let activeFilter = [];
    let gameEnded = false;
    let rollCount = 0; // Counter for rolls
    let achievementMilestones = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000];
    let achievements = new Set(); // To track achieved milestones
    let luck = 1;

    // Define card rarities
    const cardRarities = [
        { name: "Common", baseProbability: 0.5, order: 1, decimalPlaces: 0 },
        { name: "Uncommon", baseProbability: 0.3, order: 2, decimalPlaces: 0 },
        { name: "Rare", baseProbability: 0.1, order: 3, decimalPlaces: 0 },
        { name: "Epic", baseProbability: 0.07, order: 4, decimalPlaces: 0 },
        { name: "Legendary", baseProbability: 0.03, order: 5, decimalPlaces: 0 },
        { name: "Mythical", baseProbability: 0.01, order: 6, decimalPlaces: 0 },
        { name: "Divine", baseProbability: 0.005, order: 7, decimalPlaces: 1 },
        { name: "Celestial", baseProbability: 0.002, order: 8, decimalPlaces: 1 },
        { name: "Ethereal", baseProbability: 0.001, order: 9, decimalPlaces: 1 },
        { name: "Astral", baseProbability: 0.0005, order: 10, decimalPlaces: 2 },
        { name: "Cosmic", baseProbability: 0.0002, order: 11, decimalPlaces: 2 },
        { name: "Quantum", baseProbability: 0.0001, order: 12, decimalPlaces: 2 },
        { name: "Singularity", baseProbability: 0.00005, order: 13, decimalPlaces: 2 },
        { name: "Nebula", baseProbability: 0.00001, order: 14, decimalPlaces: 2 },
        { name: "Stellar", baseProbability: 0.000005, order: 15, decimalPlaces: 3 },
        { name: "Lunar", baseProbability: 0.000001, order: 16, decimalPlaces: 3 },
        { name: "Solar", baseProbability: 0.0000005, order: 17, decimalPlaces: 4 },
        { name: "Nova", baseProbability: 0.0000001, order: 18, decimalPlaces: 4 },
        { name: "Abysal", baseProbability: 0.00000005, order: 19, decimalPlaces: 5 },
        { name: "Radiant", baseProbability: 0.00000001, order: 20, decimalPlaces: 5 },
        { name: "Chrono", baseProbability: 0.000000005, order: 21, decimalPlaces: 6 },
        { name: "Omni", baseProbability: 0.000000001, order: 22, decimalPlaces: 6 },
        { name: "Galactic", baseProbability: 0.0000000005, order: 23, decimalPlaces: 7 },
        { name: "Chromatic", baseProbability: 0.0000000001, order: 24, decimalPlaces: 7 },
        { name: "Infinite", baseProbability: 0.00000000002, order: 25, decimalPlaces: 8 }
    ];

    // Define the explicit upgrade costs in the 1, 5, 1, 5, pattern
    const upgradeCosts = [
        { rarity: "Common", count: 10 },
        { rarity: "Common", count: 20 },
        { rarity: "Uncommon", count: 10 },
        { rarity: "Uncommon", count: 20 },
        { rarity: "Rare", count: 5 },
        { rarity: "Rare", count: 10 },
        { rarity: "Epic", count: 5 },
        { rarity: "Epic", count: 10 },
        { rarity: "Legendary", count: 1 },
        { rarity: "Legendary", count: 5 },
        { rarity: "Mythical", count: 1 },
        { rarity: "Mythical", count: 5 },
        { rarity: "Divine", count: 1 },
        { rarity: "Divine", count: 5 },
        { rarity: "Celestial", count: 1 },
        { rarity: "Celestial", count: 5 },
        { rarity: "Ethereal", count: 1 },
        { rarity: "Ethereal", count: 5 },
        { rarity: "Astral", count: 1 },
        { rarity: "Astral", count: 5 },
        { rarity: "Cosmic", count: 1 },
        { rarity: "Cosmic", count: 5 },
        { rarity: "Quantum", count: 1 },
        { rarity: "Quantum", count: 5 },
        { rarity: "Singularity", count: 1 },
        { rarity: "Singularity", count: 5 },
        { rarity: "Nebula", count: 1 },
        { rarity: "Nebula", count: 5 },
        { rarity: "Stellar", count: 1 },
        { rarity: "Stellar", count: 5 },
        { rarity: "Lunar", count: 1 },
        { rarity: "Lunar", count: 5 },
        { rarity: "Solar", count: 1 },
        { rarity: "Solar", count: 5 },
        { rarity: "Nova", count: 1 },
        { rarity: "Nova", count: 5 },
        { rarity: "Abysal", count: 1 },
        { rarity: "Abysal", count: 5 },
        { rarity: "Radiant", count: 1 },
        { rarity: "Radiant", count: 5 },
        { rarity: "Chrono", count: 1 },
        { rarity: "Chrono", count: 5 },
        { rarity: "Omni", count: 1 },
        { rarity: "Omni", count: 5 },
        { rarity: "Galactic", count: 1 },
        { rarity: "Galactic", count: 5 },
        { rarity: "Chromatic", count: 1 },
        { rarity: "Chromatic", count: 5 },
        { rarity: "Infinite", count: 1 }
    ];

    // Play the background music when the page loads
    backgroundMusic.play();

    // Toggle background music on/off
    toggleMusicBtn.addEventListener("click", () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            toggleMusicBtn.textContent = "Turn Music Off";
        } else {
            backgroundMusic.pause();
            toggleMusicBtn.textContent = "Turn Music On";
        }
    });
 

    function drawCard() {
        if (gameEnded) return;

        let totalProbability = cardRarities.reduce((sum, card) => sum + card.baseProbability, 0);
        let probability = Math.random() * totalProbability;

        let drawnCard;
        for (let card of cardRarities) {
            probability -= card.baseProbability;
            if (probability <= 0) {
                drawnCard = card;
                break;
            }
        }

        if (drawnCard) {
            if (activeFilter.length === 0 || !activeFilter.includes(drawnCard.name)) {
                cards.push(drawnCard.name);
                updateCollection();
                updateUnlockedCards();
                updateChances();
                cardDisplay.textContent = `You drew a ${drawnCard.name} card!`;

                if (drawnCard.name === "Test") {
                    showFinalMessage();
                    gameEnded = true;
                }

                // Increment and update roll counter
                rollCount++;
                rollCounter.textContent = `Rolls: ${rollCount}`;

                // Check for achievements
                checkAchievements();

            } else {
                cardDisplay.textContent = `Filtered out: ${drawnCard.name}`;
            }
        }
    }

    function startAutoRoll() {
        if (autoRollInterval) return; // Prevent starting multiple intervals
        autoRollInterval = setInterval(drawCard, autoRollSpeed);
        autoRollBtn.disabled = true;
        stopAutoRollBtn.disabled = false;
    }

    function stopAutoRoll() {
        if (autoRollInterval) {
            clearInterval(autoRollInterval);
            autoRollInterval = null;
            autoRollBtn.disabled = false;
            stopAutoRollBtn.disabled = true;
        }
    }

    // Event listeners for auto-roll buttons
    autoRollBtn.addEventListener("click", startAutoRoll);
    stopAutoRollBtn.addEventListener("click", stopAutoRoll);

    // Ensure auto-roll buttons are enabled/disabled correctly
    stopAutoRollBtn.disabled = true;

    function updateCollection() {
        collectionList.innerHTML = '';
        const cardCounts = cards.reduce((counts, card) => {
            counts[card] = (counts[card] || 0) + 1;
            return counts;
        }, {});

        cardRarities.sort((a, b) => a.order - b.order).forEach(rarity => {
            if (cardCounts[rarity.name]) {
                const item = document.createElement('li');
                item.className = rarity.name;
                item.textContent = `${rarity.name}: ${cardCounts[rarity.name]}`;
                collectionList.appendChild(item);
            }
        });
    }

    function updateUnlockedCards() {
        unlockedList.innerHTML = '';
        const uniqueCards = Array.from(new Set(cards));
        uniqueCards.forEach(cardName => {
            const card = cardRarities.find(r => r.name === cardName);
            if (card) {
                const item = document.createElement('li');
                item.className = card.name;
                item.textContent = card.name;
                unlockedList.appendChild(item);
            }
        });

        Array.from(unlockedList.children)
            .sort((a, b) => cardRarities.find(c => c.name === a.textContent).order - cardRarities.find(c => c.name === b.textContent).order)
            .forEach(item => unlockedList.appendChild(item));
    }

    function updateChances() {
        chancesList.innerHTML = '';
        cardRarities.forEach(rarity => {
            const item = document.createElement('li');
            item.className = rarity.name;
            item.textContent = `${rarity.name}: ${(Math.min(rarity.baseProbability * luck * 100, 100)).toFixed(rarity.decimalPlaces)}%`; // Cap at 100%
            chancesList.appendChild(item);
        });
    }

    function applyFilter() {
        activeFilter = Array.from(document.querySelectorAll(".filter-checkbox:checked")).map(cb => cb.value);
        if (activeFilter.length > 0) {
            cardDisplay.textContent = `Filtering cards: ${activeFilter.join(", ")}`;
        } else {
            cardDisplay.textContent = '';
        }
    }

    function upgradeLuck() {
        if (gameEnded) return;

        // Find the current upgrade cost based on the luck level
        let costIndex = luck - 1; // Adjust for 0-based index
        let cost = upgradeCosts[costIndex];
        
        if (cost) {
            const requiredCount = cards.filter(card => card === cost.rarity).length;
            if (requiredCount >= cost.count) {
                luck++;
                updateChances();
                updateUpgradeCost();
                // Check for the 'Max Upgrades' achievement
                if (luck === upgradeCosts.length + 1) {
                    awardAchievement('maxUpgrades');
                }
            } else {
                alert(`Not enough ${cost.rarity} cards to upgrade.`);
            }
        } else {
            alert("Upgrade limit reached or pattern not found.");
        }
    }

    function updateUpgradeCost() {
        // Find the current upgrade cost based on the luck level
        let costIndex = luck - 1; // Adjust for 0-based index
        let cost = upgradeCosts[costIndex];
        if (cost) {
            upgradeCost.textContent = `Upgrade Cost: ${cost.rarity} x ${cost.count}`;
        } else {
            upgradeCost.textContent = `Upgrade Cost: Maxed out`;
        }
    }

    function showFinalMessage() {
        finalMessage.innerHTML = `
            <div class="cutscene">
                <h1>Congratulations!</h1>
                <p>You have unlocked the Test card!</p>
                <p>Thanks for playing!</p>
            </div>
        `;
        finalMessage.style.display = 'flex';
    }

    function checkAchievements() {
        achievementMilestones.forEach(milestone => {
            if (rollCount >= milestone && !achievements.has(milestone)) {
                achievements.add(milestone);
                showAchievementPopup(`You have rolled ${milestone} times!`);
            }
        });
    }

    function showAchievementPopup(message) {
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.textContent = message;
        achievementPopupContainer.appendChild(popup);

        setTimeout(() => {
            popup.style.opacity = 1;
        }, 10);

        setTimeout(() => {
            popup.style.opacity = 0;
            setTimeout(() => {
                achievementPopupContainer.removeChild(popup);
            }, 500);
        }, 5000);
    }

    drawCardBtn.addEventListener('click', drawCard);
    upgradeLuckBtn.addEventListener('click', upgradeLuck);
    applyFilterBtn.addEventListener('click', applyFilter);

    // Initialize upgrade cost
    updateUpgradeCost();

  // Initial population of the dropdown
  populateRaritySelect();
});