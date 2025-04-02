using HouYi.Data;
using HouYi.Models;
using Microsoft.AspNetCore.Mvc;

namespace HouYi.Controllers;

[Route("api")]
[ApiController]
public class LeveledReferenceDataController(HouYiDbContext _dbContext) : ControllerBase
{
    [HttpGet("areas")]
    public IEnumerable<LeveledReferenceData> GetAreasAsync()
    {
        //TODO: 设置客户端缓存。
        return _dbContext.LeveledReferenceData.Where(d => d.Category == Constants.Categories.Area);
    }
}