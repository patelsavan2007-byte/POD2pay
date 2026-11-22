# POD2Pay — Project Roadmap
### Homingo Hack Days 2026 | A2: The Full-Stack AI Firm

---

## 🎯 Project Goal

Build an AI-powered back-office company for small transporters that autonomously
handles the entire workflow from proof of delivery to payment collection —
replacing a human accounts + recovery team with 5 coordinated AI agents.

**We are not building an AI tool. We are building an AI firm.**

---

## 📦 What "Finished" Looks Like

A transporter can:
1. Upload LR + POD + Invoice + Payment record (PDF or image)
2. See all documents auto-read and data extracted
3. Get a reconciliation report showing exactly what is paid vs outstanding
4. Read an AI-generated dispute investigation (why is money missing?)
5. Approve and send a recovery letter — drafted by AI, sent by human

---

## 🗓️ 16-Day Build Plan

### Weekend 1 (Nov 21–23): Foundation
- [ ] GitHub repo live with README
- [ ] FastAPI backend skeleton running locally
- [ ] React frontend scaffold with basic upload UI
- [ ] Anthropic API connected — one successful agent call
- [ ] PDF parser working on a sample LR document

### Week 1 (Nov 24–28): Core Agents
- [ ] Document Agent: extract fields from LR, POD, Invoice
- [ ] Verification Agent: match delivery details to order
- [ ] Billing Agent: compare invoice vs agreed freight
- [ ] Basic database schema (trips, invoices, payments)
- [ ] API endpoints for document upload and agent trigger

### Weekend 2 (Nov 29–30): Payment + Recovery Agents
- [ ] Payment Agent: detect outstanding amount, identify deduction reason
- [ ] Recovery Agent: draft dispute letter with evidence citations
- [ ] End-to-end pipeline working (upload → all 5 agents → output)
- [ ] Dashboard showing trip status, outstanding amounts

### Week 2 (Dec 1–4): Polish + Demo Prep
- [ ] Confidence scoring on agent outputs
- [ ] Error handling for bad/incomplete documents
- [ ] Clean UI for human approval step (review + send)
- [ ] Sample demo data: 3 realistic trip scenarios
- [ ] README and documentation complete

### Final Weekend (Dec 5–6): Submission
- [ ] Full demo walkthrough recorded or rehearsed
- [ ] Edge cases tested (partial payment, wrong deduction, correct payment)
- [ ] Code cleaned, secrets removed, .env.example committed
- [ ] Submission form filled on hackathon.homingo.co.in

---

## 🏗️ System Architecture

```
Frontend (React)
    ↓ upload documents
Backend (FastAPI)
    ↓ parse PDF/image
Agent Orchestrator (LangGraph)
    ├── Document Agent     (Claude API)
    ├── Verification Agent (Claude API)
    ├── Billing Agent      (Claude API)
    ├── Payment Agent      (Claude API)
    └── Recovery Agent     (Claude API)
    ↓
Database (PostgreSQL)
    ↓
Dashboard + Approval UI (React)
```

---

## ✅ Key Success Criteria for Judges

| Criteria | Our Approach |
|---|---|
| Full-stack AI firm (not just a tool) | 5 agents replace an entire back-office department |
| Real-world applicability | 1.2 crore+ small truckers in India with this exact problem |
| End-to-end automation | From document upload to recovery letter, zero manual steps |
| Human-in-the-loop | Final approval before sending — responsible AI design |
| Technical depth | Multi-agent orchestration, OCR, structured data extraction |
