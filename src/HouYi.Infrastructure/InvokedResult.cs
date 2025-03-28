using System.Text.Json.Serialization;

namespace HouYi.Infrastructure;

public record InvokedResult
{
    private static readonly InvokedResult s_Success = new (true, null);
    public bool IsValid { get; init; }
    public string? ErrorMessage { get; init; }

    [JsonConstructor]
    protected InvokedResult(bool isValid, string? errorMessage)
    {
        IsValid = isValid;
        ErrorMessage = !isValid ? errorMessage : null;
    }

    public static InvokedResult Success => s_Success;
    public static InvokedResult Failure(string errorMessage) => new(false, errorMessage);
}

public record InvokedResult<T> : InvokedResult
{
    public T? Value { get; init; }

    internal InvokedResult(bool isValid, string? errorMessage, T? value) : base(isValid, errorMessage)
    {
        Value = value;
    }
    public static InvokedResult<T> Success(T value) => new(true, null, value);
    public static InvokedResult<T> Failure(string errorMessage, T value) => new(false, errorMessage, value);
}