document.getElementById('scanBtn').addEventListener('click', async () => {
    const urlInput = document.getElementById('urlInput').value;
    const resultBox = document.getElementById('resultBox');
    const statusMsg = document.getElementById('statusMsg');
    const finalReport = document.getElementById('finalReport');

    if(!urlInput) return alert("Please enter a URL!");

    resultBox.classList.remove('hidden');
    statusMsg.innerHTML = `<p class="animate-pulse">Consulting security engines...</p>`;
    finalReport.classList.add('hidden');

    try {
        const response = await fetch('/api/scan', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({url: urlInput})
        });

        const data = await response.json();

        if (data.link) {
            // --- LOGIC FOR VERDICT ---
            let verdict = "";
            let colorClass = "";
            let description = "";

            if (data.malicious === 0) {
                verdict = "SAFE";
                colorClass = "bg-green-500/20 text-green-400 border-green-500";
                description = "No security engines flagged this URL.";
            } else if (data.malicious < 5) {
                verdict = "SUSPICIOUS";
                colorClass = "bg-yellow-500/20 text-yellow-400 border-yellow-500";
                description = "A few engines flagged this. Proceed with caution.";
            } else {
                verdict = "DANGEROUS";
                colorClass = "bg-red-500/20 text-red-400 border-red-500";
                description = "Multiple engines confirmed this as a threat!";
            }

            // --- UPDATE THE INTERFACE ---
            statusMsg.innerHTML = `
                <div class="flex flex-col items-center gap-4 py-4">
                    <div class="px-6 py-2 border-2 rounded-full font-black text-xl ${colorClass}">
                        ${verdict}
                    </div>
                    <p class="text-sm text-gray-400">${description}</p>
                    <div class="w-full h-[1px] bg-gray-700 my-2"></div>
                    <div class="flex justify-around w-full">
                        <div class="text-center">
                            <p class="text-xs text-gray-500">MALICIOUS</p>
                            <p class="text-red-500 font-bold text-lg">${data.malicious}</p>
                        </div>
                        <div class="text-center">
                            <p class="text-xs text-gray-500">SAFE</p>
                            <p class="text-green-500 font-bold text-lg">${data.safe}</p>
                        </div>
                    </div>
                </div>
            `;
            finalReport.classList.remove('hidden');
            finalReport.href = data.link;
        } else {
            statusMsg.innerText = "❌ " + (data.error || "Error analyzing link.");
        }
    } catch (err) {
        statusMsg.innerText = "❌ Connection failed.";
    }
});  

// python app.py to run