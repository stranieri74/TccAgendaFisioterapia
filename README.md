Visão Geral

O TccAgendaFisioterapia é um sistema web desenvolvido para auxiliar clínicas de fisioterapia no gerenciamento de agendamentos, controle de atendimentos e organização da rotina clínica, reduzindo conflitos de horários, falhas manuais e melhorando a eficiência operacional.

O sistema foi desenvolvido como Trabalho de Conclusão de Curso (TCC), utilizando arquitetura moderna com separação entre backend e frontend, seguindo boas práticas de desenvolvimento de software.

🎯 Objetivo do Projeto

O principal objetivo do sistema é:

Facilitar o agendamento de sessões de fisioterapia

Centralizar informações de pacientes e atendimentos

Garantir maior controle, organização e confiabilidade dos dados

Aplicar conceitos de arquitetura em camadas, API REST e desenvolvimento full stack

🧱 Arquitetura Geral

O projeto foi dividido em dois módulos principais:

TccAgendaFisioterapia
│
├── backend/   → API REST responsável pelas regras de negócio e persistência
│
└── frontend/  → Aplicação web responsável pela interface com o usuário


Essa separação permite:

Melhor manutenção do código

Escalabilidade

Reutilização do backend por outros clientes (ex: mobile)

⚙️ Tecnologias Utilizadas
🔹 Backend

Node.js

TypeScript

API REST

ORM para acesso ao banco de dados

Autenticação baseada em token

Arquitetura em camadas (Controller, Service, Repository)

🔹 Frontend

Framework SPA (Angular/React – conforme seu projeto)

TypeScript

HTML5 / CSS3

Comunicação via HTTP com a API

Componentização e separação de responsabilidades

🔹 Banco de Dados

Banco de dados relacional

Estrutura normalizada

Controle de status de registros (ativo, cancelado, etc.)

🔐 Autenticação e Segurança

O sistema possui controle de acesso baseado em autenticação, garantindo que apenas usuários autorizados possam acessar funcionalidades sensíveis.

Principais pontos:

Login com credenciais

Geração de token de autenticação

Validação de permissões por perfil de usuário

Proteção de rotas no backend e frontend

🔄 Fluxo de Funcionamento

Usuário realiza login no sistema

O sistema valida as credenciais no backend

Após autenticado, o usuário acessa a agenda

É possível:

Criar agendamentos

Cancelar sessões

Consultar atendimentos

Todas as ações são validadas no backend antes de serem persistidas

▶️ Como Executar o Projeto
🔹 Backend
# Instalar dependências
npm install

# Executar o projeto
npm run dev

🔹 Frontend
# Instalar dependências
npm install

# Executar o projeto
npm start


⚠️ Certifique-se de configurar corretamente as variáveis de ambiente e o banco de dados antes da execução.

🧪 Testes

O projeto pode ser expandido com testes automatizados, garantindo:

Validação das principais regras de negócio

Confiabilidade da API

Facilidade de manutenção futura

📈 Trabalhos Futuros

Como melhorias futuras, podem ser adicionados:

Módulo de prontuário eletrônico

Notificações automáticas de agendamento

Relatórios gerenciais

Aplicativo mobile integrado à API

🎓 Contexto Acadêmico

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso, aplicando conceitos estudados ao longo da graduação, como:

Engenharia de Software

Programação Orientada a Objetos

Desenvolvimento Web

Banco de Dados

Arquitetura de Sistemas

✍️ Autor

José Oliveira
Curso de [Seu Curso]
Instituição: [Sua Faculdade]
