using System.ComponentModel.DataAnnotations;

namespace HouYi.Models;

public class Interview
{
    private string _Feedback = string.Empty;

    public int Id { get; set; }

    [Required(ErrorMessage = "简历ID不能为空")]
    [StringLength(Constants.StringLengths.GUID)]
    public required string ResumeId { get; set; }
    public virtual Resume Resume { get; set; }

    [Required(ErrorMessage = "职位ID不能为空")]
    [Range(1, int.MaxValue, ErrorMessage = "职位ID必须大于0")]
    public required int PositionId { get; set; }
    public Position Position { get; set; }

    [Required(ErrorMessage = "推荐ID不能为空")]
    [Range(1, int.MaxValue, ErrorMessage = "推荐ID必须大于0")]
    public required int RecommendationId { get; set; }
    public virtual Recommendation? Recommendation { get; set; }

    [Required(ErrorMessage = "面试时间不能为空")]
    [FutureDate(AfterHours = 1)]
    public required DateTime InterviewTime { get; set; }

    [Required(ErrorMessage = "面试地点不能为空")]
    [StringLength(Constants.StringLengths.Address, ErrorMessage = "面试地点长度不能超过{1}个字符")]
    public required string Location { get; set; }

    [Range(1, byte.MaxValue, ErrorMessage = "面试轮次必须大于0")]
    public byte Round { get; set; }

    [Required(ErrorMessage = "面试官不能为空")]
    [StringLength(Constants.StringLengths.Name, ErrorMessage = "面试官姓名长度不能超过{1}个字符")]
    public required string Interviewer { get; set; }

    public InterviewStatus Status { get; set; }

    [StringLength(Constants.StringLengths.Text, ErrorMessage = "反馈内容长度不能超过{1}个字符")]
    public string Feedback
    {
        get => _Feedback;
        set => _Feedback = value ?? string.Empty;
    }

    [StringLength(Constants.StringLengths.Text, ErrorMessage = "备注内容长度不能超过{1}个字符")]
    public string Remarks { get; set; } = string.Empty;


    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}