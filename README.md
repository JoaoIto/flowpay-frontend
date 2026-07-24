# FlowPay Dashboard — Frontend UI 🎨

> Interface de usuário em tempo real para o motor de roteamento omnichannel **FlowPay**. Desenvolvida com React, Vite e conectada nativamente ao core via Server-Sent Events (SSE).

O frontend atua como um "Monitor Operacional Vivo", refletindo instantaneamente as decisões matemáticas do backend sem realizar requisições contínuas ao banco de dados, utilizando arquitetura orientada a eventos.

---

## 📌 Sumário Rápido
- **[🔗 Interface Online (Deploy)](#)** `[Em breve/Vercel]`
- **[📖 Swagger do Backend (Online)](https://flowpay-backend-1s3f.onrender.com/swagger-ui/index.html)**
- **[🚀 Como Rodar Localmente](#-como-rodar-localmente)**
- **[📄 Arquitetura do Frontend](docs/frontend-architecture.md)**
- **[🧠 Decisões de Design (ADRs)](docs/decisions.md)**
- **[🗺️ Plano de Implementação](docs/implementation-plan.md)**

---

## ⚡ Stack Tecnológica de Alta Performance

*   **Core:** React 18, TypeScript (Garantia estrita de tipos atrelados aos DTOs do Backend).
*   **Build Tooling:** Vite (Substituindo CRA para HMR instantâneo).
*   **Estilização Premium:** Tailwind CSS v4 (Glassmorphism, dark-mode suporte, e temas dinâmicos via CSS nativo).
*   **Micro-Interações:** Animações baseadas em mudança de estado no DOM (`useRef` + Tailwind `animate-in`), fornecendo visual de "Live Monitor" quando os números atualizam.
*   **Networking:** Conexão reativa via `EventSource` (SSE).

---

## 📡 Comunicação em Tempo Real (SSE)

Para atingir a sensação de "Flow" na tela:
1. O React instancia um singleton `DashboardSseClient`.
2. Uma conexão unidirecional persistente via HTTP é mantida na rota `/api/v1/dashboard/stream`.
3. Cada evento captado do Redis Pub/Sub pisca na tela através do componente `<AnimatedNumber />`, sem necessidade de refresh manual ou polling obsoleto.

---

## 🚀 Como Rodar Localmente

**Pré-requisitos:** Node.js (versão 18+) instalado. Certifique-se de que o backend (Spring Boot) esteja operante.

1.  **Instale as dependências:**
    ```bash
    npm install
    ```
2.  **Variáveis de Ambiente:** Crie o arquivo `.env` baseado em `.env.example` contendo a URL da API do FlowPay.
3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    *A interface ficará disponível em `http://localhost:5173`.*

