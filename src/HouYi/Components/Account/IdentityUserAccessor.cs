using Microsoft.AspNetCore.Identity;
using HouYi.Data;

namespace HouYi.Components.Account;

internal sealed class IdentityUserAccessor(UserManager<HouYiUser> userManager, IdentityRedirectManager redirectManager)
{
    public async Task<HouYiUser> GetRequiredUserAsync(HttpContext context)
    {
        var user = await userManager.GetUserAsync(context.User);

        if (user is null)
        {
            redirectManager.RedirectToWithStatus("Account/InvalidUser", $"Error: Unable to load user with ID '{userManager.GetUserId(context.User)}'.", context);
        }

        return user;
    }
}
