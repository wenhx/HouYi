namespace HouYi.Models;

public enum InterviewStatus : byte
{
    Scheduled = 0,    // 已安排
    Completed = 1,    // 已面试但尚未给出结论
    Passed = 2,       // 已通过
    Cancelled = 3,    // 已取消
    Failed = 4,        // 未通过
    Postponed = 5
}