namespace HouYi.Client.Pages.Shared;

public sealed class CellValue<T>
{
    public CellValue(T value, bool clientValidationEnabled = true)
    {
        Value = value;
        ClientValidationEnabled = clientValidationEnabled;
    }

    public T Value { get; init; }
    public bool ClientValidationEnabled { get; init; }
    public bool IsValid { get; set; }
    public string? ErrorMessage { get; set; }
}
