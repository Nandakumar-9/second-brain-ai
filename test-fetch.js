const apiKey = 'AIzaSyBhxBuZIrHvt1k1Im-G3lgHQLC0EYs_frA';

async function testGemini() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: 'test' }] }]
        })
    });

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
}

testGemini();
