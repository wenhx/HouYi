using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using HouYi.Client.Pages;
using HouYi.Components;
using HouYi.Components.Account;
using HouYi.Data;
using HouYi.Data.Utils;
using HouYi.Services;
using HouYi.Models.Resumes;
using Microsoft.AspNetCore.Diagnostics;

namespace HouYi;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        #region Build in services.
        // Add services to the container.
        builder.Services.AddRazorComponents()
            .AddInteractiveWebAssemblyComponents()
            .AddInteractiveServerComponents()
            .AddAuthenticationStateSerialization();

        builder.Services.AddCascadingAuthenticationState();
        builder.Services.AddScoped<IdentityUserAccessor>();
        builder.Services.AddScoped<IdentityRedirectManager>();

        builder.Services.AddAuthentication(options =>
            {
                options.DefaultScheme = IdentityConstants.ApplicationScheme;
                options.DefaultSignInScheme = IdentityConstants.ExternalScheme;
            })
            .AddIdentityCookies();
        builder.Services.AddAuthorization();

        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        builder.Services.AddDbContext<HouYiDbContext>(options =>
            options.UseSqlServer(connectionString));
        builder.Services.AddDatabaseDeveloperPageExceptionFilter();

        builder.Services.AddIdentityCore<HouYiUser>(options => options.SignIn.RequireConfirmedAccount = true)
            .AddEntityFrameworkStores<HouYiDbContext>()
            .AddSignInManager()
            .AddDefaultTokenProviders();

        builder.Services.AddSingleton<IEmailSender<HouYiUser>, IdentityNoOpEmailSender>();
        #endregion
        #region HouYi services.
        builder.Services.AddScoped<IResumeService, ResumeService>();
        #endregion

        // Add services for controllers
        builder.Services.AddControllers();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseWebAssemblyDebugging();
            app.UseMigrationsEndPoint();
            using var scope = app.Services.CreateScope();
            SampleAppInitializer.Seed(scope.ServiceProvider.GetRequiredService<HouYiDbContext>());
        }
        else
        {
            app.UseExceptionHandler("/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
        }

        app.UseHttpsRedirection();

        app.UseAntiforgery();

        app.MapStaticAssets();
        app.MapRazorComponents<App>()
            .AddInteractiveWebAssemblyRenderMode()
            .AddInteractiveServerRenderMode()
            .AddAdditionalAssemblies(typeof(Client._Imports).Assembly);

        // Add additional endpoints required by the Identity /Account Razor components.
        app.MapAdditionalIdentityEndpoints();

        // Map controllers
        app.MapControllers();

        app.Run();
    }
}
