const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

// Sert les fichiers statiques (index.html)
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

// Endpoint API pour discuter avec l'IA
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: userMessage }],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        const aiReply = response.data.choices[0].message.content;
        res.json({ reply: aiReply });
    } catch (error) {
        console.error('Erreur lors de la requête OpenAI :', error.message);
        res.status(500).json({ reply: "Erreur de l'IA." });
    }
});

// Fallback : pour que / affiche bien index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
