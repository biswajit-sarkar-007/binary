document.addEventListener("DOMContentLoaded", function () {
    const dot = document.getElementById("dot");
    const progressBar = document.getElementById("progress-bar");
    const statusMessage = document.getElementById("status-message");

    let isHolding = false;
    let progress = 0;
    let lastX, lastY;
    let stabilityThreshold = 10; // Movement sensitivity

    // Function to start holding the dot
    function startHold(event) {
        isHolding = true;
        lastX = event.clientX;
        lastY = event.clientY;
        statusMessage.textContent = "Stay in the flow...";
    }

    // Function to move the dot
    function moveDot(event) {
        if (!isHolding) return;

        let dx = Math.abs(event.clientX - lastX);
        let dy = Math.abs(event.clientY - lastY);

        if (dx < stabilityThreshold && dy < stabilityThreshold) {
            progress = Math.min(100, progress + 1);
        } else {
            progress = Math.max(0, progress - 2);
            statusMessage.textContent = "Too fast! Slow down...";
        }

        progressBar.style.width = progress + "%";

        if (progress >= 100) {
            statusMessage.textContent = "Great job! You mastered the pause!";
        }

        lastX = event.clientX;
        lastY = event.clientY;
    }

    // Function to stop holding the dot
    function stopHold() {
        isHolding = false;
        statusMessage.textContent = "Stay in the flow...";
        progress = 0;
        progressBar.style.width = "0%";
    }

    // Event Listeners
    dot.addEventListener("mousedown", startHold);
    document.addEventListener("mousemove", moveDot);
    document.addEventListener("mouseup", stopHold);

    dot.addEventListener("touchstart", (e) => startHold(e.touches[0]));
    document.addEventListener("touchmove", (e) => moveDot(e.touches[0]));
    document.addEventListener("touchend", stopHold);
});
