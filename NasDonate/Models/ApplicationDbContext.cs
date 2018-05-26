using Microsoft.EntityFrameworkCore;

namespace NasDonate.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options):base(options)
        {
            
        }

        public DbSet<User> Users { get; set; }
        public DbSet<FileModel> Files { get; set; }
    }
}
