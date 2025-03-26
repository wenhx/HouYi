using HouYi.Models.Resumes;
using HouYi.Services;
using Microsoft.Extensions.Options;
using System.Net.Http.Json;

namespace HouYi.Client.Services;

public class ClientResumeService(HttpClient httpClient) : IResumeService
{
    public Task<bool> DeleteResumeAsync(string id)
    {
        return httpClient.DeleteFromJsonAsync<bool>($"/api/Resumes/{id}");
    }

    public async Task<PagedResult<Resume>> GetResumesAsync(int pageIndex, int pageSize)
    {
        var result = await httpClient.GetFromJsonAsync<PagedResult<Resume>>($"/api/Resumes?pageIndex={pageIndex}&pageSize={pageSize}");
        return result ?? new PagedResult<Resume> { Items = new List<Resume>(), TotalCount = 0 };
    }

    public async Task<bool> UpdateResumePropertyAsync<T>(string id, string propertyName, T value)
    {
        var response = await httpClient.PutAsJsonAsync($"/api/Resumes/{id}", new NameValueRecord<T>(propertyName, value));
        return await response.Content.ReadFromJsonAsync<bool>();
    }
}
