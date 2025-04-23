namespace HouYi.Models;

public enum ResumeSource : byte
{
    /// <summary>
    /// 人才库积累（历史联系过的候选人、未成功入职的候选人）
    /// </summary>
    TalentPool = 0,

    /// <summary>
    /// 猎头主动搜集（招聘网站、社交媒体、行业论坛等）
    /// </summary>
    Consultant = 1,

    /// <summary>
    /// 企业推荐（HR 或管理层推荐）
    /// </summary>
    Company = 2,

    /// <summary>
    /// 候选人主动投递（官网、邮件、社交平台）
    /// </summary>
    Candidate = 3,


    /// <summary>
    /// 合作伙伴提供（招聘机构、职业培训机构、行业协会）
    /// </summary>
    Partner = 4,

    Others = 255
}