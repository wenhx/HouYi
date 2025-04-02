using HouYi.Infrastructure;
using HouYi.Models;
using HouYi.Models.Resumes;
using HouYi.Services;
using System.Net.Http.Json;

namespace HouYi.Client.Services;

public class ClientResumeService(HttpClient httpClient) : IResumeService
{
    public Task<bool> DeleteResumeAsync(string id)
    {
        if (string.IsNullOrEmpty(id))
            throw new ArgumentException("id不能为空", nameof(id));

        return httpClient.DeleteFromJsonAsync<bool>($"/api/Resumes/{id}");
    }

    public async Task<PagedResult<Resume>> GetResumesAsync(
        int pageIndex,
        int pageSize,
        string? searchField = null,
        string? searchTerm = null,
        Gender? gender = null,
        CurrentStatus? currentStatus = null,
        Degree? degree = null,
        ResumeSource? source = null)
    {
        var url = $"/api/Resumes?pageIndex={pageIndex}&pageSize={pageSize}";

        if (!string.IsNullOrWhiteSpace(searchField) && !string.IsNullOrWhiteSpace(searchTerm))
        {
            url += $"&searchField={searchField}&searchTerm={Uri.EscapeDataString(searchTerm)}";
        }

        if (gender.HasValue)
        {
            url += $"&gender={gender.Value}";
        }

        if (currentStatus.HasValue)
        {
            url += $"&currentStatus={currentStatus.Value}";
        }

        if (degree.HasValue)
        {
            url += $"&degree={degree.Value}";
        }

        if (source.HasValue)
        {
            url += $"&source={source.Value}";
        }

        try
        {
            var result = await httpClient.GetFromJsonAsync<PagedResult<Resume>>(url);
            return result ?? new PagedResult<Resume> { Items = new List<Resume>(), TotalCount = 0 };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"搜索失败: {ex.Message}");
            return new PagedResult<Resume> { Items = new List<Resume>(), TotalCount = 0 };
        }
    }

    public async Task<InvokedResult> UpdateResumePropertyAsync<T>(string id, string propertyName, T value)
    {
        if (string.IsNullOrEmpty(id))
            throw new ArgumentException("id不能为空", nameof(id));
        if (string.IsNullOrEmpty(propertyName))
            throw new ArgumentException("属性名不能为空", nameof(propertyName));

        try
        {
            var response = await httpClient.PutAsJsonAsync($"/api/Resumes/{id}", new NameValueRecord<T>(propertyName, value));
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<InvokedResult>() ?? InvokedResult.Failure("数据读取异常");
            }
            else
            {
                var errorMessage = await response.Content.ReadAsStringAsync();
                return InvokedResult.Failure($"服务端错误: {errorMessage}");
            }
        }
        catch (Exception ex)
        {
            return InvokedResult.Failure($"请求异常: {ex.Message}");
        }
    }
}
