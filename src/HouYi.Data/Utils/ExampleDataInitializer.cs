using HouYi.Models;

namespace HouYi.Data.Utils;

public partial class ExampleDataInitializer
{
    public static void Seed(HouYiDbContext dbContext)
    {
        SeedCustomersData(dbContext);
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
}
