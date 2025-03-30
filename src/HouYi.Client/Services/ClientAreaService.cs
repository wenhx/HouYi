using HouYi.Models;
using HouYi.Services;
using System.Net.Http.Json;

namespace HouYi.Client.Services;

public class ClientAreaService(HttpClient _httpClient, ILogger<AreaService> _logger) : AreaServiceBase(_logger)
{
    protected override async Task<IEnumerable<LeveledReferenceData>> GetAreasAsync()
    {
        return await _httpClient.GetFromJsonAsync<IEnumerable<LeveledReferenceData>>($"/api/areas");
    }
}