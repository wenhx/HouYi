using HouYi.Models;
using Microsoft.AspNetCore.Identity;
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
                Description = descriptions[i],
                CreateAt = DateTime.Now.AddDays(-daysAgo),
                UpdateAt = DateTime.Now.AddDays(-daysAgo)
            });
        }

        dbContext.Positions.AddRange(positions);
        dbContext.SaveChanges();
        logger.LogInformation("Position data seeded successfully. [{0}]", positions.Count);
    }

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
}
