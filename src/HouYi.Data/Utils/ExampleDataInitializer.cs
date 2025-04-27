using HouYi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Text;
using System.Text.Json;

namespace HouYi.Data.Utils;

public partial class ExampleDataInitializer
{
    private static readonly string s_AdminRoleName = "管理员";

    public static async Task Seed(IServiceProvider sp)
    {
        ILogger<ExampleDataInitializer> logger = sp.GetRequiredService<ILogger<ExampleDataInitializer>>();
        HouYiDbContext dbContext = sp.GetRequiredService<HouYiDbContext>();
        dbContext.Database.EnsureDeleted();
        dbContext.Database.EnsureCreated();

        await SeedUserData(dbContext,
            sp.GetRequiredService<UserManager<HouYiUser>>(),
            sp.GetRequiredService<RoleManager<IdentityRole<int>>>());
        SeedCustomersData(dbContext);
        SeedPositionData(dbContext, logger);
        SeedPlaceData(dbContext, logger);
        SeedResumeData(dbContext, logger);
        SeedRecommendationData(dbContext, logger);
        SeedInterviewsData(dbContext, logger);
        SeedCommunicationData(dbContext, logger);
    }

    private static void SeedPositionData(HouYiDbContext dbContext, ILogger<ExampleDataInitializer> logger)
    {
        if (dbContext.Positions.Any()) return;

        List<Customer> customers = dbContext.Customers.ToList();
        List<HouYiUser> notAdminUsers = (from u in dbContext.Users
                                         join ur in dbContext.UserRoles on u.Id equals ur.UserId
                                         join r in dbContext.Roles on ur.RoleId equals r.Id
                                         where r.Name != s_AdminRoleName
                                         select u).ToList();

        var random = new Random();
        var positions = new List<Position>();

        var positionNames = new[]
        {
            "高级Java开发工程师",
            "前端开发工程师",
            "产品经理",
            "测试工程师",
            "运维工程师",
            "UI设计师",
            "数据分析师",
            "架构师",
            "项目经理",
            "安全工程师",
            "移动开发工程师",
            "大数据工程师",
            "人工智能工程师",
            "DevOps工程师",
            "技术总监"
        };

        var descriptions = new[]
        {
            "负责核心业务系统开发，要求5年以上Java开发经验",
            "负责Web前端开发，要求精通React或Vue",
            "负责产品规划与设计，要求3年以上产品经验",
            "负责软件测试工作，要求熟悉自动化测试",
            "负责系统运维，要求熟悉Linux和Docker",
            "负责产品UI设计，要求有良好的审美能力",
            "负责数据分析和挖掘，要求熟悉Python和SQL",
            "负责系统架构设计，要求8年以上开发经验",
            "负责项目管理，要求PMP认证优先",
            "负责系统安全，要求熟悉网络安全技术",
            "负责iOS/Android开发，要求3年以上移动开发经验",
            "负责大数据平台开发，要求熟悉Hadoop生态",
            "负责AI算法开发，要求熟悉机器学习框架",
            "负责CI/CD流程，要求熟悉Jenkins和Kubernetes",
            "负责技术团队管理，要求10年以上技术经验"
        };

        var statuses = Enum.GetValues<PositionStatus>();
        for (int i = 0; i < positionNames.Length; i++)
        {
            var customer = customers[random.Next(customers.Count)];
            var consultant = notAdminUsers[random.Next(notAdminUsers.Count)];
            var status = statuses[random.Next(statuses.Length)];
            var daysAgo = random.Next(180); // 最近6个月内的随机天数

            positions.Add(new Position
            {
                Name = positionNames[i],
                Customer = customer,
                CustomerId = customer.Id,
                Status = status,
                Number = (byte)random.Next(5),
                Consultant = consultant,
                ConsultantId = consultant.Id,
                ContactPerson = customer.ContactPerson,
                ContactPhone = customer.Phone,
                Description = descriptions[i],
                CreatedAt = DateTime.Now.AddDays(-daysAgo),
                UpdatedAt = DateTime.Now.AddDays(-daysAgo)
            });
        }

        dbContext.Positions.AddRange(positions);
        dbContext.SaveChanges();
        logger.LogInformation("Position data seeded successfully. [{0}]", positions.Count);
    }

    #region User
    private static async Task SeedUserData(HouYiDbContext dbContext, UserManager<HouYiUser> userManager, RoleManager<IdentityRole<int>> roleManager)
    {
        string password = "1@34abcD";
        await CreateUser(userManager, roleManager, s_AdminRoleName, "admin@houyi.com", "Admin", password);
        await CreateUser(userManager, roleManager, "经理", "manager@houyi.com", "Manager", password);
        string consultantRoleName = "顾问";
        await CreateUser(userManager, roleManager, consultantRoleName, "consultant1@houyi.com", "Consultant1", password);
        await CreateUser(userManager, roleManager, consultantRoleName, "consultant2@houyi.com", "Consultant2", password);
    }

    private static async Task CreateUser(UserManager<HouYiUser> userManager, RoleManager<IdentityRole<int>> roleManager, string roleName, string email, string userName, string password)
    {
        bool isRoleExist = await roleManager.RoleExistsAsync(roleName);
        if (!isRoleExist)
        {
            IdentityRole<int> role = new() { Name = roleName };
            await roleManager.CreateAsync(role);
        }
        HouYiUser? user = await userManager.FindByEmailAsync(email);
        if (user == null)
        {
            user = new HouYiUser { UserName = userName, Email = email, EmailConfirmed = true };
            IdentityResult result = await userManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, roleName);
                //await userManager.AddClaimAsync(user, new System.Security.Claims.Claim("Permission", "Admin"));
            }
        }
    }
    #endregion

    #region Customer
    private static void SeedCustomersData(HouYiDbContext dbContext)
    {
        if (dbContext.Customers.Any()) return;

        var customers = new List<Customer>
        {
            new() {
                Name = "阿里巴巴科技",
                ContactPerson = "马云",
                Email = "contact@alibaba.com",
                Phone = "13800138000",
                Address = "浙江省杭州市余杭区文一西路969号",
                Description = "电子商务与科技公司",
                CreatedAt = DateTime.Now.AddMonths(-18),
                UpdatedAt = DateTime.Now.AddMonths(-18)
            },
            new() {
                Name = "腾讯科技",
                ContactPerson = "马化腾",
                Email = "service@tencent.com",
                Phone = "13900139000",
                Address = "深圳市南山区高新科技园腾讯大厦",
                Description = "互联网服务提供商",
                CreatedAt = DateTime.Now.AddMonths(-17),
                UpdatedAt = DateTime.Now.AddMonths(-16)
            },
            new() {
                Name = "华为技术",
                ContactPerson = "任正非",
                Email = "support@huawei.com",
                Phone = "13700137000",
                Address = "广东省深圳市龙岗区坂田华为基地",
                Description = "通信设备制造商",
                CreatedAt = DateTime.Now.AddMonths(-16),
                UpdatedAt = DateTime.Now.AddMonths(-15)
            },
            new() {
                Name = "小米科技",
                ContactPerson = "雷军",
                Email = "info@xiaomi.com",
                Phone = "13600136000",
                Address = "北京市海淀区清河中街68号",
                Description = "智能硬件制造商",
                CreatedAt = DateTime.Now.AddMonths(-15),
                UpdatedAt = DateTime.Now.AddMonths(-14)
            },
            new() {
                Name = "比亚迪汽车",
                ContactPerson = "王传福",
                Email = "sales@byd.com",
                Phone = "13500135000",
                Address = "深圳市坪山区比亚迪路3009号",
                Description = "新能源汽车制造商",
                CreatedAt = DateTime.Now.AddMonths(-14),
                UpdatedAt = DateTime.Now.AddMonths(-13)
            },
            new() {
                Name = "京东商城",
                ContactPerson = "刘强东",
                Email = "support@jd.com",
                Phone = "13400134000",
                Address = "北京市亦庄经济开发区科创十一街18号",
                Description = "电商平台运营商",
                CreatedAt = DateTime.Now.AddMonths(-13),
                UpdatedAt = DateTime.Now.AddMonths(-12)
            },
            new() {
                Name = "美团点评",
                ContactPerson = "王兴",
                Email = "business@meituan.com",
                Phone = "13300133000",
                Address = "北京市朝阳区望京东路6号",
                Description = "生活服务平台",
                CreatedAt = DateTime.Now.AddMonths(-12),
                UpdatedAt = DateTime.Now.AddMonths(-11)
            },
            new() {
                Name = "网易科技",
                ContactPerson = "丁磊",
                Email = "contact@netease.com",
                Phone = "13200132000",
                Address = "杭州市滨江区网商路599号",
                Description = "互联网技术公司",
                CreatedAt = DateTime.Now.AddMonths(-11),
                UpdatedAt = DateTime.Now.AddMonths(-10)
            },
            new() {
                Name = "字节跳动",
                ContactPerson = "张一鸣",
                Email = "hr@bytedance.com",
                Phone = "13100131000",
                Address = "北京市海淀区科学院南路2号",
                Description = "短视频平台运营商",
                CreatedAt = DateTime.Now.AddMonths(-10),
                UpdatedAt = DateTime.Now.AddMonths(-9)
            },
            new() {
                Name = "百度在线",
                ContactPerson = "李彦宏",
                Email = "support@baidu.com",
                Phone = "13000130000",
                Address = "北京市海淀区上地十街10号",
                Description = "搜索引擎服务商",
                CreatedAt = DateTime.Now.AddMonths(-9),
                UpdatedAt = DateTime.Now.AddMonths(-8)
            },
            new() {
                Name = "联想集团",
                ContactPerson = "杨元庆",
                Email = "service@lenovo.com",
                Phone = "15900159000",
                Address = "北京市海淀区创业路6号",
                Description = "计算机硬件制造商",
                CreatedAt = DateTime.Now.AddMonths(-8),
                UpdatedAt = DateTime.Now.AddMonths(-7)
            },
            new() {
                Name = "海尔智家",
                ContactPerson = "周云杰",
                Email = "care@haier.com",
                Phone = "15800158000",
                Address = "青岛市崂山区海尔路1号",
                Description = "智能家电制造商",
                CreatedAt = DateTime.Now.AddMonths(-7),
                UpdatedAt = DateTime.Now.AddMonths(-6)
            },
            new() {
                Name = "中兴通讯",
                ContactPerson = "李自学",
                Email = "info@zte.com",
                Phone = "15700157000",
                Address = "深圳市南山区高新技术产业园",
                Description = "通信设备制造商",
                CreatedAt = DateTime.Now.AddMonths(-6),
                UpdatedAt = DateTime.Now.AddMonths(-5)
            },
            new() {
                Name = "格力电器",
                ContactPerson = "董明珠",
                Email = "sales@gree.com",
                Phone = "15600156000",
                Address = "珠海市前山金鸡西路",
                Description = "空调设备制造商",
                CreatedAt = DateTime.Now.AddMonths(-5),
                UpdatedAt = DateTime.Now.AddMonths(-4)
            },
            new() {
                Name = "小鹏汽车",
                ContactPerson = "何小鹏",
                Email = "service@xiaopeng.com",
                Phone = "15500155000",
                Address = "广州市天河区科韵路16号",
                Description = "电动汽车制造商",
                CreatedAt = DateTime.Now.AddMonths(-4),
                UpdatedAt = DateTime.Now.AddMonths(-3)
            },
            new() {
                Name = "蔚来汽车",
                ContactPerson = "李斌",
                Email = "support@nio.com",
                Phone = "15400154000",
                Address = "上海市嘉定区安亭镇安驰路569号",
                Description = "新能源车企",
                CreatedAt = DateTime.Now.AddMonths(-3),
                UpdatedAt = DateTime.Now.AddMonths(-2)
            },
            new() {
                Name = "奇瑞汽车",
                ContactPerson = "尹同跃",
                Email = "info@chery.com",
                Phone = "15300153000",
                Address = "安徽省芜湖市经济技术开发区",
                Description = "汽车制造企业",
                CreatedAt = DateTime.Now.AddMonths(-2),
                UpdatedAt = DateTime.Now.AddMonths(-1)
            },
            new() {
                Name = "OPPO电子",
                ContactPerson = "陈明永",
                Email = "contact@oppo.com",
                Phone = "15200152000",
                Address = "广东省东莞市长安镇OPPO路1号",
                Description = "智能手机制造商",
                CreatedAt = DateTime.Now.AddMonths(-1),
                UpdatedAt = DateTime.Now
            },
            new() {
                Name = "中芯国际",
                ContactPerson = "赵海军",
                Email = "pr@smics.com",
                Phone = "15100151000",
                Address = "上海市浦东新区张江高科技园区",
                Description = "半导体制造商",
                CreatedAt = DateTime.Now.AddDays(-15),
                UpdatedAt = DateTime.Now
            },
            new() {
                Name = "大疆创新",
                ContactPerson = "汪滔",
                Email = "support@dji.com",
                Phone = "15000150000",
                Address = "深圳市南山区高新南四道18号",
                Description = "无人机制造商",
                CreatedAt = DateTime.Now.AddDays(-7),
                UpdatedAt = DateTime.Now
            }
        };

        dbContext.Customers.AddRange(customers);
        dbContext.SaveChanges();
    }
    #endregion

    #region Resume
    public static void SeedResumeData(HouYiDbContext db, ILogger<ExampleDataInitializer> logger)
    {
        if (!db.Resumes.Any())
        {
            var cities = db.Places
                .Where(data => data.Level == 3 && data.IsDeleted == false).ToList();
            var resumes = GenerateResumes(100, cities);
            db.Resumes.AddRange(resumes);
            db.SaveChanges();
            logger.LogInformation("Resume data seeded successfully. [{0}]", resumes.Count);
        }
    }

    private static List<Resume> GenerateResumes(int count, List<Place> cities)
    {
        var resumes = new List<Resume>();
        var random = new Random();

        for (int i = 0; i < count; i++)
        {
            var name = s_ChineseNames[i]; // Sequential access instead of random
            var position = s_Positions[random.Next(s_Positions.Length)];
            var isComplete = random.NextDouble() <= 0.8;

            var createdAt = GenerateDateTime(random);
            var updatedAt = createdAt.AddMinutes(random.Next(1, 24 * 60));
            if (updatedAt > DateTime.Now)
            {
                updatedAt = DateTime.Now;
            }
            byte age = (byte)random.Next(22, 61);
            var resume = new Resume
            {
                Id = Guid.NewGuid().ToString(),
                Name = name,
                Gender = (Gender)random.Next(0, 3),
                Age = age,
                Phone = GeneratePhoneNumber(random),
                Email = $"{PinyinConverter.ToPinyin(name)}@qq.com",
                Status = (EmploymentStatus)random.Next(0, 4),
                Position = isComplete ? position : string.Empty,
                HighestEducation = (EducationLevel)random.Next(0, 6),
                YearsOfExperience = (byte)(age - 22),
                AnnualSalary = (short)random.Next(50, 200),
                PlaceId = (short)cities[random.Next(0, cities.Count)].Id,
                Source = (ResumeSource)random.Next(1, 4),
                Note = isComplete
                    ? string.Format(
                        s_EvaluationTemplates[random.Next(s_EvaluationTemplates.Length)],
                        position)
                    : string.Empty,
                CreatedAt = createdAt,
                UpdatedAt = updatedAt
            };

            resumes.Add(resume);
        }

        return resumes;
    }

    private static readonly string[] s_ChineseNames = {
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

    private static readonly string[] s_Positions = {
        "研发总监", "技术总监", "首席架构师", "高级架构师", "技术经理",
        "财务总监", "人力资源总监", "运营总监", "市场总监", "销售总监",
        "前端工程师", "后端工程师", "全栈工程师", "数据工程师", "测试工程师",
        "产品经理", "项目经理", "运维工程师", "UI设计师", "数据分析师"
    };

    private static readonly string[] s_EvaluationTemplates = {
        "该候选人在{0}领域有丰富经验，技术功底扎实，团队协作能力强。",
        "作为{0}，展现出优秀的领导才能和项目管理能力，善于解决复杂问题。",
        "具有多年{0}经验，对业务理解深刻，能力突出，沟通表达清晰。",
        "在{0}岗位表现出色，具有创新思维，能快速适应新环境和技术。",
        "专业的{0}人才，工作态度认真负责，有强烈的责任心和进取心。"
    };

    private static string GeneratePhoneNumber(Random random)
    {
        var sb = new StringBuilder("13");
        for (int i = 0; i < 9; i++)
        {
            sb.Append(random.Next(0, 10));
        }
        return sb.ToString();
    }

    private static DateTime GenerateDateTime(Random random)
    {
        var rangeDays = 365;
        var randomDays = random.Next(rangeDays) * -1;
        var randomTime = random.Next(24 * 60 * 60) * -1; // seconds in a day

        return DateTime.Now.AddDays(randomDays).AddSeconds(randomTime);
    }
    #endregion
    #region Places
    public static void SeedPlaceData(HouYiDbContext db, ILogger<ExampleDataInitializer> logger)
    {
        if (db.Places.Count() > 0)
            return;

        short id = 10000;
        var china = new Place
        {
            Id = id++,
            Code = "86",
            Name = "中国",
            Level = 1,
            SortOrder = 0,
            IsDeleted = false,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };
        db.Places.Add(china);

        string json = File.ReadAllText("..\\Places.txt");
        var provinces = JsonSerializer.Deserialize<List<Province>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
        foreach (var province in provinces)
        {
            var provinceEntity = new Place
            {
                Id = id++,
                Code = province.Code,
                Name = province.Name,
                Level = 2,
                SortOrder = 0,
                IsDeleted = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                ParentId = china.Id
            };
            db.Places.Add(provinceEntity);
            foreach (var city in province.City)
            {
                var cityEntity = new Place
                {
                    Id = id++,
                    Code = city.Code,
                    Name = city.Name,
                    Level = 3,
                    SortOrder = 0,
                    IsDeleted = false,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    ParentId = provinceEntity.Id
                };
                db.Places.Add(cityEntity);

                foreach (var area in city.Area)
                {
                    var areaEntity = new Place
                    {
                        Id = id++,
                        Code = area.Code,
                        Name = area.Name,
                        Level = 4,
                        SortOrder = 0,
                        IsDeleted = false,
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now,
                        ParentId = cityEntity.Id
                    };
                    db.Places.Add(areaEntity);
                }
            }
            db.SaveChanges();
            logger.LogInformation("Place data seeded successfully. [{0}]", id);
        }
    }
    class Area
    {
        public string Name { get; set; }
        public string Code { get; set; }
    }

    class City
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public List<Area> Area { get; set; } = new List<Area>();
    }

    class Province
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public List<City> City { get; set; } = new List<City>();
    }
    #endregion
    #region Recommendations
    public static void SeedRecommendationData(HouYiDbContext db, ILogger<ExampleDataInitializer> logger)
    {
        if (db.Recommendations.Any()) return;

        var positions = db.Positions.ToList();
        var resumes = db.Resumes.ToList();
        var random = new Random();
        var recommendations = new List<Recommendation>();
        var statuses = Enum.GetValues<RecommendationStatus>();
        RatingLevel[] matchLevels = new RatingLevel[] { RatingLevel.OneStar, RatingLevel.TwoStars, RatingLevel.ThreeStars, RatingLevel.FourStars, RatingLevel.FiveStars };

        foreach (var position in positions)
        {
            // 每个职位生成0-10条推荐记录
            int recommendationCount = random.Next(0, 11);
            if (recommendationCount == 0)
                continue;

            var selectedResumes = resumes.OrderBy(x => random.Next()).Take(recommendationCount).ToList();

            foreach (var resume in selectedResumes)
            {
                RecommendationStatus status = statuses[random.Next(statuses.Length)];
                var recommendation = new Recommendation
                {
                    ResumeId = resume.Id,
                    PositionId = position.Id,
                    Reason = GenerateRecommendationReason(position, resume),
                    Status = status,
                    MatchLevel = matchLevels[random.Next(matchLevels.Length)],
                    Feedback = GenerateFeedback(position, resume, status, random),
                    CreatedAt = DateTime.Now.AddDays(-random.Next(1, 30)),
                    UpdatedAt = DateTime.Now
                };

                recommendations.Add(recommendation);
            }
        }

        db.Recommendations.AddRange(recommendations);
        db.SaveChanges();
        logger.LogInformation("Recommendation data seeded successfully. [{0}]", recommendations.Count);
    }

    private static string GenerateRecommendationReason(Position position, Resume resume)
    {
        var reasons = new List<string>();

        // 基于职位和简历的匹配度生成推荐理由
        if (resume.Position.Contains(position.Name))
        {
            reasons.Add($"候选人当前职位与目标职位高度匹配，具有{resume.YearsOfExperience}年相关工作经验。");
        }

        if (resume.HighestEducation >= EducationLevel.Bachelor)
        {
            reasons.Add($"候选人具有{GetEducationString(resume.HighestEducation)}学历，符合职位要求。");
        }

        if (resume.AnnualSalary <= position.Number * 20) // 假设年薪期望在职位预算范围内
        {
            reasons.Add($"候选人期望薪资在合理范围内，与职位预算匹配。");
        }

        if (resume.Status == EmploymentStatus.EmployedAndOpenToOpportunities)
        {
            reasons.Add($"候选人目前在职但考虑新机会，稳定性较好。");
        }

        if (reasons.Count == 0)
        {
            reasons.Add($"候选人具有相关行业经验，学习能力强，能够快速适应新环境。");
        }

        return string.Join(" ", reasons);
    }

    private static string GenerateFeedback(Position position, Resume resume, RecommendationStatus status, Random random)
    {
        if (status != RecommendationStatus.Accepted && status != RecommendationStatus.Rejected)
            return string.Empty;

        if (status == RecommendationStatus.Accepted)
        {
            var feedbacks = new[]
            {
                $"候选人技术能力突出，与团队文化契合度高，已安排面试。",
                $"候选人经验丰富，项目经历与职位需求匹配度高，已进入下一轮面试。",
                $"候选人综合素质优秀，沟通能力强，已通过初试。"
            };
            return feedbacks[random.Next(feedbacks.Length)];
        }
        else
        {
            var feedbacks = new[]
            {
                $"候选人技术栈与职位要求存在一定差距，暂不考虑。",
                $"候选人期望薪资超出预算范围，无法满足。",
                $"候选人工作经历与职位要求匹配度不够，建议寻找更合适的候选人。",
                $"候选人目前在职状态不稳定，存在风险。"
            };
            return feedbacks[random.Next(feedbacks.Length)];
        }
    }

    private static string GetEducationString(EducationLevel level)
    {
        return level switch
        {
            EducationLevel.Doctorate => "博士",
            EducationLevel.Master => "硕士",
            EducationLevel.Bachelor => "本科",
            EducationLevel.Associate => "大专",
            EducationLevel.Other => "其他",
            _ => "未知"
        };
    }
    #endregion
    #region Interview
    private static void SeedInterviewsData(HouYiDbContext dbContext, ILogger<ExampleDataInitializer> logger)
    {
        if (dbContext.Interviews.Any()) return;

        var acceptedRecommendations = dbContext.Recommendations
            .Where(r => r.Status == RecommendationStatus.Accepted)
            .Include(r => r.Resume)
            .Include(r => r.Position)
            .ToList();

        if (!acceptedRecommendations.Any())
            throw new InvalidOperationException("推荐记录表中必须要有被接受的推荐记录。");

        var random = new Random();
        var interviews = new List<Interview>();
        var todayInterviewCount = random.Next(1, 6); // 确保1-5条今天的面试

        // 生成面试地点
        var locations = new[]
        {
            "北京市海淀区中关村软件园二期",
            "上海市浦东新区张江高科技园区",
            "深圳市南山区科技园",
            "杭州市西湖区文三路",
            "广州市天河区珠江新城",
            "成都市高新区天府大道",
            "武汉市东湖新技术开发区",
            "南京市建邺区河西新城",
            "西安市高新区科技路",
            "重庆市渝北区光电园"
        };

        // 生成面试官名称
        var interviewers = new[]
        {
            "张明", "李华", "王强", "刘伟", "陈静", "杨光", "赵亮", "周涛", "吴芳", "郑军",
            "孙丽", "朱勇", "胡刚", "林峰", "徐静", "高强", "马明", "黄伟", "谢芳", "董军"
        };

        // 生成今天的面试
        for (int i = 0; i < todayInterviewCount; i++)
        {
            var recommendation = acceptedRecommendations[random.Next(acceptedRecommendations.Count)];
            var interview = new Interview
            {
                ResumeId = recommendation.ResumeId,
                PositionId = recommendation.PositionId,
                RecommendationId = recommendation.Id,
                InterviewTime = DateTime.Today.AddHours(9 + random.Next(8)).AddMinutes(random.Next(60)),
                Location = locations[random.Next(locations.Length)],
                Round = (byte)(1 + random.Next(3)),
                Interviewer = interviewers[random.Next(interviewers.Length)],
                Status = InterviewStatus.Scheduled,
                Feedback = string.Empty,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };
            interviews.Add(interview);
        }

        // 生成其他时间的面试
        InterviewStatus[] historicalInterviewStatuses = [InterviewStatus.Postponed, InterviewStatus.Passed, InterviewStatus.Failed, InterviewStatus.Cancelled];
        string[] feedbacks = [
            "候选人技术能力扎实，沟通表达清晰，建议进入下一轮面试。",
            "候选人项目经验丰富，与团队文化契合度高，建议录用。",
            "候选人基础知识掌握良好，但项目经验稍显不足，建议继续观察。",
            "候选人技术能力符合要求，但期望薪资超出预算，建议协商。",
            "候选人综合素质优秀，但专业方向与职位要求略有偏差，建议考虑其他岗位。",
            "候选人表现良好，建议进入下一轮技术面试。",
            "候选人技术能力突出，但英语沟通能力需要提升，建议加强。",
            "候选人项目经验丰富，但技术深度有待提升，建议继续考察。",
            "候选人学习能力强，潜力大，建议给予机会。",
            "候选人表现一般，建议寻找更合适的候选人。"
        ];
        int otherInterviewCount = random.Next(10, 21); // 生成10-20条其他时间的面试
        for (int i = 0; i < otherInterviewCount; i++)
        {
            var recommendation = acceptedRecommendations[random.Next(acceptedRecommendations.Count)];
            var daysOffset = random.Next(-30, 31); // 最近一个月到未来一个月
            var interview = new Interview
            {
                ResumeId = recommendation.ResumeId,
                PositionId = recommendation.PositionId,
                RecommendationId = recommendation.Id,
                InterviewTime = DateTime.Today.AddDays(daysOffset).AddHours(9 + random.Next(8)).AddMinutes(random.Next(60)),
                Location = locations[random.Next(locations.Length)],
                Round = (byte)(1 + random.Next(3)), // 1-3轮面试
                Interviewer = interviewers[random.Next(interviewers.Length)],
                Status = daysOffset < 0 ? historicalInterviewStatuses[random.Next(historicalInterviewStatuses.Length)] :
                                            InterviewStatus.Scheduled,
                Feedback = daysOffset < 0 ? feedbacks[random.Next(feedbacks.Length)] : string.Empty,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };
            interviews.Add(interview);
        }

        dbContext.Interviews.AddRange(interviews);
        dbContext.SaveChanges();
        logger.LogInformation("Interview data seeded successfully. [{0}]", interviews.Count);
    }
    #endregion
    #region Communications
    private static void SeedCommunicationData(HouYiDbContext dbContext, ILogger<ExampleDataInitializer> logger)
    {
        if (dbContext.Communications.Any()) return;

        var positions = dbContext.Positions.ToList();
        var resumes = dbContext.Resumes.ToList();
        var random = new Random();
        var communications = new List<Communication>();

        // 生成沟通方法数组
        var methods = Enum.GetValues<CommunicationMethod>();
        // 生成沟通原因数组
        var reasons = Enum.GetValues<ContactReason>();
        // 生成沟通结果数组
        var results = Enum.GetValues<CommunicatedResult>();

        // 生成20条没有PositionId的记录
        for (int i = 0; i < 20; i++)
        {
            var resume = resumes[random.Next(resumes.Count)];
            var method = methods[random.Next(methods.Length)];
            var reason = reasons[random.Next(reasons.Length)];
            // 确保reason是Opportunity、Relationship或Other
            while (reason != ContactReason.Opportunity && reason != ContactReason.Relationship && reason != ContactReason.Other)
            {
                reason = reasons[random.Next(reasons.Length)];
            }

            var (content, result) = GenerateCommunicationContent(method, reason, null, resume, random);
            var daysAgo = random.Next(1, 365); // 过去一年内的随机天数

            communications.Add(new Communication
            {
                Id = 0,
                ResumeId = resume.Id,
                Method = method,
                Reason = reason,
                Content = content,
                Result = result,
                CommunicationTime = DateTime.Now.AddDays(-daysAgo),
                CreatedAt = DateTime.Now.AddDays(-daysAgo),
                UpdatedAt = DateTime.Now.AddDays(-daysAgo)
            });
        }

        // 生成40条有PositionId的记录
        for (int i = 0; i < 40; i++)
        {
            var position = positions[random.Next(positions.Count)];
            var resume = resumes[random.Next(resumes.Count)];
            var method = methods[random.Next(methods.Length)];
            var reason = reasons[random.Next(reasons.Length)];
            // 确保reason不是Opportunity、Relationship或Other
            while (reason == ContactReason.Relationship || reason == ContactReason.Other)
            {
                reason = reasons[random.Next(reasons.Length)];
            }

            var (content, result) = GenerateCommunicationContent(method, reason, position, resume, random);
            var daysAgo = random.Next(1, 365); // 过去一年内的随机天数

            communications.Add(new Communication
            {
                Id = 0,
                ResumeId = resume.Id,
                PositionId = position.Id,
                Method = method,
                Reason = reason,
                Content = content,
                Result = result,
                CommunicationTime = DateTime.Now.AddDays(-daysAgo),
                CreatedAt = DateTime.Now.AddDays(-daysAgo),
                UpdatedAt = DateTime.Now.AddDays(-daysAgo)
            });
        }

        dbContext.Communications.AddRange(communications);
        dbContext.SaveChanges();
        logger.LogInformation("Communication data seeded successfully. [{0}]", communications.Count);
    }

    private static (string Content, CommunicatedResult Result) GenerateCommunicationContent(
        CommunicationMethod method, 
        ContactReason reason, 
        Position? position, 
        Resume resume, 
        Random random)
    {
        var methodStr = method.ToString();
        var reasonStr = reason.ToString();
        var positionName = position?.Name ?? "新机会";
        var candidateName = resume.Name;

        // 根据不同的沟通方法和原因生成不同的内容
        string content;
        CommunicatedResult result;

        if (method == CommunicationMethod.Phone)
        {
            if (reason == ContactReason.Opportunity)
            {
                content = $"电话联系{candidateName}，介绍{positionName}职位机会。候选人表示有兴趣，愿意进一步了解。";
                result = CommunicatedResult.Interested;
            }
            else if (reason == ContactReason.FollowUp)
            {
                content = $"电话通知{candidateName}关于{positionName}职位的后续安排。候选人确认可以参加。";
                result = CommunicatedResult.Interested;
            }
            else if (reason == ContactReason.Notification)
            {
                content = $"电话沟通{candidateName}关于{positionName}职位的通知细节。候选人表示需要考虑。";
                result = CommunicatedResult.Pending;
            }
            else if (reason == ContactReason.Relationship)
            {
                content = $"电话联系{candidateName}进行日常关系维护，了解其近况。候选人表示一切顺利。";
                result = CommunicatedResult.Interested;
            }
            else
            {
                content = $"电话联系{candidateName}，讨论{positionName}职位的具体细节。候选人提出了一些问题，已详细解答。";
                result = CommunicatedResult.Interested;
            }
        }
        else if (method == CommunicationMethod.Email)
        {
            if (reason == ContactReason.Opportunity)
            {
                content = $"发送邮件给{candidateName}，详细介绍{positionName}职位信息。候选人回复表示感兴趣。";
                result = CommunicatedResult.Interested;
            }
            else if (reason == ContactReason.FollowUp)
            {
                content = $"发送邮件给{candidateName}，确认{positionName}职位的后续安排。候选人已确认。";
                result = CommunicatedResult.Interested;
            }
            else if (reason == ContactReason.Notification)
            {
                content = $"发送邮件给{candidateName}，提供{positionName}职位的通知信息。候选人已收到。";
                result = CommunicatedResult.Interested;
            }
            else if (reason == ContactReason.Relationship)
            {
                content = $"发送邮件给{candidateName}，分享行业动态和职业发展建议。候选人表示感谢。";
                result = CommunicatedResult.Interested;
            }
            else
            {
                content = $"发送邮件给{candidateName}，提供{positionName}职位的补充信息。候选人已阅读。";
                result = CommunicatedResult.Interested;
            }
        }
        else // IM
        {
            if (reason == ContactReason.Opportunity)
            {
                content = $"即时消息联系{candidateName}，发送{positionName}职位信息。候选人表示有兴趣了解。";
                result = CommunicatedResult.Interested;
            }
            else if (reason == ContactReason.FollowUp)
            {
                content = $"即时消息通知{candidateName}关于{positionName}职位的后续安排。候选人确认参加。";
                result = CommunicatedResult.Interested;
            }
            else if (reason == ContactReason.Notification)
            {
                content = $"即时消息沟通{candidateName}关于{positionName}职位的通知细节。候选人表示需要考虑。";
                result = CommunicatedResult.Pending;
            }
            else if (reason == ContactReason.Relationship)
            {
                content = $"即时消息联系{candidateName}进行日常关系维护，分享行业资讯。候选人表示收获很大。";
                result = CommunicatedResult.Interested;
            }
            else
            {
                content = $"即时消息联系{candidateName}，讨论{positionName}职位的具体细节。候选人提出了一些问题，已详细解答。";
                result = CommunicatedResult.Interested;
            }
        }

        // 随机添加一些负面结果
        if (random.NextDouble() < 0.2) // 20%的概率生成负面结果
        {
            result = CommunicatedResult.NotInterested;
            content += " 但候选人最终表示不感兴趣。";
        }

        return (content, result);
    }
    #endregion
}