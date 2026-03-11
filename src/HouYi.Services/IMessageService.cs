using HouYi.Models;

namespace HouYi.Services;

public interface IMessageService
{
    Task<PagedResult<UserMessageDto>> GetMyMessagesAsync(MessageQuery query, int pageNumber = 1, int pageSize = 10);
    Task<int> GetUnreadCountAsync();
    Task MarkAsReadAsync(int messageId);
    Task MarkAllAsReadAsync();

    Task<MessageSendResult> SendToAllAsync(MessageSendRequest request);
    Task<MessageSendResult> SendToRoleAsync(string roleName, MessageSendRequest request);
    Task<PagedResult<AdminMessageDto>> GetAllMessagesAsync(MessageAdminQuery query, int pageNumber = 1, int pageSize = 10);
}
