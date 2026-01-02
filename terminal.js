document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    const warningModal = document.getElementById('warning-modal');

    // Startup Sequence
    const bootSequence = [
        { text: "[SYSTEM] Initializing ShadowBorne Kernel v6.0...", color: "text-[#00f3ff]" },
        { text: "[NET] Connecting to Tor Network...", color: "text-gray-500" },
        { text: "   > Entry Node: 192.168.X.X [OK]", color: "text-gray-600" },
        { text: "   > Relay Node: 10.0.X.X [OK]", color: "text-gray-600" },
        { text: "   > Exit Node: 89.23.X.X (Netherlands) [OK]", color: "text-[#ff003c]" },
        { text: "[AUTH] Identity Verified: ShadowBorne", color: "text-[#00FF41]" },
        { text: "System ready. Type 'help' for modules.", color: "text-white mt-4" },
        { text: "HINT: The truth lies in the 'meta' pixels. Use `steghide`.", color: "text-gray-600 italic text-xs" }
    ];

    let delay = 0;
    bootSequence.forEach(line => {
        setTimeout(() => {
            const p = document.createElement('p');
            p.className = line.color;
            p.innerText = line.text;
            output.appendChild(p);
            output.scrollTop = output.scrollHeight;
        }, delay);
        delay += 300;
    });

    // Commands
    const commands = {
        'help': 'CMD: [whoami, status, social, clear, sudo <key>]',
        'whoami': 'UID: 0 (root) | GID: 0 (root)\nEntity: ShadowBorne',
        'status': 'System Integrity: 100%\nEncryption: AES-256 (GCM)\nTrace: BLOCKED',
        'social': 'GitHub: [REDACTED]\nTwitter: [REDACTED]\nEmail: Shad0wB0rne@proton.me',
        'clear': 'CLEAR'
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const fullCmd = input.value.trim();
            const cmd = fullCmd.toLowerCase().split(' ')[0];

            const userLine = document.createElement('div');
            userLine.className = "mb-1";
            userLine.innerHTML = `<span class="text-[#ff003c] font-bold">➜</span> <span class="text-gray-300">${fullCmd}</span>`;
            output.appendChild(userLine);

            if (cmd === 'clear') {
                output.innerHTML = '';
            } 
            else if (cmd === 'sudo') {
                const pass = fullCmd.split(' ')[1];
                const realPass = document.querySelector('meta[name="access-token"]').content;
                
                if (pass === realPass) {
                    typewriterEffect("[!] ROOT ACCESS GRANTED. DECRYPTING PAYLOAD...", "text-[#00FF41] font-bold");
                    setTimeout(() => {
                        warningModal.classList.remove('hidden');
                        typewriterEffect(">> ARTIFACT DISPLAYED. CHECK MODAL.", "text-yellow-400");
                    }, 1000);
                } else {
                    typewriterEffect("[X] INCORRECT KEY. INCIDENT LOGGED.", "text-red-600 font-bold");
                }
            } 
            else if (commands[cmd]) {
                typewriterEffect(commands[cmd], "text-[#00f3ff] whitespace-pre-wrap");
            } 
            else {
                typewriterEffect(`Err: '${cmd}' unknown.`, "text-gray-600");
            }

            input.value = '';
            output.scrollTop = output.scrollHeight;
        }
    });

    function typewriterEffect(text, className) {
        const p = document.createElement('p');
        p.className = `mb-1 ${className}`;
        p.innerHTML = text;
        output.appendChild(p);
    }
});