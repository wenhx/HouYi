using HouYi.Models;

namespace HouYi.Services;

public interface IPlaceService
{
    Task<IReadOnlyCollection<Place>> GetChineseProvincesAsync();
    Task<IReadOnlyCollection<Place>> GetCitiesOfProvinceAsync(int provinceId);
} 