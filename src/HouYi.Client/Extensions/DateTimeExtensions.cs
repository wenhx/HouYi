namespace HouYi.Client.Extensions;

public static class DateTimeExtensions
{
    public static string ToRelativeTimeString(this DateTime dateTime)
    {
        var timeSpan = DateTime.Now - dateTime;

        if (timeSpan.TotalMinutes < 10)
            return "�ո�";

        if (timeSpan.TotalHours < 1)
            return $"{(int)timeSpan.TotalMinutes}����֮ǰ";

        if (timeSpan.TotalDays < 1)
            return $"{(int)timeSpan.TotalHours}Сʱ֮ǰ";

        if (timeSpan.TotalDays < 7)
            return $"{(int)timeSpan.TotalDays}��֮ǰ";

        if (timeSpan.TotalDays < 30)
            return $"{(int)(timeSpan.TotalDays / 7)}��֮ǰ";

        return dateTime.ToString("yyyy-MM-dd HH:mm");
    }
}
