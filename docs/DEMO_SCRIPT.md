# Demo Video Script — 3 to 5 Minutes

## Structure

---

### 🎬 0:00–0:45 — Problem Introduction (45 seconds)

**[SCREEN: Landing page]**

> "Hi, I'm [Name], and this is the AI Document Intelligence Assistant.
>
> Every day, students, researchers, and professionals spend hours reading through long documents — reports, research papers, business documents — trying to extract the information they need.
>
> What if you could just upload a document and have AI help you understand it? Ask questions, get summaries, extract key data — all running locally on your machine, completely free and private.
>
> That's exactly what this project does."

---

### 🖥 0:45–1:30 — Product Overview (45 seconds)

**[SCREEN: Navigate through Landing Page → Dashboard]**

> "Let me show you around.
>
> The landing page explains the product and its features. Moving to the dashboard — you can see document stats, recent uploads, and manage your library.
>
> The tech stack includes React with Tailwind CSS on the frontend, FastAPI on the backend, and a full RAG pipeline using Ollama with Llama 3.1, ChromaDB for vector storage, and sentence-transformers for embeddings.
>
> Everything runs 100% locally — no API keys, no paid services, complete privacy."

---

### 📤 1:30–2:00 — Upload Document (30 seconds)

**[SCREEN: Upload page]**

> "Let me upload a sample business report.
>
> [Upload the sample_report.txt from sample_data/]
>
> The drag-and-drop interface validates the file type and size, then processes it — extracting text, chunking it, generating embeddings, and storing everything in ChromaDB.
>
> The whole process takes just a few seconds."

---

### 🤖 2:00–2:45 — AI Chat Demonstration (45 seconds)

**[SCREEN: Document Workspace → AI Chat tab]**

> "Now the exciting part — chatting with the document.
>
> [Type: 'What was the total revenue in Q2?']
>
> The AI uses RAG — Retrieval-Augmented Generation — to find the most relevant chunks from the document, then generates an answer with source references.
>
> [Show the answer]
>
> Let's try another question:
>
> [Type: 'Who are the key people mentioned?']
>
> Notice how it provides specific names and roles from the document. And if I ask something not in the document:
>
> [Type: 'What is the company's stock price?']
>
> It correctly says the information isn't available — preventing hallucination."

---

### 📊 2:45–3:15 — Summary & Extraction (30 seconds)

**[SCREEN: Summary tab → Extraction tab]**

> "The summary feature generates an executive overview, key points, and action items with one click.
>
> [Click Generate Summary]
>
> [Show the populated summary]
>
> The extraction feature pulls out structured data — names, dates, organizations, numbers, tasks, and deadlines.
>
> [Click Extract Information]
>
> [Show the extraction cards]
>
> And you can export everything — summaries as PDF, extraction data as JSON."

---

### ⚙️ 3:15–4:00 — Technical Architecture (45 seconds)

**[SCREEN: Architecture diagram or slide]**

> "Behind the scenes, the architecture follows a clean three-tier design.
>
> The React frontend communicates with the FastAPI backend via REST API.
>
> When a document is uploaded, it goes through a pipeline: text extraction using PyMuPDF or python-docx, cleaning, chunking with LangChain, embedding with sentence-transformers, and storage in ChromaDB.
>
> For chat, the user's query is embedded, similar chunks are retrieved, and the context is sent to Ollama with a carefully designed prompt to prevent hallucination.
>
> The whole system is containerized with Docker Compose for easy deployment."

---

### 🔮 4:00–4:30 — Future Improvements (30 seconds)

> "For future improvements, I'd love to add:
>
> - User authentication for multi-user support
> - Batch document processing
> - OCR for scanned documents and images
> - Real-time streaming of LLM responses
> - A mobile app
>
> This project demonstrates a solid foundation in AI engineering, full-stack development, and system design — all built as a free, open-source tool that anyone can run."

---

### 🎬 4:30–4:45 — Closing (15 seconds)

> "Thank you for watching. The AI Document Intelligence Assistant — your intelligent partner for understanding documents.
>
> Built for the InventaCore AI Intern Build Challenge 2026."

---

## Recording Tips

1. **Use screen recording** — OBS Studio (free) or built-in OS recorder
2. **Speak clearly and at moderate pace**
3. **Show, don't just tell** — Let actions complete before narrating
4. **Keep the terminal visible** briefly to show Ollama processing
5. **Export a PDF and JSON** to demonstrate end-to-end functionality
6. **Total target: 3–5 minutes**
