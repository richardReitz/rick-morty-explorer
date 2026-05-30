# Rick & Morty Explorer

Aplicação web para explorar personagens, episódios e localizações da série Rick and Morty, consumindo a [Rick and Morty API](https://rickandmortyapi.com).

## Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Query** — cache e gerenciamento de estado assíncrono
- **Zustand** — estado global de favoritos (com persistência em localStorage)
- **Axios** — cliente HTTP
- **Vitest + Testing Library** — testes unitários

## Funcionalidades

- Busca por nome com debounce (evita chamadas desnecessárias à API)
- Filtro por categoria (Personagens, Episódios, Localizações)
- Paginação em todas as listagens
- Painel de detalhes ao selecionar um item
- Favoritar personagens, episódios e localizações
- Tema claro/escuro
- Layout totalmente responsivo

## Pré-requisitos

- Node.js 18 ou superior
- npm, yarn, pnpm ou bun

## Como rodar

**1. Clone o repositório e instale as dependências:**

```bash
git clone https://github.com/seu-usuario/rick-morty-explorer.git
cd rick-morty-explorer
npm install
```

**2. Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm start` | Inicia o servidor de produção (requer build) |
| `npm test` | Executa os testes unitários |
| `npm run test:watch` | Executa os testes em modo watch |
| `npm run lint` | Verifica o código com ESLint |

## Estrutura do projeto

```
src/
├── app/                  # Rotas (App Router do Next.js)
│   ├── characters/       # Página de personagens
│   ├── episodes/         # Página de episódios
│   ├── locations/        # Página de localizações
│   └── favorites/        # Página de favoritos
├── components/
│   ├── cards/            # CharacterCard, EpisodeCard, LocationCard
│   ├── layout/           # Header, Footer, Hero, MainLayout
│   ├── lists/            # CharacterList, EpisodeList, LocationList
│   └── ui/               # Componentes reutilizáveis (Button, SearchBar, Pagination, etc.)
└── lib/
    ├── api/              # Funções de acesso à Rick and Morty API
    ├── hooks/            # useDebounce
    ├── store/            # Estado global (favoritos, tema)
    └── types/            # Tipos TypeScript
```
