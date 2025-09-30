const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // later change to https://yourdomain.com
  })
);
// Enable CORS for all routes

// In-memory data storage
let notes = [
  { id: 1, content: "HTML is easy", important: true },
  { id: 2, content: "Browser can execute only JavaScript", important: false },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

// Root route
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

// Get all notes
app.get("/api/notes", (request, response) => {
  response.json(notes);
});

// Get single note
app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id); // FIX: convert string → number
  const note = notes.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

// Delete note
app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id); // FIX: convert string → number
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

// Helper function for ID generation
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1; // no need to stringify, keep IDs as numbers
};

// Add new note
app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
