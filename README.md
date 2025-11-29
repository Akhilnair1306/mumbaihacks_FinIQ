# FINIQ 🧠💰
### Your Financial Sixth Sense

<p align="center">
  <strong>Empowering intelligent financial decisions through Agentic AI</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MumbaiHacks-2025-blue?style=for-the-badge" alt="MumbaiHacks 2025"/>
  <img src="https://img.shields.io/badge/Track-Fintech-green?style=for-the-badge" alt="Fintech Track"/>
  <img src="https://img.shields.io/badge/AI-Agentic-purple?style=for-the-badge" alt="Agentic AI"/>
</p>

---

## 🎯 Overview

FINIQ is an intelligent financial assistant powered by Agentic AI that acts as your "sixth sense" for making smarter financial decisions. Built for MumbaiHacks 2025, FINIQ leverages autonomous AI agents to analyze, predict, and recommend personalized financial strategies in real-time.

Unlike traditional financial tools that simply display data, FINIQ actively thinks, adapts, and acts independently to provide proactive financial guidance tailored to your unique situation.

---

## 🔍 Problem Statement

In today's complex financial landscape, individuals face several critical challenges:

- **Information Overload**: Too much financial data, too little actionable insight
- **Reactive Decision Making**: People only check finances when problems arise
- **Lack of Personalization**: One-size-fits-all financial advice doesn't work
- **Manual Data Entry**: Time-consuming bill and expense tracking
- **Complexity Barrier**: Financial jargon and tools intimidate average users
- **Time Constraints**: Managing finances requires constant attention and expertise

**The Result**: Poor financial decisions, missed opportunities, and financial stress affecting millions.

---

## 💡 Solution

FINIQ transforms financial management through Agentic AI that:

1. **Proactively Monitors** your financial health with daily, weekly, and monthly analysis
2. **Intelligently Analyzes** spending patterns, income streams, and trends
3. **Autonomously Recommends** personalized actions based on your goals
4. **Automates Data Entry** through Bill OCR and CSV scanning capabilities
5. **Simplifies Complexity** through natural conversation and intuitive insights

---

## ✨ Key Features

### 📊 Smart Analysis
- **Daily Analysis**: Get daily insights on your spending and financial health
- **Weekly Analysis**: Comprehensive weekly reports with trend identification
- **Monthly Analysis**: In-depth monthly financial reviews and goal tracking

### 📄 Automated Data Processing
- **Bill OCR**: Extract data from bill images automatically using advanced OCR
- **CSV Scanner**: Import and analyze transaction data from CSV files seamlessly
- **Smart Categorization**: AI-powered automatic expense categorization

### 🤖 Agentic AI Intelligence
- Autonomous financial agents that think and act independently
- Context-aware responses based on your financial history
- Self-learning algorithms that improve with usage

### 💬 Conversational Finance
- Natural language interaction for financial queries
- Instant answers to complex financial questions
- Personalized recommendations through AI chat

### 🎯 Personalized Insights
- Goal-based financial planning
- Customized budget recommendations
- Spending pattern analysis and optimization suggestions

### 🔒 Privacy-First Design
- Secure data handling and encryption
- Local processing options for sensitive information
- Transparent AI decision-making

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React with Vite
- **Styling**: TailwindCSS / CSS Modules
- **State Management**: React Context / Zustand
- **Charts**: Recharts / Chart.js
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB / PostgreSQL / SQLite
- **Authentication**: JWT
- **File Processing**: Python-PIL, pdf2image
- **OCR Engine**: Tesseract / EasyOCR / Google Vision API
- **CSV Processing**: Pandas

### AI & ML
- **LLM Integration**: Claude API / OpenAI GPT
- **Agent Framework**: LangChain / Custom Agents
- **Data Analysis**: Pandas, NumPy
- **NLP**: spaCy / NLTK

### Deployment
- **Containerization**: Docker
- **Cloud**: AWS / Azure / Vercel
- **API Documentation**: FastAPI Auto-generated Swagger UI

---

## 🚀 Installation

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- pip or uv package manager
- API Keys: Claude API or OpenAI API

### Clone the Repository
```bash
git clone https://github.com/Akhilnair1306/mumbaihacks_FinIQ.git
cd mumbaihacks_FinIQ
```

### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run the FastAPI server
uvicorn main:app --reload
```

The backend will start at `http://localhost:8000`

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

The frontend will start at `http://localhost:5173`

---

## 📖 Usage

### Getting Started

1. **Sign Up / Login**: Create your FINIQ account

2. **Upload Your Data**: 
   - Take a photo of your bills - FINIQ will extract all details automatically
   - Upload CSV files from your bank for instant analysis

3. **View Analysis**:
   - Check your daily spending summary
   - Review weekly trends and patterns
   - Analyze monthly reports and goal progress

4. **Chat with FINIQ**: Ask questions about your finances in natural language

### Example Features

**Bill OCR:**
```
📸 Take a photo of any bill → FINIQ extracts:
   - Vendor name
   - Amount
   - Date
   - Category
   - Payment details
```

**CSV Import:**
```
📂 Upload bank statement CSV → FINIQ analyzes:
   - All transactions categorized
   - Spending patterns identified
   - Insights and recommendations generated
```

**AI Conversations:**
```
You: "How much did I spend on food this week?"
FINIQ: "You spent ₹2,450 on food this week, which is 15% higher 
        than your average. Most of it (₹1,800) was on dining out. 
        Would you like tips to reduce this?"
```

---

## 📸 Screenshots

<img width="1450" height="778" alt="Screenshot 2025-11-29 105108" src="https://github.com/user-attachments/assets/07727e54-f990-4468-b8e7-60bab5cb575f" />
0"/>

<img width="1910" height="973" alt="Screenshot 2025-11-29 103327" src="https://github.com/user-attachments/assets/cc3183a0-fbfd-4984-a90c-7354e4f3f413" />

<img width="1919" height="964" alt="Screenshot 2025-11-29 103228" src="https://github.com/user-attachments/assets/034d51eb-9727-4d02-9158-e5ba7ab32424" />

<img width="1916" height="971" alt="Screenshot 2025-11-29 103253" src="https://github.com/user-attachments/assets/0bef19cf-f4b9-4957-adbf-93bdcdcf049c" />

---

## 🎖️ Hackathon Details

**Event**: MumbaiHacks 2025  
**Track**: Fintech  
**Theme**: Agentic AI for Financial Innovation  
**Date**: November 28-29, 2025  
**Venue**: NESCO Mumbai

---

## 🏆 What We Built

### Core Functionalities

1. **Intelligent Analysis Engine**
   - Daily financial health monitoring
   - Weekly trend identification
   - Monthly comprehensive reports

2. **Automated Data Entry**
   - Bill OCR for instant bill digitization
   - CSV scanner for bulk transaction import
   - Smart categorization engine

3. **Agentic AI Assistant**
   - Natural language financial queries
   - Proactive recommendations
   - Context-aware insights

### Technical Highlights

- Built with modern FastAPI backend for high performance
- Responsive React + Vite frontend for seamless UX
- Advanced OCR integration for bill processing
- Pandas-powered CSV analysis engine
- Claude AI integration for intelligent conversations

---

## 🚧 Future Roadmap

- [ ] Mobile app development (React Native)
- [ ] Multi-currency support
- [ ] Investment tracking and recommendations
- [ ] Bill payment reminders and automation
- [ ] Receipt storage and management
- [ ] Tax calculation assistance
- [ ] Financial goal setting with milestones
- [ ] Integration with UPI and banking APIs



---

## 🙏 Acknowledgments

- **MumbaiHacks 2025** for organizing this incredible hackathon
- **TEAM (Tech Entrepreneurs Association of Mumbai)** for the platform

---

## 📞 Contact

For queries, collaborations, or feedback:

- **GitHub**: [Akhilnair1306](https://github.com/Akhilnair1306)
- **Project Repository**: [mumbaihacks_FinIQ](https://github.com/Akhilnair1306/mumbaihacks_FinIQ)
- **Email**: [akhilnair1306@gmail.com]


---

<p align="center">
  <strong>Built with 💙 for MumbaiHacks 2025</strong>
</p>

<p align="center">
  <i>Making financial intelligence accessible to everyone</i>
</p>

---

## ⭐ Show Your Support

If you found FINIQ helpful or interesting, please consider:
- ⭐ Starring this repository
- 🍴 Forking and contributing
- 📢 Sharing with your network
- 💬 Providing feedback through issues

**Together, let's democratize financial intelligence! 🚀**
