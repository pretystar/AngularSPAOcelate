using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace AngularSPAWebAPI.Data
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        private string connectionstring="Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=IdentityDbSPA;Integrated Security=True";
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseSqlite(connectionstring);

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}