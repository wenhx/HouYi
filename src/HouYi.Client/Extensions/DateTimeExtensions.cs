namespace HouYi.Client.Extensions;

public static class DateTimeExtensions
{
    public static string ToRelativeTimeString(this DateTime dateTime)
    {
        var timeSpan = DateTime.Now - dateTime;

        if (timeSpan.TotalMinutes < 10)
            return "刚刚";

        if (timeSpan.TotalHours < 1)
            return $"{(int)timeSpan.TotalMinutes}分钟前";

        if (timeSpan.TotalDays < 1)
            return $"{(int)timeSpan.TotalHours}小时前";

        if (timeSpan.TotalDays < 7)
            return $"{(int)timeSpan.TotalDays}天前";

        if (timeSpan.TotalDays < 30)
            return $"{(int)(timeSpan.TotalDays / 7)}周前";

        if (timeSpan.TotalDays < 365)
            return dateTime.ToString("MM月dd日");

        return dateTime.ToString("yyyy-MM-dd");
    }
}
