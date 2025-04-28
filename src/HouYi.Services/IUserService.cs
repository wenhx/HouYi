using HouYi.Models;

namespace HouYi.Services;

public interface IUserService
{
    Task<PagedResult<HouYiUser>> GetUsersAsync(int pageNumber, int pageSize);
    Task<IReadOnlyCollection<string>> GetUserRolesAsync(HouYiUser user);
    Task DeleteUserAsync(int userId);
    Task UpdateUserAsync(HouYiUser user);
    Task UpdateUserAsync(HouYiUser user, string role);
    Task<PagedResult<HouYiUser>> FindUsersAsync(string searchTerm, int pageNumber, int pageSize);
}