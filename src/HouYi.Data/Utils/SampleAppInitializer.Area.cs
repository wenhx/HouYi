using HouYi.Models;
using System.Text.Json;

namespace HouYi.Data.Utils;

partial class SampleAppInitializer
{
    public static void SeedAreaData(HouYiDbContext db)
    {
        if (db.LeveledReferenceData.Count(data => data.Category == Constants.Categories.Area) > 0)
            return;

        var id = 10000;
        var china = new LeveledReferenceData
        {
            Id = id++,
            Code = "86",
            Name = "中国",
            Category = Constants.Categories.Area,
            Level = 1,
            SortOrder = 0,
            IsDeleted = false,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };
        db.ReferenceData.Add(china);

        string json = File.ReadAllText("..\\Area.txt");
        var provinces = JsonSerializer.Deserialize<List<Province>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
        foreach (var province in provinces)
        {
            var provinceEntity = new LeveledReferenceData
            {
                Id = id++,
                Code = province.Code,
                Name = province.Name,
                Category = Constants.Categories.Area,
                Level = 2,
                SortOrder = 0,
                IsDeleted = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                ParentId = china.Id
            };
            db.ReferenceData.Add(provinceEntity);
            foreach (var city in province.City)
            {
                var cityEntity = new LeveledReferenceData
                {
                    Id = id++,
                    Code = city.Code,
                    Name = city.Name,
                    Category = Constants.Categories.Area,
                    Level = 3,
                    SortOrder = 0,
                    IsDeleted = false,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    ParentId = provinceEntity.Id
                };
                db.ReferenceData.Add(cityEntity);

                foreach (var area in city.Area)
                {
                    var areaEntity = new LeveledReferenceData
                    {
                        Id = id++,
                        Code = area.Code,
                        Name = area.Name,
                        Category = Constants.Categories.Area,
                        Level = 4,
                        SortOrder = 0,
                        IsDeleted = false,
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now,
                        ParentId = cityEntity.Id
                    };
                    db.ReferenceData.Add(areaEntity);
                }
            }
            db.SaveChanges();
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
}
