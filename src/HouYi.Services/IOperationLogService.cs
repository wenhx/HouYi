using HouYi.Models;

namespace HouYi.Services;

public interface IOperationLogService
{
    Task AddAsync(OperationLog log);
    Task<PagedResult<OperationLog>> GetLogsAsync(OperationLogQuery query, int pageNumber = 1, int pageSize = 10);
}
