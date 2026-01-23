BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[paciente] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nome] VARCHAR(200),
    [dataNascimento] DATE,
    [cep] CHAR(15),
    [uf] CHAR(2),
    [endereco] VARCHAR(200),
    [numero] INT,
    [bairro] VARCHAR(100),
    [telefone] VARCHAR(30),
    [celular] VARCHAR(30),
    [cpf] VARCHAR(20),
    [email] VARCHAR(100),
    [convenio] VARCHAR(50),
    [sexo] DECIMAL(1,0),
    [estadoCivil] DECIMAL(1,0),
    [cidade] VARCHAR(120),
    CONSTRAINT [PK__paciente__3213E83F654D2796] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[funcionario] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nome] VARCHAR(200) NOT NULL,
    [dataNascimento] DATE NOT NULL,
    [cep] CHAR(15) NOT NULL,
    [cnpj] VARCHAR(50) NOT NULL,
    [uf] CHAR(2) NOT NULL,
    [endereco] VARCHAR(200) NOT NULL,
    [numero] INT NOT NULL,
    [bairro] VARCHAR(100) NOT NULL,
    [telefone] VARCHAR(30) NOT NULL,
    [celular] VARCHAR(30) NOT NULL,
    [cpf] VARCHAR(20) NOT NULL,
    [email] VARCHAR(100),
    [crefito] VARCHAR(100) NOT NULL,
    [sexo] DECIMAL(1,0),
    [estadoCivil] DECIMAL(1,0),
    [cidade] VARCHAR(120) NOT NULL,
    [ativo] INT NOT NULL,
    CONSTRAINT [PK__funciona__3213E83FFF11BF5C] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
