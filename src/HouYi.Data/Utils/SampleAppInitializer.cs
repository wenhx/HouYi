using HouYi.Models;
using HouYi.Models.Resumes;
using System.Text;

namespace HouYi.Data.Utils;

public class SampleAppInitializer
{
    private static readonly string[] ChineseNames = {
        "李志强", "王建国", "张伟", "刘德华", "陈东海", "杨军", "黄海平", "赵文明", "周国平", "吴德文",
        "李思源", "王子轩", "张晓峰", "刘明辉", "陈家豪", "杨博文", "黄凯旋", "赵天成", "周建华", "吴俊杰",
        "郑智勇", "孙志伟", "钱学良", "周海洋", "吴承恩", "郭明亮", "何宇航", "马超", "林志峰", "王浩然",
        "张云飞", "刘思远", "陈奕然", "杨明哲", "黄博文", "赵鑫磊", "周泽明", "吴思远", "郑博远", "孙长青",
        "李雨泽", "王子墨", "张浩然", "刘天宇", "陈思远", "杨雨泽", "黄晨阳", "赵瑞祥", "周子豪", "吴宇轩",
        "郑明哲", "孙浩宇", "钱辰皓", "周子墨", "吴博文", "郭天翔", "何宇轩", "马晨阳", "林子轩", "王博远",
        "张志强", "刘雨晨", "陈浩宇", "杨子默", "黄天佑", "赵子豪", "周浩然", "吴明轩", "郑子轩", "孙浩轩",
        "李晓峰", "王浩宇", "张雨轩", "刘子豪", "陈志远", "杨博远", "黄浩轩", "赵明哲", "周博文", "吴子轩",
        "郑浩然", "孙天成", "钱志远", "周博远", "吴天宇", "郭子轩", "何浩然", "马天翔", "林浩宇", "王子轩",
        "张浩轩", "刘博远", "陈子轩", "杨天宇", "黄博远", "赵浩然", "周天宇", "吴浩然", "郑天宇", "孙浩然"
    };

    private static readonly string[] Positions = {
        "研发总监", "技术总监", "首席架构师", "高级架构师", "技术经理", 
        "财务总监", "人力资源总监", "运营总监", "市场总监", "销售总监",
        "前端工程师", "后端工程师", "全栈工程师", "数据工程师", "测试工程师",
        "产品经理", "项目经理", "运维工程师", "UI设计师", "数据分析师"
    };

    private static readonly string[] EvaluationTemplates = {
        "该候选人在{0}领域有丰富经验，技术功底扎实，团队协作能力强。",
        "作为{0}，展现出优秀的领导才能和项目管理能力，善于解决复杂问题。",
        "具有多年{0}经验，对业务理解深刻，能力突出，沟通表达清晰。",
        "在{0}岗位表现出色，具有创新思维，能快速适应新环境和技术。",
        "专业的{0}人才，工作态度认真负责，有强烈的责任心和进取心。"
    };

    public static void Seed(HouYiDbContext db)
    {
        if (!db.Resumes.Any())
        {
            var resumes = GenerateResumes(100);
            db.Resumes.AddRange(resumes);
            db.SaveChanges();
        }
    }

    private static List<Resume> GenerateResumes(int count)
    {
        var resumes = new List<Resume>();
        var random = new Random();

        for (int i = 0; i < count; i++)
        {
            var name = ChineseNames[i]; // Sequential access instead of random
            var position = Positions[random.Next(Positions.Length)];
            var isComplete = random.NextDouble() <= 0.75;

            var resume = new Resume
            {
                Id = Guid.NewGuid().ToString(),
                Name = name,
                Gender = (Gender)random.Next(0, 3),
                Age = (byte)random.Next(22, 61),
                Phone = GeneratePhoneNumber(random),
                Email = $"{PinyinConverter.ToPinyin(name)}@qq.com",
                CurrentStatus = (CurrentStatus)random.Next(0, 4),
                Position = isComplete ? position : string.Empty,
                Degree = (Degree)random.Next(0, 6),
                AnnualSalary = (short)random.Next(50, 200),
                City = (short)random.Next(1, 1000),
                Source = (byte)random.Next(1, 10),
                Note = isComplete 
                    ? string.Format(
                        EvaluationTemplates[random.Next(EvaluationTemplates.Length)], 
                        position)
                    : string.Empty,
                CreatedAt = DateTime.Now.AddDays(-random.Next(1, 365)),
                UpdatedAt = DateTime.Now
            };

            resumes.Add(resume);
        }

        return resumes;
    }

    private static string GeneratePhoneNumber(Random random)
    {
        var sb = new StringBuilder("13");
        for (int i = 0; i < 9; i++)
        {
            sb.Append(random.Next(0, 10));
        }
        return sb.ToString();
    }
}
