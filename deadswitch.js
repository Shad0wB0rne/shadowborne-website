/**
 * SHADOWBORNE // DEAD SWITCH PROTOCOL
 * Version: 1.0.0
 * Description: Automated "Warrant Canary" that wipes the DOM if not updated.
 */

// --- CONFIGURATION ---
// SYSTEM ADMIN: Update this date to reset the countdown.
// Format: YYYY-MM-DD
const LAST_CHECK_IN = "2026-01-06"; // <--- CHANGE THIS TO TODAY'S DATE TO ACTIVATE
const DAYS_ALLOWED = 30;

document.addEventListener('DOMContentLoaded', () => {
    initDeadSwitch();
});

function initDeadSwitch() {
    const panel = document.getElementById('dead-switch-panel');
    const dateEl = document.getElementById('ds-date');
    const timerEl = document.getElementById('ds-timer');

    if (!panel || !dateEl || !timerEl) {
        console.warn("Dead Switch UI elements not found.");
        return;
    }


    panel.classList.remove('hidden');


    dateEl.innerText = LAST_CHECK_IN;


    const lastDate = new Date(LAST_CHECK_IN);
    const deadline = new Date(lastDate);
    deadline.setDate(deadline.getDate() + DAYS_ALLOWED);


    const interval = setInterval(() => {
        const now = new Date();
        const diff = deadline - now;

        if (diff <= 0) {
            clearInterval(interval);
            executePurgeProtocol(DAYS_ALLOWED);
        } else {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            timerEl.innerText = `${days}d ${hours}h ${mins}m REMAINING`;
        }
    }, 1000);
}

function executePurgeProtocol(days) {
    console.error("CRITICAL FAILURE: DEAD SWITCH TRIGGERED.");

    const deathScreen = `
        <div style="
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: #000; color: #ff003c; z-index: 9999;
            font-family: 'Courier New', monospace;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            text-align: center; padding: 20px;
        ">
            <div style="font-size: 5rem; font-weight: bold; text-shadow: 0 0 20px red; margin-bottom: 20px;">410 GONE</div>
            
            <h1 style="font-size: 2rem; border-bottom: 2px solid #ff003c; padding-bottom: 10px; margin-bottom: 20px;">
                CRITICAL_FAILURE: DEAD_SWITCH_TRIGGERED
            </h1>
            
            <p style="color: #fff; max-width: 600px; line-height: 1.6; margin-bottom: 30px;">
                The operator of this node [SHADOWBORNE] failed to provide a digital signature within the allotted ${days} day window.
                <br><br>
                Automated defense protocols have been executed.
            </p>
            
            <div style="
                background: #111; border: 1px solid #333; padding: 20px;
                width: 100%; max-width: 500px; text-align: left;
                font-size: 0.8rem; color: #00f3ff;
            ">
                > INITIATING_WIPE_SEQUENCE...<br>
                > DELETING_ROOT_DIRECTORY... [DONE]<br>
                > SCRUBBING_SERVER_LOGS... [DONE]<br>
                > OVERWRITING_DRIVES (3 PASSES)... [DONE]<br>
                > ENCRYPTING_BACKUPS... [DONE]<br>
                <br>
                <span style="color: red; animation: blink 1s infinite;">> SYSTEM_HALTED.</span>
            </div>
            
            <style>@keyframes blink { 50% { opacity: 0; } }</style>
        </div>
    `;


    document.body.innerHTML = deathScreen;
    document.body.style.backgroundColor = "black";
    document.body.style.overflow = "hidden";
}