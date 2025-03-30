using HouYi.Models;

namespace HouYi.Services;

public interface IAreaService
{
    /// <summary>
    /// Gets the area name by ID. Returns null if not found.
    /// </summary>
    string? GetAreaName(int id);

    /// <summary>
    /// Forces a refresh of the area cache from the data source.
    /// </summary>
    Task RefreshCacheAsync();
}