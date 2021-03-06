using System;
using System.Linq;
using AngularSPAWebAPI.Data;
using AngularSPAWebAPI.Models;
using AngularSPAWebAPI.Services;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using IdentityServer4.EntityFramework.DbContexts;
using System.Reflection;
using IdentityServer4.EntityFramework.Mappers;
using Consul;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;


namespace AngularSPAWebAPI
{
    public class Startup
    {
        private readonly IHostingEnvironment currentEnvironment;
        private string name = Assembly.GetEntryAssembly().GetName().Name;
        private int port = 5000;
        private string id {
            get {
                return name + ":" + port;
            }
        }
        private ConsulClient client = new ConsulClient();
        public IConfiguration Configuration { get; }
        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            Configuration = configuration;
            currentEnvironment = env;
            



            var tcpCheck = new AgentServiceCheck()
            {
                DeregisterCriticalServiceAfter = TimeSpan.FromMinutes(1),
                Interval = TimeSpan.FromSeconds(30),
                TCP = $"127.0.0.1:{port}"
            };

            var httpCheck = new AgentServiceCheck()
            {
                DeregisterCriticalServiceAfter = TimeSpan.FromMinutes(1),
                Interval = TimeSpan.FromSeconds(30),
                HTTP = $"http://127.0.0.1:{port}/"
            };

            var registration = new AgentServiceRegistration()
            {
                //Checks = new[] { tcpCheck, httpCheck },
                Checks = new[] { tcpCheck },
                Address = "127.0.0.1",
                ID = id,
                Name = name,
                Port = port
            };

            client.Agent.ServiceRegister(registration).GetAwaiter().GetResult();


        }

        

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var connectionString = Configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString));

            // services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            //     {
            //         // Password settings.
            //         options.Password.RequireDigit = true;
            //         options.Password.RequiredLength = 8;
            //         options.Password.RequireNonAlphanumeric = false;
            //         options.Password.RequireUppercase = true;
            //         options.Password.RequireLowercase = false;
            //         // Lockout settings.
            //         options.Lockout.AllowedForNewUsers = true;
            //         options.Lockout.MaxFailedAccessAttempts = 3;
            //         options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromDays(1);
            //     }
            // )
            //     .AddEntityFrameworkStores<ApplicationDbContext>()
            //     .AddDefaultTokenProviders();
            
            // Identity options.
            // services.Configure<IdentityOptions>(options =>
            // {
            //     // Password settings.
            //     options.Password.RequireDigit = true;
            //     options.Password.RequiredLength = 8;
            //     options.Password.RequireNonAlphanumeric = false;
            //     options.Password.RequireUppercase = true;
            //     options.Password.RequireLowercase = false;
            //     // Lockout settings.
            //     options.Lockout.AllowedForNewUsers = true;
            //     options.Lockout.MaxFailedAccessAttempts = 3;
            //     options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromDays(1);
            // });


            IdentityBuilder builder = services.AddIdentityCore<IdentityUser>(options =>
                {
                    // Password settings.
                    options.Password.RequireDigit = true;
                    options.Password.RequiredLength = 8;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireUppercase = true;
                    options.Password.RequireLowercase = false;
                    // Lockout settings.
                    options.Lockout.AllowedForNewUsers = true;
                    options.Lockout.MaxFailedAccessAttempts = 3;
                    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromDays(1);
                }
            );
            //builder = new IdentityBuilder(builder.UserType, typeof(IdentityRole), builder.Services);

            builder.AddEntityFrameworkStores<ApplicationDbContext>();
            builder.AddRoleValidator<RoleValidator<IdentityRole>>();
            builder.AddRoleManager<RoleManager<IdentityRole>>();
            builder.AddSignInManager<SignInManager<IdentityUser>>();
            //builder.AddUserManager<UserManager<ApplicationUser>>();
            builder.AddDefaultTokenProviders();
            builder.AddUserStore<ApplicationUser>();
            builder.AddClaimsPrincipalFactory<ApplicationUser>();
            //services.AddScoped<IUserStore<ApplicationUser>, UserStore<ApplicationUser>>();
            //services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, UserClaimsPrincipalFactory<ApplicationUser>>();
            //services.AddScoped<UserManager<ApplicationUser>>();

            // Role based Authorization: policy based role checks.
            services.AddAuthorization(options =>
            {
                // Policy for dashboard: only administrator role.
                options.AddPolicy("Manage Accounts", policy => policy.RequireRole("administrator"));
                // Policy for resources: user or administrator roles. 
                options.AddPolicy("Access Resources", policy => policy.RequireRole("administrator", "user"));
            });

            // Adds application services.
            services.AddTransient<IEmailSender, EmailSender>();
            services.AddTransient<IDbInitializer, DbInitializer>();
            var migrationsAssembly = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;
            // Adds IdentityServer.
            services.AddIdentityServer()
                // The AddDeveloperSigningCredential extension creates temporary key material for signing tokens.
                // This might be useful to get started, but needs to be replaced by some persistent key material for production scenarios.
                // See http://docs.identityserver.io/en/release/topics/crypto.html#refcrypto for more information.
                //.AddDeveloperSigningCredential()
                .AddSigningCredential(Certificate.Get())
                .AddAspNetIdentity<ApplicationUser>() // IdentityServer4.AspNetIdentity.
                //.AddInMemoryPersistedGrants()
                // To configure IdentityServer to use EntityFramework (EF) as the storage mechanism for configuration data (rather than using the in-memory implementations),
                // see https://identityserver4.readthedocs.io/en/release/quickstarts/8_entity_framework.html
                //.AddInMemoryIdentityResources(Config.GetIdentityResources())
                //.AddInMemoryApiResources(Config.GetApiResources())
                //.AddInMemoryClients(Config.GetClients())
                .AddConfigurationStore(options =>
                {
                    options.ConfigureDbContext = obuilder =>
                        obuilder.UseSqlServer(connectionString,
                            sql => sql.MigrationsAssembly(migrationsAssembly));
                })
                // this adds the operational data from DB (codes, tokens, consents)
                .AddOperationalStore(options =>
                {
                    options.ConfigureDbContext = obuilder =>
                        obuilder.UseSqlServer(connectionString,
                            sql => sql.MigrationsAssembly(migrationsAssembly));

                    // this enables automatic token cleanup. this is optional.
                    options.EnableTokenCleanup = true;
                    options.TokenCleanupInterval = 3600;
                });

                

            // if (currentEnvironment.IsProduction())
            // {
            // else
            // {
            // }
            /////////AddAuthentication will send cookie, replace with AddIdentityCore
            services.AddAuthentication(IdentityServerAuthenticationDefaults.AuthenticationScheme)
                .AddIdentityServerAuthentication(options =>
                {
                    options.Authority = "http://localhost:5000/";
                    options.RequireHttpsMetadata = false;

                    options.ApiName = "WebAPI";
                });
            

            services.AddMvc();

            services.AddCors();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            InitializeDatabase(app);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                // Starts "npm start" command using Shell extension.
                app.Shell("npm start");
            }

            // Router on the server must match the router on the client (see app.routing.module.ts) to use PathLocationStrategy.
            var appRoutes = new[] {
                 "/home",
                 "/account/signin",
                 "/account/signup",
                 "/resources",
                 "/dashboard"
            };

            app.Use(async (context, next) =>
            {
                if (context.Request.Path.HasValue && appRoutes.Contains(context.Request.Path.Value))
                {
                    context.Request.Path = new PathString("/");
                }

                await next();
            });

            app.UseIdentityServer();
            app.UseCors(builder =>
                builder
                .WithOrigins("http://localhost:5001")
                .AllowAnyHeader()
            );
            app.UseMvc();

            // Microsoft.AspNetCore.StaticFiles: API for starting the application from wwwroot.
            // Uses default files as index.html.
            app.UseDefaultFiles();
            // Uses static file for the current path.
            app.UseStaticFiles();

        }


        private void InitializeDatabase(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                serviceScope.ServiceProvider.GetRequiredService<PersistedGrantDbContext>().Database.Migrate();
                serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>().Database.Migrate();
                var context = serviceScope.ServiceProvider.GetRequiredService<ConfigurationDbContext>();
                context.Database.Migrate();
                if (!context.Clients.Any())
                {
                    foreach (var client in Config.GetClients())
                    {
                        context.Clients.Add(client.ToEntity());
                    }
                    context.SaveChanges();
                }

                if (!context.IdentityResources.Any())
                {
                    foreach (var resource in Config.GetIdentityResources())
                    {
                        context.IdentityResources.Add(resource.ToEntity());
                    }
                    context.SaveChanges();
                }

                if (!context.ApiResources.Any())
                {
                    foreach (var resource in Config.GetApiResources())
                    {
                        context.ApiResources.Add(resource.ToEntity());
                    }
                    context.SaveChanges();
                }
            }
        }

        private void OnShutdown()
        {
            client.Agent.ServiceDeregister(id).GetAwaiter().GetResult();
        }
    }
}
