# Arquitetura e Decisões do Frontend

## 1. Stack Tecnológico
- **React + Vite**: Escolhidos pela rapidez no build e desenvolvimento (HMR rápido).
- **TypeScript**: Para garantir a tipagem do payload, evitando erros em tempo de compilação, como o bug corrigido na requisição de edição do Agente.
- **Zustand**: Para gerenciar o estado global de `logsStore`, mantendo a reatividade dos logs do sistema em todas as views sem o boilerplate excessivo do Redux.
- **Tailwind CSS**: Estilização adotada por permitir alinhar a UI perfeitamente ao tema "Clean Corporate Light" da Ubots sem escrever arquivos CSS extensos.

## 2. Decisões de UI/UX
- **Identidade Visual**: Aplicamos as cores oficias (Off-white `bg-[#FAF7F2]`, Sidebar `bg-[#F2EDE1]` e Amarelo Dourado `text-amber-500` / `bg-[#FFC700]`).
- **Feedback Constante**: Toast notifications (`react-hot-toast`) em todas as operações CRUD e simulações para garantir visibilidade do retorno do back-end.
- **Painel de Logs (Logs da API)**: Implementado como uma página unificada e como um card no dashboard para expor claramente o que está trafegando (INFO, SUCCESS, ERROR) entre o frontend e backend. Essencial para acompanhamento sem acessar o devtools.
- **Simulador Interativo**: O `Simulator.tsx` mantém um array de histórico das simulações locais, tornando visível na UI as respostas do motor de roteamento do back-end.

## 3. Preparação para Deploy
- **Variáveis de Ambiente**: A API URL agora é carregada através de `import.meta.env.VITE_API_URL` ao invés de hardcode local. Isso garante que ao rodar na Vercel o request aponte adequadamente para o back-end em nuvem.
- **Tipagens Estritas**: Resolvidos todos os TS Errors e implicit 'any' types (`npm run build` passa de forma integral) para prevenir interrupções de build e CI/CD.
