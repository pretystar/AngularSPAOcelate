
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace OcelotGateway
{
    public class Program
    {
        public static void Main(string[] args)
        {
            IWebHostBuilder builder = new WebHostBuilder();
            //注入WebHostBuilder
            builder.ConfigureServices(service =>
                {
                    service.AddSingleton(builder);
                })
                //加载configuration配置文人年
                .ConfigureAppConfiguration(conbuilder =>
                {
                    conbuilder.AddJsonFile("appsettings.json");
                    conbuilder.AddJsonFile("configuration.json");
                })
                .ConfigureLogging((hostingContext, logging) =>
                {
                    logging.AddConfiguration(hostingContext.Configuration.GetSection("Logging"));
                    logging.AddConsole();
                    logging.AddDebug();
                })
                .UseKestrel()
                .UseUrls("http://*:5001")
                .UseStartup<Startup>()
                .Build()
                .Run();
        }
    }
}
