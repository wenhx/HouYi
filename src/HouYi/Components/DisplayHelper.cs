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

    internal static string GetResumeStatusText(EmploymentStatus status)
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
}