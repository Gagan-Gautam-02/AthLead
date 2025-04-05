const API_KEY = "AIzaSyDSl8QeTEVp--0x93-veyEtDnBHHtPnV3k"; // Replace with your actual Gemini API key

// Chart Setup
const ctx1 = document.getElementById('myChart').getContext('2d');
const ctx2 = document.getElementById('myChart2').getContext('2d');

const ballsPlayed = [5, 6, 4, 7, 4, 6, 7, 6, 6, 7, 5, 5, 6, 4, 6, 6, 7, 5, 7, 4, 5, 6, 6, 4, 6, 6, 5, 5, 5, 7, 6, 6, 5, 6, 4, 7, 4, 5, 5, 4, 6, 4, 6, 6, 5, 6, 4, 5, 6, 5];
const runsScored = [9, 10, 7, 11, 6, 10, 11, 9, 9, 9, 8, 7, 7, 4, 7, 6, 7, 4, 6, 3, 5, 5, 4, 3, 4, 4, 3, 3, 3, 4, 3, 3, 2, 2, 2, 2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2, 1, 1, 1, 1];
const labels = ballsPlayed.map((_, i) => `Over ${i + 1}`);

// Chart 1
new Chart(ctx1, {
  type: 'bar',
  data: {
    labels,
    datasets: [
      {
        label: 'Balls Played',
        data: ballsPlayed,
        type: 'line',
        borderColor: '#ff6384',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderWidth: 2,
        yAxisID: 'y'
      },
      {
        label: 'Runs Scored',
        data: runsScored,
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderColor: '#4bc0c0',
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
        beginAtZero: true,
        title: { display: true, text: 'Balls & Runs', color: '#aaa' },
        ticks: { color: '#aaa' }
      },
      x: { ticks: { color: '#aaa' } }
    }
  }
});

// Chart 2
new Chart(ctx2, {
  type: 'line',
  data: {
    labels,
    datasets: [{
      label: 'Runs Over Time',
      data: runsScored,
      fill: false,
      borderColor: '#03dac6',
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#aaa' },
        title: { display: true, text: 'Runs', color: '#aaa' }
      },
      x: { ticks: { color: '#aaa' } }
    }
  }
});

// Gemini AI Analysis
async function analyzeGraphData(balls, runs) {
  const prompt = `
Analyze the following cricket practice overs for a 20-year-old male athlete weighing 50kg:
- Balls played per over: ${JSON.stringify(balls)}
- Runs scored per over: ${JSON.stringify(runs)}
- This is for one match.

Suggest:
1. Performance patterns & consistency
2. Batting improvements based on balls-to-runs ratio
3. Weekly cricket-specific fitness + diet plan
4. Injury prevention tips
5. Other improvement tips
6. Equipment needed for training and play
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

    if (!response.ok) throw new Error("API error");

    const result = await response.json();
    const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text || "No meaningful response.";

    document.getElementById('analysis').innerHTML = aiText
      .replace(/\*\*(.*?)\*\*/g, '<h3>$1</h3>')
      .replace(/\*(.*?)\*/g, '<p>$1</p>')
      .replace(/\n/g, '<br>');

  } catch (error) {
    console.error("AI analysis error:", error);
    document.getElementById('analysis').innerText = "Failed to load AI analysis.";
  }
}

// Popup controls
function openPopup() {
  document.getElementById('aiPopup').classList.add('open');
}
function closePopup() {
  document.getElementById('aiPopup').classList.remove('open');
}

// Start AI analysis
analyzeGraphData(ballsPlayed, runsScored);
