namespace HouYi.Data.Utils;

public partial class SampleAppInitializer
{
    public static void Seed(HouYiDbContext db)
    {
        SeedAreaData(db);
        SeedResumeData(db);
    }
}
