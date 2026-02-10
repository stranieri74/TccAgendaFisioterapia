📅 TccAgendaFisioterapia
📌 Visão Geral

O TccAgendaFisioterapia é um sistema web desenvolvido com o objetivo de auxiliar clínicas de fisioterapia no gerenciamento de agendamentos e no controle dos atendimentos do dia a dia.
A proposta do sistema é organizar a rotina clínica, reduzir conflitos de horários e diminuir erros causados por controles manuais, tornando o processo mais ágil e confiável.

O projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC), utilizando uma arquitetura moderna, com separação entre backend e frontend, aplicação de boas práticas de desenvolvimento, testes automatizados e uso de Docker para padronização do ambiente.

🎯 Objetivos do Projeto

O desenvolvimento do sistema teve como principais objetivos:
Facilitar o agendamento de sessões de fisioterapia
Centralizar as informações de pacientes, profissionais e atendimentos
Melhorar o controle e a organização dos dados da clínica
Garantir maior confiabilidade das informações armazenadas

Além disso, o projeto permitiu a aplicação prática de conceitos estudados durante o curso, como:
Arquitetura em camadas
Desenvolvimento de API REST
Desenvolvimento Full Stack
Testes automatizados
Conteinerização com Docker

🧱 Arquitetura Geral

O sistema foi dividido em dois módulos principais, visando uma melhor organização e manutenção do código:

TccAgendaFisioterapia
- backend  → API REST responsável pelas regras de negócio e persistência dos dados
- frontend → Aplicação web responsável pela interface com o usuário
- 
Essa separação traz alguns benefícios importantes, como:

Código mais organizado e de fácil manutenção
Maior facilidade para futuras expansões do sistema
Possibilidade de reutilização do backend por outras aplicações, como apps mobile
Separação clara das responsabilidades de cada camada

⚙️ Tecnologias Utilizadas
🔹 Backend

No backend foram utilizadas as seguintes tecnologias:

Node.js
NextJs
TypeScript
API REST
ORM (Prisma) para acesso ao banco de dados
Autenticação baseada em token (JWT)
Arquitetura em camadas:
Controller
Service
Repository
Testes unitários com Jest
Docker e Docker Compose

🔹 Frontend

O frontend foi desenvolvido como uma aplicação SPA, utilizando:

Framework SPA Angular
TypeScript
HTML5 e CSS3
Comunicação com o backend via HTTP
Componentização e separação de responsabilidades

🔹 Banco de Dados

Banco de dados relacional
Estrutura normalizada
Controle de status dos registros (ativo, cancelado, entre outros)

🔐 Autenticação e Segurança

O sistema conta com um mecanismo de autenticação que controla o acesso às funcionalidades disponíveis.
Apenas usuários autorizados conseguem acessar áreas restritas do sistema.

Entre os principais pontos de segurança, destacam-se:
Login por meio de credenciais
Geração de token de autenticação
Validação de permissões de acordo com o perfil do usuário
Proteção de rotas tanto no backend quanto no frontend

🔄 Fluxo de Funcionamento

De forma geral, o funcionamento do sistema segue o seguinte fluxo:
O usuário realiza o login no sistema
O backend valida as credenciais informadas
Um token de autenticação é gerado
Após a autenticação, o usuário tem acesso à agenda
O sistema permite:
Criar agendamentos
Cadastrar Pacientes
Cadastrar Profissionais
Cancelar sessões
Consultar atendimentos

Todas as ações realizadas são validadas no backend antes de serem salvas no banco de dados.

▶️ Como Executar o Projeto
🔹 Execução sem Docker

Backend
npm install
npm run dev

Frontend
npm install
ng serve


⚠️ Antes de executar o projeto, é necessário configurar corretamente as variáveis de ambiente e o banco de dados.
Segue os scripts para serem executados para criação do banco de dados:
CREATE DATABASE agendaFisioterapia
USE [agendaFisioterapia]

CREATE TABLE [dbo].[agenda](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[pacienteId] [int] NOT NULL,
	[profissionalId] [int] NOT NULL,
	[usuarioId] [int] NOT NULL,
	[tipo] [varchar](50) NOT NULL,
	[dataInicio] [date] NULL,
	[dataFim] [date] NULL,
	[observacao] [varchar](200) NULL,
	[ativo] [numeric](1, 0) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[AgendaDia](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[agendaId] [int] NOT NULL,
	[data] [datetime] NULL,
	[hora] [varchar](20) NOT NULL,
	[status] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[avaliacao](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[prontuarioId] [int] NOT NULL,
	[agendaId] [int] NOT NULL,
	[data] [datetime] NOT NULL,
	[tipo] [varchar](30) NOT NULL,
	[queixa] [text] NULL,
	[historia] [text] NULL,
	[doencas] [text] NULL,
	[medicamentos] [text] NULL,
	[cirurgias] [text] NULL,
	[dor] [int] NULL,
	[inspecao] [text] NULL,
	[palpacao] [text] NULL,
	[adm] [text] NULL,
	[forca] [text] NULL,
	[testes] [text] NULL,
	[diagnostico] [text] NULL,
	[objetivos] [text] NULL,
	[plano] [text] NULL,
	[observacoes] [text] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE [dbo].[evolucoes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[prontuarioId] [int] NOT NULL,
	[agendaDiaId] [int] NOT NULL,
	[data] [datetimeoffset](7) NOT NULL,
	[conduta] [nvarchar](max) NULL,
	[exercicios] [nvarchar](max) NULL,
	[recursos] [nvarchar](max) NULL,
	[respostaPaciente] [nvarchar](max) NULL,
	[observacoes] [nvarchar](max) NULL,
	[alta] [numeric](1, 0) NOT NULL,
 CONSTRAINT [PK_evolucao] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE [dbo].[funcionario](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [varchar](200) NOT NULL,
	[dataNascimento] [date] NOT NULL,
	[cep] [char](15) NOT NULL,
	[cnpj] [varchar](50) NOT NULL,
	[uf] [char](2) NOT NULL,
	[endereco] [varchar](200) NOT NULL,
	[numero] [int] NOT NULL,
	[bairro] [varchar](100) NOT NULL,
	[telefone] [varchar](30) NOT NULL,
	[celular] [varchar](30) NOT NULL,
	[cpf] [varchar](20) NOT NULL,
	[email] [varchar](100) NULL,
	[crefito] [varchar](100) NOT NULL,
	[sexo] [decimal](1, 0) NULL,
	[estadoCivil] [decimal](1, 0) NULL,
	[cidade] [varchar](120) NOT NULL,
	[ativo] [int] NOT NULL,
 CONSTRAINT [PK__funciona__3213E83FFF11BF5C] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[paciente](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nome] [varchar](200) NULL,
	[dataNascimento] [date] NULL,
	[cep] [char](15) NULL,
	[uf] [char](2) NULL,
	[endereco] [varchar](200) NULL,
	[numero] [int] NULL,
	[bairro] [varchar](100) NULL,
	[telefone] [varchar](30) NULL,
	[celular] [varchar](30) NULL,
	[cpf] [varchar](20) NULL,
	[email] [varchar](100) NULL,
	[convenio] [varchar](50) NULL,
	[sexo] [decimal](1, 0) NULL,
	[estadoCivil] [decimal](1, 0) NULL,
	[cidade] [varchar](120) NULL,
 CONSTRAINT [PK__paciente__3213E83F654D2796] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[prontuario](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[pacienteId] [int] NOT NULL,
	[profissionalId] [int] NOT NULL,
	[usuarioId] [int] NOT NULL,
	[data] [datetimeoffset](7) NULL,
	[tipo] [varchar](30) NOT NULL,
	[evolucao] [text] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE [dbo].[usuario](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[login] [varchar](50) NOT NULL,
	[senhaHash] [varchar](255) NOT NULL,
	[perfil] [varchar](50) NOT NULL,
	[ativo] [numeric](1, 0) NOT NULL,
	[funcionarioId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[agenda] ON 
SET IDENTITY_INSERT [dbo].[funcionario] ON 

INSERT [dbo].[funcionario] ([id], [nome], [dataNascimento], [cep], [cnpj], [uf], [endereco], [numero], [bairro], [telefone], [celular], [cpf], [email], [crefito], [sexo], [estadoCivil], [cidade], [ativo]) VALUES (2, N'Admin', CAST(N'1994-09-14' AS Date), N'14180085       ', N'48588413000111', N'SP', N'Rua Antonio Zanoni', 50, N'centro', N'11988887780', N'16991337444', N'39015158899', N'jose.augusto@agroti.com.br', N'205703', CAST(0 AS Decimal(1, 0)), CAST(0 AS Decimal(1, 0)), N'pontal', 1)
SET IDENTITY_INSERT [dbo].[funcionario] OFF
GO
SET IDENTITY_INSERT [dbo].[usuario] ON 

INSERT [dbo].[usuario] ([id], [login], [senhaHash], [perfil], [ativo], [funcionarioId]) VALUES (1, N'admin', N'$2b$10$6iIi7QQ4KZ3xX8aNKS4bduwn3zs2vK6iuwAe6bqPJj0GqDJUiByxa', N'ADMIN', CAST(1 AS Numeric(1, 0)), 2)
SET IDENTITY_INSERT [dbo].[usuario] OFF
GO
SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[usuario] ADD  CONSTRAINT [UQ_Usuario_Login] UNIQUE NONCLUSTERED 
(
	[login] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AgendaDia] ADD  CONSTRAINT [DF_AGENDAdia_status]  DEFAULT ('AGENDADO') FOR [status]
GO
ALTER TABLE [dbo].[avaliacao] ADD  CONSTRAINT [DF_avaliacao_data]  DEFAULT (sysdatetime()) FOR [data]
GO
ALTER TABLE [dbo].[evolucoes] ADD  CONSTRAINT [DF_evolucao_data]  DEFAULT (sysdatetimeoffset()) FOR [data]
GO
ALTER TABLE [dbo].[evolucoes] ADD  CONSTRAINT [DF_evolucoes_alta]  DEFAULT ((0)) FOR [alta]
GO
ALTER TABLE [dbo].[prontuario] ADD  CONSTRAINT [DF_prontuario_data]  DEFAULT (sysdatetimeoffset()) FOR [data]
GO
ALTER TABLE [dbo].[agenda]  WITH CHECK ADD  CONSTRAINT [FK_Agenda_Paciente] FOREIGN KEY([pacienteId])
REFERENCES [dbo].[paciente] ([id])
GO
ALTER TABLE [dbo].[agenda] CHECK CONSTRAINT [FK_Agenda_Paciente]
GO
ALTER TABLE [dbo].[agenda]  WITH CHECK ADD  CONSTRAINT [FK_Agenda_Profissional] FOREIGN KEY([profissionalId])
REFERENCES [dbo].[funcionario] ([id])
GO
ALTER TABLE [dbo].[agenda] CHECK CONSTRAINT [FK_Agenda_Profissional]
GO
ALTER TABLE [dbo].[agenda]  WITH CHECK ADD  CONSTRAINT [FK_Agenda_Usuario] FOREIGN KEY([usuarioId])
REFERENCES [dbo].[usuario] ([id])
GO
ALTER TABLE [dbo].[agenda] CHECK CONSTRAINT [FK_Agenda_Usuario]
GO
ALTER TABLE [dbo].[AgendaDia]  WITH CHECK ADD  CONSTRAINT [FK_AgendaDia_Agenda] FOREIGN KEY([agendaId])
REFERENCES [dbo].[agenda] ([id])
GO
ALTER TABLE [dbo].[AgendaDia] CHECK CONSTRAINT [FK_AgendaDia_Agenda]
GO
ALTER TABLE [dbo].[avaliacao]  WITH CHECK ADD  CONSTRAINT [FK_avaliacao_agenda] FOREIGN KEY([agendaId])
REFERENCES [dbo].[agenda] ([id])
GO
ALTER TABLE [dbo].[avaliacao] CHECK CONSTRAINT [FK_avaliacao_agenda]
GO
ALTER TABLE [dbo].[avaliacao]  WITH CHECK ADD  CONSTRAINT [FK_avaliacao_prontuario] FOREIGN KEY([prontuarioId])
REFERENCES [dbo].[prontuario] ([id])
GO
ALTER TABLE [dbo].[avaliacao] CHECK CONSTRAINT [FK_avaliacao_prontuario]
GO
ALTER TABLE [dbo].[evolucoes]  WITH CHECK ADD  CONSTRAINT [FK_evolucao_agendaDia] FOREIGN KEY([agendaDiaId])
REFERENCES [dbo].[AgendaDia] ([id])
GO
ALTER TABLE [dbo].[evolucoes] CHECK CONSTRAINT [FK_evolucao_agendaDia]
GO
ALTER TABLE [dbo].[evolucoes]  WITH CHECK ADD  CONSTRAINT [FK_evolucao_prontuario] FOREIGN KEY([prontuarioId])
REFERENCES [dbo].[prontuario] ([id])
GO
ALTER TABLE [dbo].[evolucoes] CHECK CONSTRAINT [FK_evolucao_prontuario]
GO
ALTER TABLE [dbo].[prontuario]  WITH CHECK ADD  CONSTRAINT [FK_Prontuario_Paciente] FOREIGN KEY([pacienteId])
REFERENCES [dbo].[paciente] ([id])
GO
ALTER TABLE [dbo].[prontuario] CHECK CONSTRAINT [FK_Prontuario_Paciente]
GO
ALTER TABLE [dbo].[prontuario]  WITH CHECK ADD  CONSTRAINT [FK_Prontuario_Profissional] FOREIGN KEY([profissionalId])
REFERENCES [dbo].[funcionario] ([id])
GO
ALTER TABLE [dbo].[prontuario] CHECK CONSTRAINT [FK_Prontuario_Profissional]
GO
ALTER TABLE [dbo].[prontuario]  WITH CHECK ADD  CONSTRAINT [FK_Prontuario_Usuario] FOREIGN KEY([usuarioId])
REFERENCES [dbo].[usuario] ([id])
GO
ALTER TABLE [dbo].[prontuario] CHECK CONSTRAINT [FK_Prontuario_Usuario]
GO
ALTER TABLE [dbo].[usuario]  WITH CHECK ADD  CONSTRAINT [fk_funcionario] FOREIGN KEY([funcionarioId])
REFERENCES [dbo].[funcionario] ([id])
GO
ALTER TABLE [dbo].[usuario] CHECK CONSTRAINT [fk_funcionario]
GO

Após criado o banco executar esses comandos abaixo, para gerar os schemas e o mapeamento:
npx prisma db pull --schema=src/prisma/schema.prisma
npx prisma migrate dev --name add_usuarios --schema=src/prisma/schema.prisma
npx prisma generate --schema=src/prisma/schema.prisma

🐳 Execução com Docker

O projeto também pode ser executado utilizando Docker, o que facilita a configuração do ambiente e evita problemas de dependências.

docker-compose up -d


Esse comando irá subir:

Backend
Frontend
Banco de dados
Essa abordagem é recomendada para padronizar o ambiente de desenvolvimento.

🧪 Testes Unitários

O backend do projeto possui testes unitários, que ajudam a garantir a qualidade e a confiabilidade do código.

Os testes permitem:

Validar as principais regras de negócio
Reduzir a ocorrência de erros em futuras alterações
Tornar a evolução do sistema mais segura
Facilitar a manutenção do código

Para executar os testes:

npm run test

📈 Trabalhos Futuros

Como possíveis evoluções do sistema, destacam-se:

Implementação de um módulo de prontuário eletrônicos
Envio de notificações automáticas de agendamento (e-mail ou WhatsApp)
Geração de relatórios gerenciais
Desenvolvimento de um aplicativo móvel integrado à API
Criação de um dashboard com indicadores de atendimentos

🎓 Contexto Acadêmico

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso, aplicando conhecimentos adquiridos ao longo da graduação, tais como:
Engenharia de Software
Programação Orientada a Objetos
Desenvolvimento Web
Banco de Dados
Arquitetura de Sistemas
Testes de Software
DevOps (Docker)

✍️ Autor

José Oliveira
Curso: Desenvolvimento full stack
Instituição: PUCRS
