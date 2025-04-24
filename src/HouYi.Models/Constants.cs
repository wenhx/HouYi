namespace HouYi.Models;

public sealed class Constants
{
    public static class StringLengths
    {
        public const int GUID = 36;
        public const int Name = 20;
        public const int PhoneNumber = 11;
        public const int Email = 50;
        public const int Address = 128;
        public const int Description = 128;
        public const int ShorterText = 256;
        public const int ShortText = 512;
        public const int Text = 1024;
        public const int LongText = 2048;
        public const int LongerText = 4096;
    }
    public static class Integers
    {
        public const int MinimumAge = 18;
        public const int MaximumAge = 100;
        public const int MaximumPageIndex = 50;
        public const int MaximumPageSize = 50;
    }
    public static class Categories
    {
    }
    public static class Places
    {
        public const int ChinaId = 10000;
    }
}