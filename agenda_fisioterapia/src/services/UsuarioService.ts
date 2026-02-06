import bcrypt from 'bcryptjs';
import { UsuarioRepository } from '@/repositories/UsuarioRepository';
import { Usuario, PerfilUsuario } from '@/domain/entities/Usuario';
import { FuncionarioRepository } from '@/repositories/FuncionarioRepository';
import { JwtService } from '@/shared/security/JwtService';

export class UsuarioService {

  constructor(
    private repository: UsuarioRepository,
    private funcionarioRepository: FuncionarioRepository
  ) { }

  // =====================================================
  // CADASTRAR
  // =====================================================
  async cadastrar(dados: {
    login: string;
    senha: string;
    perfil: PerfilUsuario;
    ativo: boolean;
    funcionarioId: number;
  }): Promise<Usuario> {

    if (!dados.login?.trim()) {
      throw new Error('Login é obrigatório');
    }

    if (!dados.senha?.trim()) {
      throw new Error('Senha é obrigatória');
    }

    if (!dados.perfil) {
      throw new Error('Perfil é obrigatório');
    }

    if (!dados.funcionarioId || dados.funcionarioId <= 0) {
      throw new Error('Funcionário é obrigatório');
    }

    const loginExistente = await this.repository.buscarPorLogin(dados.login);
    if (loginExistente) {
      throw new Error('Já existe usuário cadastrado com este login');
    }

    const funcionarioExiste =
      await this.funcionarioRepository.buscarPorId(dados.funcionarioId);

    if (!funcionarioExiste) {
      throw new Error('Funcionário informado não existe');
    }

    const senhaHash = await bcrypt.hash(dados.senha, 10);

    const usuario = new Usuario(
      0,
      dados.login,
      senhaHash,
      dados.perfil,
      true,
      dados.funcionarioId
    );

    return await this.repository.salvar(usuario);
  }

  // =====================================================
  // BUSCAR POR LOGIN
  // =====================================================
  async buscarPorLogin(login: string): Promise<any> {

    if (!login?.trim()) {
      throw new Error('Login é obrigatório para a busca');
    }

    const usuario = await this.repository.buscarPorLogin(login);

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    return usuario; // 🔥 não converte para Entity
  }

  // =====================================================
  // BUSCAR POR ID
  // =====================================================
  async buscarPorId(id: number): Promise<any> {

    if (!id || id <= 0) {
      throw new Error('ID é obrigatório para a busca');
    }

    const usuario = await this.repository.buscarPorIdComFuncionario(id);

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    return usuario; // 🔥 mantém funcionario
  }

  // =====================================================
  // LISTAR
  // =====================================================
  async listar(): Promise<any[]> {
    return await this.repository.listarComFuncionario();
  }

  // =====================================================
  // DELETAR
  // =====================================================
  async deletar(id: number): Promise<void> {

    const usuarioExistente = await this.repository.buscarPorId(id);

    if (!usuarioExistente) {
      throw new Error('Usuário não encontrado');
    }

    await this.repository.deletarPorId(id);
  }

  // =====================================================
  // AUTENTICAÇÃO
  // =====================================================
  async autenticar(
    login: string,
    senha: string
  ): Promise<{ usuario: Usuario; token: string }> {

    if (!login?.trim()) {
      throw new Error('Login é obrigatório');
    }

    if (!senha?.trim()) {
      throw new Error('Senha é obrigatória');
    }

    const usuario = await this.repository.buscarPorLogin(login);

    if (!usuario) {
      throw new Error('Usuário ou senha inválidos');
    }

    if (!usuario.isAtivo()) {
      throw new Error('Usuário inativo');
    }

    const senhaValida = await bcrypt.compare(
      senha,
      usuario.getSenhaHash()
    );

    if (!senhaValida) {
      throw new Error('Usuário ou senha inválidos');
    }

    const token = JwtService.sign({
      sub: String(usuario.getId()),
      perfil: usuario.getPerfil()
    });

    return { usuario, token };
  }

  // =====================================================
  // ATUALIZAR
  // =====================================================
  async atualizar(dados: Usuario & { senha?: string }): Promise<any> {

    const usuarioExistente =
      await this.repository.buscarPorId(dados.getId());

    if (!usuarioExistente) {
      throw new Error('Usuário não encontrado');
    }

    const funcionarioExiste =
      await this.funcionarioRepository.buscarPorId(
        dados.getFuncionarioId()
      );

    if (!funcionarioExiste) {
      throw new Error('Funcionário informado não existe');
    }

    const loginEmUso =
      await this.repository.buscarPorLoginExcetoId(
        dados.getLogin(),
        dados.getId()
      );

    if (loginEmUso) {
      throw new Error('Login já cadastrado para outro usuário');
    }

    // 🔐 senha opcional
    if ((dados as any).senha?.trim()) {
      const novaSenhaHash = await bcrypt.hash(
        (dados as any).senha,
        10
      );
      dados.setSenhaHash(novaSenhaHash);
    } else {
      dados.setSenhaHash(usuarioExistente.getSenhaHash());
    }

    return await this.repository.atualizar(dados);
  }

  async recuperarSenha(dados: {
    email: string;
    cpf: string;
    cnpj: string;
    crefito: string;
    novaSenha: string;
  }) {
    const usuario = await this.repository.buscarParaRecuperacao(
      dados
    );

    if (!usuario) {
      throw new Error('Dados não conferem');
    }

    const senhaHash = await bcrypt.hash(dados.novaSenha, 10);

    await this.repository.atualizarSenha(
      usuario.id,
      senhaHash
    );
  }
}