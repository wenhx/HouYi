namespace HouYi.Services;

public static class Utils
{
    public static void NormalizePaginationInputs(ref int pageNumber, ref int pageSize)
    {
        if (pageNumber <= 0)
        {
            pageNumber = 1;
        }
        if (pageSize != 10 && pageSize != 20 && pageSize != 50)
        {
            pageSize = 10;
        }
    }
}
