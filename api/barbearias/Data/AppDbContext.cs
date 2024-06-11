﻿using jwtRegisterLogin.Models;
using Microsoft.EntityFrameworkCore;

namespace jwtRegisterLogin.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {           
        }

        public DbSet<UsuarioModel> Usuario { get; set; }

        public DbSet<ServicoModel> Servico { get ; set; }

        public DbSet<AgendaModel> Agenda { get; set; }

        public DbSet<TokenModel> TokenDb { get; set; }
        public DbSet<BarbeariaModel> Barbearia { get; set; }
        public DbSet<BarbeariaUsuarioModel> BarbeariaUsuario { get; set; }
    }
}
