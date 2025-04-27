using HouYi.Data;
using HouYi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System.Data;

namespace HouYi.Services;

public class UserService : IUserService
{
    private readonly HouYiDbContext _context;
    private readonly UserManager<HouYiUser> _userManager;
    private readonly RoleManager<IdentityRole<int>> _roleManager;

    public UserService(HouYiDbContext context, UserManager<HouYiUser> userManager, RoleManager<IdentityRole<int>> roleManager)
    {
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task<PagedResult<HouYiUser>> GetUsersAsync(int pageNumber, int pageSize)
    {
        var query = _context.Users.AsQueryable();
        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(u => u.UpdatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<HouYiUser>(items, pageNumber, pageSize, totalCount);
    }

    public async Task<PagedResult<HouYiUser>> FindUsersAsync(string searchTerm, int pageNumber, int pageSize)
    {
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            searchTerm = searchTerm.ToLower();
            query = query.Where(u =>
                u.UserName.ToLower().Contains(searchTerm) ||
                u.Email.ToLower().Contains(searchTerm) ||
                u.PhoneNumber.ToLower().Contains(searchTerm)
            );
        }

        var totalCount = await query.CountAsync();
        List<HouYiUser> items;
        if (totalCount == 0)
        {
            items = new(await _userManager.GetUsersInRoleAsync(searchTerm));
        }
        else
        {
            items = await query
               .OrderByDescending(u => u.UpdatedAt)
               .Skip((pageNumber - 1) * pageSize)
               .Take(pageSize)
               .ToListAsync();
        }

        return new PagedResult<HouYiUser>(items, pageNumber, pageSize, totalCount);
    }

    public async Task<IReadOnlyCollection<string>> GetUserRolesAsync(HouYiUser user)
    {
        IReadOnlyCollection<string> roles = new List<string>(await _userManager.GetRolesAsync(user));
        return roles;
    }

    public async Task DeleteUserAsync(int userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
            throw new InvalidOperationException("用户不存在。");
        if (user.NormalizedUserName == Constants.Users.DefaultAdminName.ToUpper())
            throw new InvalidOperationException("无法删除默认管理员用户。");

        // 检查是否存在关联数据
        var relativePositionCount = await _context.Positions.CountAsync(p => p.ConsultantId == userId);
        if (relativePositionCount > 0)
            throw new InvalidOperationException($"用户 {user.UserName} 有关联的{relativePositionCount}条职位记录，无法删除。");

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
            throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
    }

    public async Task UpdateUserAsync(HouYiUser user)
    {
        var existingUser = await _userManager.FindByIdAsync(user.Id.ToString());
        if (existingUser == null)
            throw new InvalidOperationException("用户不存在。");

        existingUser.UserName = user.UserName;
        existingUser.Email = user.Email;
        existingUser.PhoneNumber = user.PhoneNumber;
        existingUser.LockoutEnabled = user.LockoutEnabled;
        existingUser.UpdatedAt = DateTime.Now;

        var result = await _userManager.UpdateAsync(existingUser);
        if (!result.Succeeded)
            throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
    }

    public async Task UpdateUserAsync(HouYiUser user, string role)
    {
        using IDbContextTransaction transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var existingUser = await _userManager.FindByIdAsync(user.Id.ToString());
            if (existingUser == null)
                throw new InvalidOperationException("用户不存在。");

            // 检查角色是否存在
            if (!await _roleManager.RoleExistsAsync(role))
                throw new InvalidOperationException($"角色 '{role}' 不存在。");

            // 获取用户当前所有角色
            var currentRoles = await _userManager.GetRolesAsync(existingUser);

            // 移除所有现有角色
            if (currentRoles.Any())
            {
                var removeResult = await _userManager.RemoveFromRolesAsync(existingUser, currentRoles);
                if (!removeResult.Succeeded)
                    throw new Exception(string.Join(", ", removeResult.Errors.Select(e => e.Description)));
            }

            // 添加新角色
            if (!string.IsNullOrEmpty(role))
            {
                var addResult = await _userManager.AddToRoleAsync(existingUser, role);
                if (!addResult.Succeeded)
                    throw new Exception(string.Join(", ", addResult.Errors.Select(e => e.Description)));
            }
            await UpdateUserAsync(user);
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}