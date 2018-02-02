using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using App.Metrics;
using System;
using IdentityServer4.AccessTokenValidation;

namespace OcelotGateway
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        public IConfiguration Configuration { get; }
        public void ConfigureServices(IServiceCollection services)
        {
            #region 注放Metrics 
            var metrics = AppMetrics.CreateDefaultBuilder()
            .Configuration.Configure(
            options =>
            {
                options.AddAppTag("RepairApp");
                options.AddEnvTag("stage");
            })
            .Report.ToInfluxDb(
            options =>
            {
                options.InfluxDb.BaseUri = new Uri("http://127.0.0.1:8086");
                options.InfluxDb.Database = "MetricsDB";
                options.InfluxDb.UserName = "admin";
                options.InfluxDb.Password = "123456";
                options.HttpPolicy.BackoffPeriod = TimeSpan.FromSeconds(30);
                options.HttpPolicy.FailuresBeforeBackoff = 5;
                options.HttpPolicy.Timeout = TimeSpan.FromSeconds(10);
                options.FlushInterval = TimeSpan.FromSeconds(5);
            })
            .Build();
            services.AddMetrics(metrics);
            services.AddMetricsReportScheduler();
            services.AddMetricsTrackingMiddleware();
            services.AddMetricsEndpoints();
            #endregion

            #region 注放JWT
            var audienceConfig = Configuration.GetSection("Audience");
            //注入OcelotJwtBearer
            //services.AddOcelotJwtBearer(audienceConfig["Issuer"], audienceConfig["Audience"], audienceConfig["Secret"], "GSWBearer");
            //var keyByteArray = Encoding.ASCII.GetBytes(secret);
            //var signingKey = new SymmetricSecurityKey(keyByteArray);
            //var tokenValidationParameters = new TokenValidationParameters
            //{
            //    ValidateIssuerSigningKey = true,
            //    IssuerSigningKey = signingKey,
            //    ValidateIssuer = true,
            //    ValidIssuer = issuer,//发行人
            //    ValidateAudience = true,
            //    ValidAudience = audience,//订阅人
            //    ValidateLifetime = true,
            //    ClockSkew = TimeSpan.Zero,
            //    RequireExpirationTime = true,
            //};
            //services.AddAuthentication(options =>
            //{
            //    options.DefaultScheme = defaultScheme;
            //})
            //.AddCookie(cfg => cfg.SlidingExpiration = true)
            //.AddJwtBearer(defaultScheme, opt =>
            //{
            //    //不使用https
            //    opt.RequireHttpsMetadata = isHttps;
            //    opt.TokenValidationParameters = tokenValidationParameters;
            //});
            //services.AddAuthentication(options =>
            //{
            //    options.DefaultScheme = "Bearer";
            //})
            //.AddIdentityServerAuthentication(options =>
            // {
            //       options.Authority = "http://localhost:5000/";
            //       options.RequireHttpsMetadata = false;

            //       options.ApiName = "WebAPI";
            // });
            #endregion
            //注入配置文件，AddOcelot要求参数是IConfigurationRoot类型，所以要作个转换
            services.AddOcelot(Configuration as ConfigurationRoot);
        }
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            #region Metrics中间件
            app.UseMetricsAllMiddleware();
            app.UseMetricsAllEndpoints();
            #endregion
            app.UseOcelot().Wait();
        }
    }
}
