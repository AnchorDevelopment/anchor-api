const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');


const app = express();
const port = 3000;

// Middleware to parse query parameters in the request URL
app.use(express.urlencoded({ extended: true }));




// Function to check the status of an API endpoint
async function checkEndpointStatus(endpoint) {
  try {
    const response = await axios.get(`http://localhost:3000${endpoint}`);
    return response.status === 200 ? 'Working' : 'Not Working';
  } catch (error) {
    return 'Not Working';
  }
}




// Route to handle the welcome card request
app.get('/api/image', async (req, res) => {
  const { customImage, name, memberCount, serverName } = req.query;

  // Create a canvas and set its width and height
  const canvas = createCanvas(500, 250); // Increased the canvas size for decorations
  const ctx = canvas.getContext('2d');

  // Draw decorative background
  ctx.fillStyle = '#ff4b4b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (customImage) {
    try {
      // Load the custom background image
      const backgroundImage = await loadImage(customImage);
      ctx.drawImage(backgroundImage, 25, 25, 450, 200);
    } catch (error) {
      console.error('Error loading custom image:', error);
    }
  }

  // Add decorative border
  ctx.strokeStyle = '#ff4b4b';
  ctx.lineWidth = 5;
  ctx.strokeRect(2.5, 2.5, canvas.width - 5, canvas.height - 5);

  if (name) {
    // Set font properties and color for the text
    ctx.font = '36px Arial';
    ctx.fillStyle = '#662E1C';
    ctx.textAlign = 'center';

    // Draw the name placeholder in the center
    ctx.fillText(name, canvas.width / 2, canvas.height / 2 - 30);

    if (serverName) {
      // Set font properties and color for the text
      ctx.font = '24px Arial';
      ctx.fillStyle = '#ff4b4b'; // Red color: #ff4b4b
      ctx.textAlign = 'center';

      // Draw the server name above the name placeholder
      ctx.fillText(`Welcome to ${serverName}' server!`, canvas.width / 2, canvas.height / 2 - 5);
    }
  }

  if (memberCount) {
    // Customize the member count text
    const memberCountText = `We have now ${memberCount} members!`;

    // Set font properties and color for the text
    ctx.font = '18px Arial';
    ctx.fillStyle = '#662E1C';
    ctx.textAlign = 'center';

    // Draw the member count text below the server name
    ctx.fillText(memberCountText, canvas.width / 2, (canvas.height / 2) + 50);
  }

  // Convert the canvas to a buffer
  const buffer = canvas.toBuffer();

  // Set the response headers to return the image
  res.set('Content-Type', 'image/jpeg');
  res.send(buffer);
});



const superheroes = [
  { id: 1, name: 'Superman', power: 'Flight, Super Strength' },
  { id: 2, name: 'Spiderman', power: 'Agility, Web-slinging' },
  { id: 3, name: 'Wonder Woman', power: 'Lasso of Truth, Superhuman abilities' },
];

// Route to get all superheroes
app.get('/api/superheroes', (req, res) => {
  res.json(superheroes);
});

// Route to get a specific superhero by ID
app.get('/api/superheroes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const superhero = superheroes.find(hero => hero.id === id);
  
  if (superhero) {
    res.json(superhero);
  } else {
    res.status(404).json({ message: 'Superhero not found' });
  }
});

///////////

// Sample joke data
let jokes = [
  { id: 1, joke: 'Why did the scarecrow win an award? Because he was outstanding in his field!' },
  { id: 2, joke: 'Why don’t scientists trust atoms? Because they make up everything!' },
];

// Middleware to parse request body as JSON
app.use(express.json());

// Route to get a random joke
app.get('/api/jokes', (req, res) => {
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  res.json(randomJoke);
});

// Route to get all jokes
app.get('/api/jokes/all', (req, res) => {
  res.json(jokes);
});

// Route to add a new joke
app.post('/api/jokes', (req, res) => {
  const { joke } = req.body;

  if (!joke) {
    return res.status(400).json({ message: 'Joke is required' });
  }

  const newJoke = {
    id: jokes.length + 1,
    joke,
  };

  jokes.push(newJoke);
  res.status(201).json(newJoke);
});

//////////

// Sample cat facts data
const catFacts = [
  'Cats have five toes on their front paws and four toes on their back paws.',
  'A group of cats is called a clowder.',
  'Cats sleep for 70% of their lives.',
  'Cats can make over 100 different sounds.',
  'Cats have excellent night vision.',
];

// Route to get a random cat fact
app.get('/api/cat-facts', (req, res) => {
  const randomFact = catFacts[Math.floor(Math.random() * catFacts.length)];
  res.json({ fact: randomFact });
});

// Sample fortune cookie messages
const fortuneCookies = [
  'You will have a wonderful day!',
  'Good fortune will come your way!',
  'An exciting opportunity is coming soon!',
  'Your hard work will pay off!',
  'A new friendship will bring you joy!',
];

// Route to get a random fortune cookie message
app.get('/api/fortune-cookie', (req, res) => {
  const randomMessage = fortuneCookies[Math.floor(Math.random() * fortuneCookies.length)];
  res.json({ message: randomMessage });
});

///////////

// Route to get a random dog picture
app.get('/api/dog-pictures', async (req, res) => {
  try {
    const response = await axios.get('https://dog.ceo/api/breeds/image/random');
    res.json({ image: response.data.message });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dog picture' });
  }
});

// Sample Chuck Norris jokes
const chuckNorrisJokes = [
  'Chuck Norris can divide by zero.',
  'Chuck Norris can slam a revolving door.',
  'When Chuck Norris enters a room, he doesn’t turn the lights on; he turns the dark off.',
  'Chuck Norris can unscramble an egg.',
  'Chuck Norris can speak Braille.',
];

// Route to get a random Chuck Norris joke
app.get('/api/chuck-norris-jokes', (req, res) => {
  const randomJoke = chuckNorrisJokes[Math.floor(Math.random() * chuckNorrisJokes.length)];
  res.json({ joke: randomJoke });
});

/////

app.get('/api/advice', async (req, res) => {
  try {
    const response = await axios.get('https://api.adviceslip.com/advice');
    const adviceData = response.data.slip;
    res.json({ advice: adviceData.advice });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch advice' });
  }
});

/////

const emojis = [
  '😀', '😂', '😍', '🎉', '🐶', '🍕', '🌈', '🚀', '🎵', '💡', '📚',
];

// Route to get a random emoji
app.get('/api/emojis', (req, res) => {
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  res.json({ emoji: randomEmoji });
});

/////

// Route to get a random fact about a specific number
app.get('/api/number-facts/:number', async (req, res) => {
  const number = req.params.number;

  try {
    const response = await axios.get(`http://numbersapi.com/${number}`);
    const fact = response.data;
    res.json({ fact });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch number fact' });
  }
});



///

// Route to show all available APIs and their usage
app.get('/api/', (req, res) => {
  const helpMessage = `
Available APIs:

1. /api/image:
   Usage: GET /api/image?customImage=<imageUrl>&name=<name>&memberCount=<count>&serverName=<serverName>

2. /api/superheroes:
   Usage: GET /api/superheroes

3. /api/superheroes/:id:
   Usage: GET /api/superheroes/:id

4. /api/jokes:
   Usage: GET /api/jokes

5. /api/jokes/all:
   Usage: GET /api/jokes/all

6. /api/jokes:
   Usage: POST /api/jokes
   Payload: { "joke": "Your joke here" }

7. /api/cat-facts:
   Usage: GET /api/cat-facts

8. /api/fortune-cookie:
   Usage: GET /api/fortune-cookie

9. /api/dog-pictures:
   Usage: GET /api/dog-pictures

10. /api/chuck-norris-jokes:
    Usage: GET /api/chuck-norris-jokes

11. /api/advice:
    Usage: GET /api/advice

12. /api/emojis:
    Usage: GET /api/emojis

13. /api/number-facts/:number:
    Usage: GET /api/number-facts/:number

Note: For APIs that require additional parameters, replace <value> with the desired value.
`;

  res.set('Content-Type', 'text/plain');
  res.send(helpMessage);
});



app.get('/api/status', async (req, res) => {
  const endpoints = [
    '/api/image',
    '/api/superheroes',
    '/api/superheroes/1',
    '/api/jokes',
    '/api/jokes/all',
    '/api/cat-facts',
    '/api/fortune-cookie',
    '/api/dog-pictures',
    '/api/chuck-norris-jokes',
    '/api/advice',
    '/api/emojis',
    '/api/number-facts/42', // Replace with any valid number
    // Add more endpoints here if needed
  ];

  const statusResults = await Promise.all(
    endpoints.map(async (endpoint) => {
      const status = await checkEndpointStatus(endpoint);
      return { endpoint, status };
    })
  );

  // Format the status message with numbered lines
  let statusMessage = 'API Status:\n\n';
  statusResults.forEach((result, index) => {
    statusMessage += `${index + 1}. ${result.endpoint}: ${result.status}\n`;
  });

  res.set('Content-Type', 'text/plain');
  res.send(statusMessage);
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
