document.addEventListener("DOMContentLoaded", function () {
    let userLevel = localStorage.getItem("userLevel") ? parseInt(localStorage.getItem("userLevel")) : 0;
    let daysCount = localStorage.getItem("daysCount") ? parseInt(localStorage.getItem("daysCount")) : 1;
    const levelElement = document.getElementById("user-level");
    const daysElement = document.getElementById("days-count");
    const questList = document.querySelector(".daily-quests ul");
    const profileImage = document.getElementById("profile-image");
    const fileInput = document.getElementById("file-upload");
    const usernameElement = document.querySelector(".username");

    // Quest Pool (Daily Random Challenges)
    const questPool = [
        "📵 No phone for 1 hour",
        "📖 Read a book for 30 mins",
        "🧘 Meditate for 10 mins",
        "🚶‍♂️ Go for a 15-min walk",
        "🎨 Do a creative activity",
        "💧 Drink 2L of water today",
        "📝 Write in a journal",
        "🎶 Listen to calming music",
        "🌿 Spend 10 minutes in nature",
        "🤝 Help someone today"
    ];

    // Get Current Date (YYYY-MM-DD Format)
    function getTodayDate() {
        return new Date().toISOString().split('T')[0];
    }

    // Load Daily Quests When a New Day Starts
    function loadDailyQuests() {
        questList.innerHTML = "";
        let selectedQuests = [];

        while (selectedQuests.length < 3) {
            let randomQuest = questPool[Math.floor(Math.random() * questPool.length)];
            if (!selectedQuests.includes(randomQuest)) {
                selectedQuests.push(randomQuest);
            }
        }

        selectedQuests.forEach(questText => {
            let li = document.createElement("li");
            li.classList.add("quest");
            li.textContent = questText;
            li.addEventListener("click", function () {
                if (!li.classList.contains("completed")) {
                    li.classList.add("completed");
                    li.style.background = "#28a745";
                    li.innerHTML += " ✅";
                    checkAllQuestsCompleted();
                }
            });
            questList.appendChild(li);
        });

        localStorage.setItem("dailyQuests", JSON.stringify(selectedQuests));
        localStorage.setItem("lastQuestDate", getTodayDate());
        localStorage.setItem("questsCompleted", "false"); // Reset completion status
    }

    // Check if a New Day Has Passed, Then Load New Quests
    function checkQuestReset() {
        const lastQuestDate = localStorage.getItem("lastQuestDate");
        if (lastQuestDate !== getTodayDate()) {
            loadDailyQuests();
        } else {
            // Load previous day's quests if they exist
            const savedQuests = JSON.parse(localStorage.getItem("dailyQuests"));
            if (savedQuests) {
                questList.innerHTML = "";
                savedQuests.forEach(questText => {
                    let li = document.createElement("li");
                    li.classList.add("quest");
                    li.textContent = questText;
                    li.addEventListener("click", function () {
                        if (!li.classList.contains("completed")) {
                            li.classList.add("completed");
                            li.style.background = "#28a745";
                            li.innerHTML += " ✅";
                            checkAllQuestsCompleted();
                        }
                    });
                    questList.appendChild(li);
                });
            }
        }
    }

    // Check If All Quests Are Completed
    function checkAllQuestsCompleted() {
        const allCompleted = [...document.querySelectorAll(".quest")].every(quest => quest.classList.contains("completed"));
        if (allCompleted) {
            if (localStorage.getItem("questsCompleted") === "false") {
                userLevel++;
                daysCount++;

                levelElement.textContent = userLevel;
                daysElement.textContent = daysCount;

                localStorage.setItem("userLevel", userLevel);
                localStorage.setItem("daysCount", daysCount);
                localStorage.setItem("questsCompleted", "true"); // Mark as completed for the day

                setTimeout(() => {
                    alert("🎉 Congratulations! You've completed all quests for today. Come back tomorrow for new challenges! 🎯");
                }, 500);
            }
        }
    }

    // Prevent Clicking on Quests After Completion
    function disableQuestsIfCompleted() {
        if (localStorage.getItem("questsCompleted") === "true") {
            document.querySelectorAll(".quest").forEach(quest => {
                quest.classList.add("completed");
                quest.style.background = "#28a745";
                quest.innerHTML += " ✅";
            });
        }
    }

    // Profile Image Upload
    fileInput.addEventListener("change", function () {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profileImage.src = e.target.result;
                localStorage.setItem("profileImage", e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Load Profile Image if Exists
    if (localStorage.getItem("profileImage")) {
        profileImage.src = localStorage.getItem("profileImage");
    }

    // Load Username from LocalStorage
    usernameElement.addEventListener("input", function () {
        localStorage.setItem("username", usernameElement.textContent);
    });

    if (localStorage.getItem("username")) {
        usernameElement.textContent = localStorage.getItem("username");
    }

    // Load User Level & Days
    levelElement.textContent = userLevel;
    daysElement.textContent = daysCount;

    // Check if the day has changed, and load new quests
    checkQuestReset();
    disableQuestsIfCompleted(); // Prevent quest clicks if already completed today
});
