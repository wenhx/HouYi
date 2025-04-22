using HouYi.Models;

namespace HouYi.Services;

public interface ICommunicationService
{
    Task<PagedResult<Communication>> GetCommunicationsAsync(
        int pageNumber = 1, 
        int pageSize = 10, 
        CommunicatedResult? result = null,
        CommunicationMethod? method = null,
        ContactReason? reason = null);
    
    Task<PagedResult<Communication>> FindCommunicationsAsync(
        string term = "", 
        int pageNumber = 1, 
        int pageSize = 10, 
        CommunicatedResult? result = null,
        CommunicationMethod? method = null,
        ContactReason? reason = null);

    Task<Communication> CreateCommunicationAsync(Communication communication);
    Task<Communication> UpdateCommunicationAsync(Communication communication);
} 