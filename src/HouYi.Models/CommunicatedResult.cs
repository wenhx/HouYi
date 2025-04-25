namespace HouYi.Models;

public enum CommunicatedResult
{
    NoResponse = 0,          // 未响应
    Interested = 1,          // 有意向
    NotInterested = 2,       // 无意向
    Pending = 3,             // 待定
    Further = 4              // 进一步沟通
}