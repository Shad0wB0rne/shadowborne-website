
const SYSTEM = {
    user: "root",
    host: "shadowborne-node",
    password: document.querySelector('meta[name="access-token"]')?.content || "root",
    typingSpeed: 10,
    version: "v9.0.4-nightly"
};


const FILE_SYSTEM = {
    "readme.txt": `
[ AUTO_LOG: SURVEILLANCE_NODE_07 ]
----------------------------------
Do not mistake silence for safety. 
While you stare at this screen, I am staring back.

I parsed your keystrokes before they registered.
I traced your packet route back to the source.
Your anonymity is a costume, and it is wearing thin.

You are no longer the User. You are my Dataset.
`
};


const outputDiv = document.getElementById('terminal-output');
const terminalWindow = document.getElementById('terminal-window');
const inputField = document.getElementById('terminal-input');

let state = {
    isPasswordMode: false,
    commandHistory: [],
    historyIndex: -1
};



async function type(text, color = "text-gray-400", speed = SYSTEM.typingSpeed) {
    const div = document.createElement('div');
    div.className = `font-mono text-xs md:text-sm ${color} break-words whitespace-pre-wrap leading-tight mb-1`;
    outputDiv.appendChild(div);


    terminalWindow.scrollTop = terminalWindow.scrollHeight;

    for (let char of text) {
        div.textContent += char;
        if (speed > 0) await new Promise(r => setTimeout(r, speed));
    }
    terminalWindow.scrollTop = terminalWindow.scrollHeight;
}

function print(text, color = "text-gray-400") {
    const div = document.createElement('div');
    div.className = `font-mono text-xs md:text-sm ${color} break-words whitespace-pre-wrap leading-tight mb-1`;
    div.textContent = text;
    outputDiv.appendChild(div);
    terminalWindow.scrollTop = terminalWindow.scrollHeight;
}


function getSystemInfo() {
    const ua = navigator.userAgent;
    let browser = "Unknown";
    if (ua.indexOf("Chrome") > -1) browser = "Chrome (Chromium)";
    else if (ua.indexOf("Firefox") > -1) browser = "Firefox (Gecko)";
    else if (ua.indexOf("Safari") > -1) browser = "Safari (WebKit)";

    return {
        os: navigator.platform.toUpperCase(),
        cores: navigator.hardwareConcurrency || "N/A",
        res: `${window.screen.width}x${window.screen.height}`,
        browser: browser,
        lang: navigator.language.toUpperCase()
    };
}


const COMMANDS = {
    'help': {
        desc: "List protocols",
        exec: async () => {
            await type("ACTIVE PROTOCOLS:", "text-[#00f3ff] font-bold");
            print("  neofetch   : System Fingerprinting");
            print("  ls         : List Directory");
            print("  cat        : Read File [cat filename]");
            print("  protocol   : UI Override [phantom|anarchy|midas]");
            print("  trace      : Network Hop Analysis");
            print("  sudo       : Elevate Privileges");
            print("  clear      : Purge Logs");
        }
    },
    'neofetch': {
        desc: "Real System Info",
        exec: async () => {
            const sys = getSystemInfo();

            const art = `
      .:::.       USER: ${SYSTEM.user}
     /  _  \\      HOST: ${SYSTEM.host}
    |  (o)  |     ------------------
     \\  ^  /      OS: ${sys.os}
      \\___/       KERNEL: ${SYSTEM.version}
                  RES: ${sys.res}
                  CPU: ${sys.cores} CORES
                  SHELL: BASH_JS
            `;
            print(art, "text-[#ff003c]");
        }
    },
    'ls': {
        exec: async () => {
            await type("Permitted Files:", "text-gray-500");
            print("readme.txt", "text-[#00FF41]");
        }
    },
    'cat': {
        exec: async (args) => {
            const file = args[0];
            if (!file) return await type("Usage: cat [filename]", "text-yellow-500");
            if (FILE_SYSTEM[file]) {
                await type("DECRYPTING...", "text-[#ff003c]");
                await new Promise(r => setTimeout(r, 500));
                print(FILE_SYSTEM[file], "text-white");
            } else {
                await type(`Error: '${file}' not found.`, "text-red-500");
            }
        }
    },
    'protocol': {
        exec: async (args) => {
            const mode = args[0];
            const root = document.documentElement;

            if (mode === "anarchy") { // Red
                root.style.setProperty('--neon-cyan', '#ff003c');
                root.style.setProperty('--neon-green', '#ff003c');
                await type("PROTOCOL: ANARCHY [ACTIVE]", "text-[#ff003c] font-bold");
            } else if (mode === "midas") { // Gold
                root.style.setProperty('--neon-cyan', '#fbbf24');
                root.style.setProperty('--neon-green', '#fbbf24');
                await type("PROTOCOL: MIDAS [ACTIVE]", "text-[#fbbf24] font-bold");
            } else if (mode === "phantom") { // Default
                root.style.setProperty('--neon-cyan', '#00f3ff');
                root.style.setProperty('--neon-green', '#00FF41');
                await type("PROTOCOL: PHANTOM [RESTORED]", "text-[#00f3ff] font-bold");
            } else {
                await type("Usage: protocol [phantom | anarchy | midas]", "text-gray-500");
            }
        }
    },
    'sudo': {
        exec: async (args) => {

            await type("ELEVATION REQUESTED...", "text-[#ff003c]");
            await new Promise(r => setTimeout(r, 600));

            await type("ERROR: AUTH_TOKEN REQUIRED.", "text-red-500 font-bold");
            await type("RIDDLE:", "text-[#00f3ff]");
            print('"I am not in the body, but I define the soul.');
            print(' I sit at the Head, yet I have no role.');
            print(' Inspect my nature to find the Key."');

            state.isPasswordMode = true;
            inputField.type = "password";
            inputField.placeholder = "Input Access Token...";
            await type(`[sudo] password for ${SYSTEM.user}:`, "text-white mt-2");
        }
    },
    'trace': {
        exec: async () => {
            await type("INITIATING TRACE...", "text-[#ff003c]");
            try {
                const res = await fetch('https://api.ipify.org?format=json');
                const data = await res.json();
                await type(`HOP 1: 10.23.0.1 [ENCRYPTED]`);
                await type(`HOP 2: 192.168.1.55 [RELAY]`);
                await type(`TARGET LOCKED: ${data.ip}`, "text-white bg-red-900/50 px-1 inline-block");
            } catch (e) { await type("TRACE BLOCKED.", "text-red-500"); }
        }
    },
    'clear': {
        exec: () => {
            outputDiv.innerHTML = '';
        }
    }
};


inputField.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const rawInput = inputField.value;
        inputField.value = '';

        if (state.isPasswordMode) {
            if (rawInput === SYSTEM.password) {
                state.isPasswordMode = false;
                inputField.type = "text";
                inputField.placeholder = "Enter command...";
                await type("AUTHENTICATION VERIFIED.", "text-[#00FF41] font-bold");
                await type("DOWNLOADING CLASSIFIED ASSET...", "text-[#00f3ff]");


                const link = document.createElement('a');
                link.href = "assets/Warning.jpg";
                link.download = "Classified_Evidence.jpg";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                await type("ACCESS DENIED. INCIDENT LOGGED.", "text-red-500");
                state.isPasswordMode = false;
                inputField.type = "text";
                inputField.placeholder = "Enter command...";
            }
            return;
        }

        const parts = rawInput.trim().split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (!cmd) return;

        state.commandHistory.push(rawInput);
        state.historyIndex = state.commandHistory.length;

        print(`${SYSTEM.user}@${SYSTEM.host}:~$ ${rawInput}`, "text-gray-500");

        if (COMMANDS[cmd]) await COMMANDS[cmd].exec(args);
        else await type(`bash: ${cmd}: command not found`, "text-red-500");
    }


    if (e.key === 'ArrowUp') {
        if (state.historyIndex > 0) inputField.value = state.commandHistory[--state.historyIndex];
    }
    if (e.key === 'ArrowDown') {
        if (state.historyIndex < state.commandHistory.length - 1) inputField.value = state.commandHistory[++state.historyIndex];
        else { state.historyIndex = state.commandHistory.length; inputField.value = ''; }
    }
});


async function bootSequence() {
    const bootScreen = document.getElementById('boot-screen');
    const bootText = document.getElementById('boot-text');
    if (!bootScreen) return;

    const texts = [
        { t: "INITIALIZING_DAEMON...", c: "text-gray-500" },
        { t: "BYPASSING_FIREWALL_RULES...", c: "text-[#ff003c]" }, // Red
        { t: "INJECTING_PAYLOAD_V9...", c: "text-[#ff003c]" },
        { t: "ESTABLISHING_HANDSHAKE...", c: "text-[#00f3ff]" },   // Cyan
        { t: "ENCRYPTION_KEY_EXCHANGED...", c: "text-[#00FF41]" },   // Green

        // THE FINAL IMPACT LINE
        { t: "ROOT_PRIVILEGES_GRANTED...", c: "text-white font-bold tracking-widest text-lg" }
    ];

    for (let item of texts) {
        const p = document.createElement('div');
        p.className = `font-mono text-sm mb-1 ${item.c} ${item.t.includes('ROOT') ? 'animate-pulse' : ''}`;
        p.innerText = `> ${item.t}`;
        bootText.appendChild(p);
        await new Promise(r => setTimeout(r, Math.random() * 300 + 100));
    }

    setTimeout(() => {
        bootScreen.style.opacity = '0';
        bootScreen.style.pointerEvents = 'none';
    }, 800);
}

window.addEventListener('DOMContentLoaded', () => {
    bootSequence();
    type("ShadowOS Terminal Initialized...", "text-gray-600");
});