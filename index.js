const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/download', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  try {
    const response = await fetch('https://api.cobalt.tools/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ url: url.trim() }),
    });

    const data = await response.json();

    if (data.status === 'redirect' || data.status === 'stream' || data.status === 'tunnel') {
      return res.json({ success: true, videoUrl: data.url });
    }
    if (data.status === 'picker') {
      return res.json({ success: true, videoUrl: data.picker?.[0]?.url });
    }

    return res.json({ success: false, error: data.error?.code || 'Could not process URL' });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
