# Plataforma de Cursos - Front-end

Este é o front-end em React para a Plataforma de Cursos, que consome a API de cursos e permite ao usuário se cadastrar, fazer login, visualizar cursos, se inscrever, cancelar inscrição e gerenciar suas inscrições.

## Tecnologias e Linguagens Utilizadas

- **JavaScript (ES6+)** — Linguagem principal do projeto, com sintaxe moderna.
- **React** — Biblioteca para construção de interfaces de usuário reativas e componentizadas.
- **Vite** — Ferramenta de build e desenvolvimento rápido para projetos front-end modernos.
- **Axios** — Cliente HTTP para consumo dos endpoints da API.
- **React Router DOM** — Gerenciamento de rotas e navegação SPA.
- **CSS** — Estilização dos componentes e páginas.

## Observações

- O front depende de um backend compatível (veja os endpoints esperados no início deste README).
- O JWT é decodificado manualmente no front para obter o id do usuário.
- O cookie JWT é usado para autenticação nas requisições protegidas.

## Endpoints esperados

- `POST /usuarios` — Cadastro de usuário
- `POST /login` — Login (retorna JWT no corpo e no cookie)
- `GET /cursos?filtro=` — Listagem de cursos (com filtro)
- `POST /cursos/:idCurso` — Inscrição em curso
- `PATCH /cursos/:idCurso` — Cancelamento de inscrição
- `GET /:idUsuario` — Listar cursos inscritos do usuário

