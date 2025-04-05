const API_KEY = "AIzaSyDSl8QeTEVp--0x93-veyEtDnBHHtPnV3k";// Replace with your actual key

const ctx = document.getElementById('myChart').getContext('2d');

// Dummy cricket data
const ballsPlayed = [5, 6, 4, 7, 4, 6, 7, 6, 6, 7, 5, 5, 6, 4, 6, 6, 7, 5, 7, 4, 5, 6, 6, 4, 6, 6, 5, 5, 5, 7, 6, 6, 5, 6, 4, 7, 4, 5, 5, 4, 6, 4, 6, 6, 5, 6, 4, 5, 6, 5]
; // Random 4–7 balls
const runsScored = [9, 10, 7, 11, 6, 10, 11, 9, 9, 9, 8, 7, 7, 4, 7, 6, 7, 4, 6, 3, 5, 5, 4, 3, 4, 4, 3, 3, 3, 4, 3, 3, 2, 2, 2, 2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2, 1, 1, 1, 1]
;   // Runs 0.8x to 2.3x

const labels = Array.from({ length: ballsPlayed.length }, (_, i) => `Over ${i + 1}`);

// Chart showing balls (line) and runs (bar)
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Balls Played',
                data: ballsPlayed,
                type: 'line',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                yAxisID: 'y'
            },
            {
                label: 'Runs Scored',
                data: runsScored,
                type: 'bar',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
                yAxisID: 'y'
            }
        ]
    },
    options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        stacked: false,
        scales: {
            y: {
                type: 'linear',
                position: 'left',
                title: { display: true, text: 'Balls & Runs' }
            }
        }
    }
});

// Gemini Analysis
async function analyzeGraphData(balls, runs) {
    const prompt = `
    Analyze the following cricket practice overs for a 20-year-old male athlete weighing 50kg:
    - Balls played per over: ${JSON.stringify(balls)}
    - Runs scored per over: ${JSON.stringify(runs)}
    - This is for one match

    Suggest:
    1. Patterns in performance and consistency.
    2. Batting technique improvements based on balls-to-runs ratio.
    3. A weekly cricket-specific fitness + diet plan to increase scoring efficiency.
    4. Injury prevention tips based on the data.
    5. Any other relevant suggestions for improvement.
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        console.log("AI Response:", result);

        const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text || "No meaningful response";

        document.getElementById('analysis').innerHTML = aiText
            .replace(/\*\*(.*?)\*\*/g, '<h3>$1</h3>')
            .replace(/\*(.*?)\*/g, '<p>$1</p>')
            .replace(/\n/g, '<br>');

    } catch (error) {
        console.error("Error fetching AI response:", error);
        document.getElementById('analysis').innerText = "Failed to fetch AI analysis.";
    }
}

// Run the AI analysis
analyzeGraphData(ballsPlayed, runsScored);
