# POD2Pay 🚛
### Proof of Delivery to Payment — AI-Powered Back-Office for Small Transporters

> **Homingo Hack Days 2026 | Track: A2 – The Full-Stack AI Firm**
> Build Phase: 21 Nov 2026 → 6 Dec 2026

---

## 💡 One Line

> Upload your delivery documents — POD2Pay's AI agents handle reconciliation,
> investigate disputes, and draft recovery letters so transporters get paid
> without chasing paperwork.

---

## 🎯 Problem

Small transport companies (1–20 trucks) lose 15–20% of monthly revenue to:
- Untracked payment deductions by customers
- Manual invoice errors from Excel-based workflows
- Slow or failed payment follow-ups via WhatsApp/calls
- No capacity to dispute wrongful deductions legally

They manage everything manually. No accounts team. No legal support.

---

## ✅ Our Solution

**Upload 3 documents → 5 AI agents do the entire back-office job.**

| Document Input | Purpose |
|---|---|
| LR — Lorry Receipt | Goods + transport details |
| POD — Proof of Delivery | Delivery confirmation + timestamp |
| Invoice | Amount owed by customer |
| Payment Record | What was actually received |

---

## 🤖 AI Agent Pipeline

```
Transporter uploads documents
        ↓
[Document Agent]    → Reads LR, POD, Invoice, Payment records
        ↓
[Verification Agent] → Confirms delivery details match the original order
        ↓
[Billing Agent]     → Validates invoice vs agreed freight charges
        ↓
[Payment Agent]     → Detects outstanding amount + likely deduction reason
        ↓
[Recovery Agent]    → Drafts formal dispute letter + payment recovery email
        ↓
Human reviews → Approves → Sends
```

---

## 🛠️ AI Tools, Models & Libraries Used

| Tool / Library | Purpose |
|---|---|
| Claude claude-sonnet-4-6 (Anthropic API) | Core reasoning for all 5 agents |
| LangGraph | Multi-agent orchestration and state management |
| PyMuPDF / pdfplumber | PDF document parsing |
| Tesseract OCR | Text extraction from scanned POD images |
| FastAPI | Backend API server |
| React + TailwindCSS | Frontend dashboard |
| PostgreSQL | Trip, invoice and payment data storage |

---

## 👥 Team

| Name | GitHub | Role |
|---|---|---|
| Savan Patel | [patelsavan2007-byte](https://github.com/patelsavan2007-byte) | Full-stack + AI agents |
| Tirth Savsani | [tirth266](https://github.com/tirth266) | Backend + document pipeline |

---

## 🏁 Hackathon Info

**Event:** Homingo Hack Days 2026
**Track:** A2 – The Full-Stack AI Firm
**Partner code (Olostep):** HMNG5KL
