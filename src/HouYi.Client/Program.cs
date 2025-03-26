using HouYi.Client.Services;
using HouYi.Data;
using HouYi.Services;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.EntityFrameworkCore;

namespace HouYi.Client;

class Program
{
    static async Task Main(string[] args)
    {
        var builder = WebAssemblyHostBuilder.CreateDefault(args);

        builder.Services.AddAuthorizationCore();
        builder.Services.AddCascadingAuthenticationState();
        builder.Services.AddAuthenticationStateDeserialization();

        builder.Services.AddSingleton(
            new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

        #region HouYi Services
        builder.Services.AddScoped<IResumeService, ClientResumeService>();
        #endregion

        await builder.Build().RunAsync();
    }
}
