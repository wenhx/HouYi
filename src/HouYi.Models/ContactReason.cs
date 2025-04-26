namespace HouYi.Models;

public enum ContactReason : byte
{
    Other = 0,
    /// <summary>
    /// 流程后续跟进沟通。
    /// </summary>
    FollowUp = 1,
    /// <summary>
    /// 通知。
    /// </summary>
    Notification = 2,
    /// <summary>
    /// 机会推荐。
    /// </summary>
    Opportunity = 3,
    /// <summary>
    /// 关系维护。
    /// </summary>
    Relationship = 4
}