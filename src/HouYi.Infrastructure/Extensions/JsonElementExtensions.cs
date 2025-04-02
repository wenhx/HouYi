using System.Text.Json;

namespace HouYi.Infrastructure.Extensions;

public static class JsonElementExtensions
{
    public static object? ToObject(this JsonElement value)
    {
        switch (value.ValueKind)
        {
            case JsonValueKind.String:
                return value.GetString();
            case JsonValueKind.Number:
                var number = value.GetDouble();
                switch (number)
                {
                    case >= Byte.MinValue and <= Byte.MaxValue:
                        return (byte)number;
                    case >= Int16.MinValue and <= Int16.MaxValue:
                        return (short)number;
                    case >= Int32.MinValue and <= Int32.MaxValue:
                        return (int)number;
                    default:
                        return number;
                }
            case JsonValueKind.True:
                return true;
            case JsonValueKind.False:
                return false;
            case JsonValueKind.Null:
                return null;
            default:
                return value.ToString();
        }
    }
}
