using HouYi.Models;

namespace HouYi.Components;

public static class DisplayHelper
{
    internal static string GetResumeExperienceText(int years)
    {
        return years switch
        {
            < 1 => "应届生",
            < 3 => "1-3年",
            < 5 => "3-5年",
            < 10 => "5-10年",
            _ => "10年以上"
        };
    }

    internal static string GetEducationText(EducationLevel education)
    {
        return education switch
        {
            EducationLevel.Doctorate => "博士",
            EducationLevel.Master => "硕士",
            EducationLevel.Bachelor => "本科",
            EducationLevel.Associate => "大专",
            EducationLevel.Other => "其他",
            _ => "未知"
        };
    }

    internal static string GetGenderText(Gender gender)
    {
        return gender switch
        {
            Gender.Male => "男",
            Gender.Female => "女",
            Gender.PreferNotToSay => "保密",
            _ => "未知"
        };
    }

    internal static string GetEmploymentStatusText(EmploymentStatus status)
    {
        return status switch
        {
            EmploymentStatus.Unemployed => "待业中",
            EmploymentStatus.EmployedAndNotConsideringOpportunities => "在职-不考虑机会",
            EmploymentStatus.EmployedAndOpenToOpportunities => "在职-考虑新机会",
            _ => "未知"
        };
    }

    internal static string GetResumeSourceText(ResumeSource source)
    {
        return source switch
        {
            ResumeSource.TalentPool => "人才库",
            ResumeSource.Consultant => "猎头搜集",
            ResumeSource.Company => "企业推荐",
            ResumeSource.Candidate => "主动投递",
            ResumeSource.Partner => "合作伙伴",
            _ => "其他"
        };
    }

    internal static string GetInterviewStatusText(InterviewStatus status)
    {
        return status switch
        {
            InterviewStatus.Scheduled => "已安排",
            InterviewStatus.Completed => "已完成",
            InterviewStatus.Postponed => "已延期",
            InterviewStatus.Passed => "已通过",
            InterviewStatus.Failed => "未通过",
            InterviewStatus.Cancelled => "已取消",
            _ => "未知"
        };
    }

    internal static string GetInterviewStatusClass(InterviewStatus status)
    {
        return status switch
        {
            InterviewStatus.Scheduled => "status-scheduled",
            InterviewStatus.Completed => "status-completed",
            InterviewStatus.Postponed => "status-postponed",
            InterviewStatus.Passed => "status-passed",
            InterviewStatus.Failed => "status-failed",
            InterviewStatus.Cancelled => "status-cancelled",
            _ => ""
        };
    }

    internal static string GetCommunicatedResultText(CommunicatedResult result)
    {
        return result switch
        {
            CommunicatedResult.NoResponse => "未响应",
            CommunicatedResult.Interested => "有意向",
            CommunicatedResult.NotInterested => "无意向",
            CommunicatedResult.Pending => "待定",
            CommunicatedResult.Further => "进一步沟通",
            _ => "未知"
        };
    }

    internal static string GetCommunicatedResultBadgeClass(CommunicatedResult result)
    {
        return result switch
        {
            CommunicatedResult.Interested => "bg-success",
            CommunicatedResult.NotInterested => "bg-danger",
            CommunicatedResult.Pending => "bg-warning",
            CommunicatedResult.Further => "bg-info",
            CommunicatedResult.NoResponse => "bg-secondary",
            _ => "bg-secondary"
        };
    }
}