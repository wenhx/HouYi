using HouYi.Infrastructure;
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

    public async Task<PagedResult<Resume>> GetResumesAsync(int pageIndex, int pageSize)
    {
        var result = await httpClient.GetFromJsonAsync<PagedResult<Resume>>($"/api/Resumes?pageIndex={pageIndex}&pageSize={pageSize}");
        return result ?? new PagedResult<Resume> { Items = new List<Resume>(), TotalCount = 0 };
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
