# Gamma Pi Project

This project contains automation tools and content for the **Gamma Pi** fraternity (Phi Iota Alpha).

## 🏛️ PillarFunFacts (Discord Bot)

Located in `PillarFunFacts/`, this is an n8n automation that posts a "Did You Know?" history fact daily to our Discord server.

### Features
*   **Topic Selection**: Randomly picks from the 5 Pillars (Bolivar, San Martin, O'Higgins, Marti, Juarez) or key historical dates (Founding, Merger).
*   **Sources**:
    *   **Seed List**: Hardcoded topics relevant to our history.
    *   **Wikipedia**: Primary source of knowledge.
    *   **AI Enhancement**: Uses Google Gemini to find specific "nuggets" of wisdom rather than generic summaries.
*   **Delivery**: Posts a rich Embed to Discord with an image and a "Relevance" footer.

### 📂 Files
*   `seed_topics.json`: The list of topics (Pillars, History, Concepts) used by the randomizer.
*   `n8n_workflow_v2.json` (**Recommended**): The "Smart" version. Scrapes full HTML and uses Gemini AI to write the post.
*   `n8n_workflow.json` (Legacy): The "Basic" version. Uses Wikipedia's standard summary API (no AI).

### 🚀 Deployment Guide
1.  **Install n8n**: Ensure you have n8n running (Community Edition).
2.  **Import**: Import `PillarFunFacts/n8n_workflow_v2.json` into your n8n dashboard.
3.  **Config**:
    *   **Credentials**: Add your **Google Gemini API Key** to the Gemini node.
    *   **Webhook**: Add your **Discord Webhook URL** to the Discord node.
4.  **Run**: Click "Execute Workflow" to test.

> *Note: If you run into Wikipedia API errors, ensure the `User-Agent` header in the HTTP Request node is set to `GammaPiBot/1.0`.*