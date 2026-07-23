import os
from typing import Literal, Optional
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_astradb import AstraDBVectorStore
from langchain_core.documents import Document

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)

# Use 'gemini-embedding-001' as text-embedding-004 is retired
embeddings = GoogleGenerativeAIEmbeddings(
    model="gemini-embedding-001",
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

vectorstore = AstraDBVectorStore(
    embedding=embeddings,
    collection_name="blog_embedding",
    api_endpoint=os.getenv("ASTRA_DB_ENDPOINT"),
    token=os.getenv("ASTRA_DB_TOKEN"),
)


class IndexRequest(BaseModel):
    post_id: str
    title: str
    desc: str


class ChatRequest(BaseModel):
    post_id: str
    title: str
    desc: str
    question: Optional[str] = None
    mode: Literal["summary", "keypoints", "apply", "qa"] = "qa"


@app.post("/index")
def index_blog(req: IndexRequest):
    doc = Document(
        page_content=f"{req.title}\n{req.desc}",
        metadata={"post_id": str(req.post_id), "title": req.title},
    )
    vectorstore.add_documents([doc], ids=[str(req.post_id)])
    return {"status": "indexed", "post_id": req.post_id}


@app.delete("/index/{post_id}")
def delete_blog_index(post_id: str):
    try:
        vectorstore.delete(ids=[post_id])
        return {"status": "deleted", "post_id": post_id}
    except Exception as e:
        return {"status": "error", "post_id": post_id, "error": str(e)}


@app.post("/chat")
def chat(req: ChatRequest):
    blog_text = f"Title: {req.title}\n\nContent: {req.desc}"

    prompts = {
        "summary": f"Summarize this blog in 3-4 sentences.\n\n{blog_text}",
        "keypoints": f"List the key points of this blog as a short bullet list.\n\n{blog_text}",
        "apply": f"Give 3-5 practical ways a reader could apply this blog in their life or work.\n\n{blog_text}",
        "qa": f"Answer the question using only the blog below. Be concise.\n\nBlog:\n{blog_text}\n\nQuestion: {req.question}",
    }

    prompt = prompts.get(req.mode, prompts["qa"])
    answer = llm.invoke(prompt).content

    search_query = req.question if (req.mode == "qa" and req.question) else req.title

    suggest = None
    results = vectorstore.similarity_search(search_query, k=3)
    for r in results:
        if str(r.metadata.get("post_id")) != str(req.post_id):
            suggest = {"id": r.metadata["post_id"], "title": r.metadata["title"]}
            break

    return {"answer": answer, "suggested_blog": suggest}


@app.get("/")
def health():
    return {"status": "running"}