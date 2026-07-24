# FlowPay Dashboard — Frontend UI

> Interface de usuário em tempo real para o motor de roteamento omnichannel **FlowPay**. Desenvolvida com React, Vite e conectada nativamente ao core via Server-Sent Events (SSE).



O frontend atua como um "Monitor Operacional Vivo", refletindo instantaneamente as decisões matemáticas do backend sem realizar requisições contínuas ao banco de dados, utilizando arquitetura orientada a eventos.



<img src="public\home.png">
---

## Sumário Rápido

* **[Interface Online (Deploy)](https://flowpay-frontend-five.vercel.app/dashboard)**
* **[Swagger do Backend (Online)](https://flowpay-backend-1s3f.onrender.com/swagger-ui/index.html)**
* **[Arquitetura do Frontend](docs/frontend-architecture.md)**
* **[Decisões de Design (ADRs)](docs/decisions.md)**
* **[Plano de Implementação](docs/implementation-plan.md)**
---

## Stack Tecnológica de Alta Performance

* **Core:** React 18, TypeScript (Garantia estrita de tipos atrelados aos DTOs do Backend).
* **Build Tooling:** Vite (Substituindo CRA para HMR instantâneo).
* **Estilização Premium:** Tailwind CSS v4 (Glassmorphism, suporte a dark-mode e temas dinâmicos via CSS nativo).
* **Micro-Interações:** Animações baseadas em mudança de estado no DOM (`useRef` + Tailwind `animate-in`), fornecendo visual de "Live Monitor" quando os números atualizam.
* **Networking:** Conexão reativa via `EventSource` (SSE).

---

## Comunicação em Tempo Real (SSE)

Para atingir a sensação de "Flow" na tela:

1. O React instancia um singleton `DashboardSseClient`.
2. Uma conexão unidirecional persistente via HTTP é mantida na rota `/api/v1/dashboard/stream`.
3. Cada evento captado do Redis Pub/Sub pisca na tela através do componente `<AnimatedNumber />`, sem necessidade de refresh manual ou polling obsoleto.

---

## Integração e Entrega Contínuas (CI/CD)

O projeto conta com pipelines automatizadas configuradas via **GitHub Actions**. A cada *push* ou *pull request* para a branch principal, o repositório executa:

* Configuração de ambiente limpo utilizando Node.js 20.
* Estratégia de cache para dependências do NPM, otimizando o tempo de execução.
* Verificação de integridade e testes automatizados.
* Validação estrita de build (`vite build`), garantindo que erros de tipagem do TypeScript não cheguem à produção.
O deploy final é gerido de forma contínua pela Vercel.

---

## Como Rodar Localmente

**Pré-requisitos:** Node.js (versão 20+) instalado. Certifique-se de que o backend (Spring Boot) esteja operante.

1. **Instale as dependências:**
```bash
npm install

```


2. **Variáveis de Ambiente:** Crie o arquivo `.env` baseado em `.env.example` contendo a URL da API do FlowPay.
3. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev

```


*A interface ficará disponível em `http://localhost:5173`.*

---

